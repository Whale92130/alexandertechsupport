import ICAL from "ical.js";
import { CALENDAR_ID } from "./content.ts";
import { TIME_ZONE, type Visit, type ScheduleResult } from "./schedule-types.ts";

type GoogleEvent = { id?: string; summary?: string; status?: string; location?: string; start?: {date?: string; dateTime?: string}; end?: {date?: string; dateTime?: string} };
const label = (value: unknown, fallback: string) => typeof value === "string" && value.trim() ? value.trim().slice(0,500) : fallback;
const todayPacific = (now: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
export function normalizeGoogleEvents(events: GoogleEvent[], now: Date): Visit[] {
 const visits: Visit[] = [];
 for (const event of events) {
  if (event.status === "cancelled" || !event.start || !event.end) continue;
  const allDay = Boolean(event.start.date);
  const start = allDay ? event.start.date : event.start.dateTime;
  const end = allDay ? event.end.date : event.end.dateTime;
  if (!start || !end) continue;
  if (allDay) {
   if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || end <= start || end <= todayPacific(now)) continue;
  } else if (!Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || Date.parse(end) <= now.getTime() || Date.parse(end) <= Date.parse(start)) continue;
  visits.push({id: (event.id || start) + ":" + start, title: label(event.summary,"Visit with Alexander"), start:allDay ? start : new Date(start).toISOString(), end:allDay ? end : new Date(end).toISOString(), allDay, location: label(event.location,"")});
 }
 return visits.sort((a,b) => a.start.localeCompare(b.start));
}

export function parseCalendarFeed(text: string, now: Date): Visit[] {
 if (!text.startsWith("BEGIN:VCALENDAR") || text.length > 2000000) throw new Error("Invalid calendar feed");
 const calendar = new ICAL.Component(ICAL.parse(text));
 const zones = calendar.getAllSubcomponents("vtimezone");
 for (const zone of zones) ICAL.TimezoneService.register(new ICAL.Timezone(zone));
 const calendarZone = ICAL.TimezoneService.get(String(calendar.getFirstPropertyValue("x-wr-timezone") || TIME_ZONE));
 const components = calendar.getAllSubcomponents("vevent");
 const records = components.map(component => new ICAL.Event(component, {exceptions: []}));
 const result = new Map<string,Visit>();
 const horizon = now.getTime() + 730 * 86400000;
 function instant(time: InstanceType<typeof ICAL.Time>) {
  const copy = time.clone();
  if (copy.isDate || copy.zone.tzid === "floating") {
   if (!calendarZone) throw new Error("Calendar time zone is missing");
   copy.isDate = false;
   copy.zone = calendarZone;
  }
  return copy.toJSDate();
 }
 function add(event: InstanceType<typeof ICAL.Event>, start: InstanceType<typeof ICAL.Time>, end: InstanceType<typeof ICAL.Time>, identity: string) {
  if (event.component.getFirstPropertyValue("status") === "CANCELLED") return;
  const startInstant = instant(start), endInstant = instant(end);
  if (!Number.isFinite(startInstant.getTime()) || !Number.isFinite(endInstant.getTime())) throw new Error("Invalid visit time");
  if (endInstant.getTime() <= now.getTime() || endInstant <= startInstant || startInstant.getTime() > horizon) return;
  const allDay = start.isDate;
  result.set(identity, {id:identity, title:label(event.summary,"Visit with Alexander"), start:allDay ? start.toString() : startInstant.toISOString(), end:allDay ? end.toString() : endInstant.toISOString(), allDay, location:label(event.location,"")});
 }
 for (const event of records) {
  if (event.isRecurrenceException() || event.component.getFirstPropertyValue("status") === "CANCELLED") continue;
  const exceptions = records.filter(other => other.uid === event.uid && other.isRecurrenceException());
  const cancelled = new Set(exceptions.filter(other => other.component.getFirstPropertyValue("status") === "CANCELLED").map(other => other.recurrenceId.toString()));
  for (const exception of exceptions) {
   if (exception.component.getFirstPropertyValue("status") !== "CANCELLED") {
    event.relateException(exception);
    // Include rescheduled occurrences even if the original date falls outside the visible window.
    add(exception, exception.startDate, exception.endDate, event.uid + ":" + exception.recurrenceId.toString());
   }
  }
  if (!event.isRecurring()) {
   add(event, event.startDate, event.endDate, event.uid + ":" + event.startDate.toString());
   continue;
  }
  const iterator = event.iterator();
  let finished = false;
  for (let i=0;i<20000;i++) {
   const occurrence = iterator.next();
   if (!occurrence || instant(occurrence).getTime() > horizon) { finished = true; break; }
   if (cancelled.has(occurrence.toString())) continue;
   const details = event.getOccurrenceDetails(occurrence);
   add(details.item, details.startDate, details.endDate, event.uid + ":" + occurrence.toString());
  }
  if (!finished) throw new Error("Calendar recurrence limit exceeded");
 }
 return Array.from(result.values()).sort((a,b) => a.start.localeCompare(b.start)).slice(0,8);
}

export function createScheduleLoader({ fetcher = fetch, apiKey = "", clock = () => new Date() }: { fetcher?: typeof fetch; apiKey?: string; clock?: () => Date } = {}) {
 let cache: { expires: number; value: ScheduleResult } | undefined;
 let pending: Promise<ScheduleResult> | undefined;
 async function fromAPI(now: Date) {
  const signal = AbortSignal.timeout(10000);
  const visits: Visit[] = [];
  let pageToken: string | undefined;
  for (let page=0;page<10;page++) {
   const url = new URL("https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(CALENDAR_ID) + "/events");
   url.search = new URLSearchParams({key:apiKey, singleEvents:"true", showDeleted:"false", orderBy:"startTime", timeMin:now.toISOString(), timeZone:TIME_ZONE, maxResults:"250", ...(pageToken ? {pageToken} : {})}).toString();
   const response = await fetcher(url, {signal, headers:{Accept:"application/json"}});
   if (!response.ok) throw new Error("Calendar API unavailable");
   const data = await response.json() as {items?: GoogleEvent[]; nextPageToken?: string};
   if (!Array.isArray(data.items)) throw new Error("Invalid calendar API response");
   visits.push(...normalizeGoogleEvents(data.items,now));
   pageToken = data.nextPageToken;
   if (!pageToken || visits.length >= 8) return visits.sort((a,b) => a.start.localeCompare(b.start)).slice(0,8);
  }
  throw new Error("Calendar pagination limit exceeded");
 }
 async function load(): Promise<ScheduleResult> {
  const now = clock();
  if (cache && cache.expires > now.getTime()) return cache.value;
  if (pending) return pending;
  pending = (async (): Promise<ScheduleResult> => {
   try {
    let visits: Visit[] | undefined;
    if (apiKey) {
     try { visits = await fromAPI(now); } catch { /* Same public Google calendar remains the fallback. */ }
    }
    if (!visits) {
     const url = "https://calendar.google.com/calendar/ical/" + encodeURIComponent(CALENDAR_ID) + "/public/basic.ics";
     const response = await fetcher(url, {signal:AbortSignal.timeout(8000), headers:{Accept:"text/calendar"}});
     if (!response.ok) throw new Error("Calendar feed unavailable");
     visits = parseCalendarFeed(await response.text(),now);
    }
    const value: ScheduleResult = {status:"ready", visits};
    cache = {expires:clock().getTime()+300000,value};
    return value;
   } catch {
    const value: ScheduleResult = {status:"unavailable",visits:[]};
    cache = {expires:clock().getTime()+30000,value};
    return value;
   } finally { pending = undefined; }
  })();
  return pending;
 }
 return load;
}
