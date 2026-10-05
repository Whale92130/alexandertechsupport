"use client";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { CALENDAR_URL, EMAIL } from "@/lib/content";
import { TIME_ZONE, dateForDisplay, visitDate, visitTime, type ScheduleResult } from "@/lib/schedule-types";
let pendingRequest: Promise<ScheduleResult> | undefined;
async function readSchedule(): Promise<ScheduleResult> {
 if (pendingRequest) return pendingRequest;
 pendingRequest = fetch("/api/schedule", { signal: AbortSignal.timeout(20000) }).then(async response => {
  if (!response.ok) throw new Error("Schedule unavailable");
  const data = await response.json() as ScheduleResult;
  if (data.status !== "ready" || !Array.isArray(data.visits)) throw new Error("Invalid schedule");
  return data;
 }).catch(() => ({ status: "unavailable" as const, visits: [] })).finally(() => { pendingRequest = undefined; });
 return pendingRequest;
}
function useSchedule() {
 const [schedule, setSchedule] = useState<ScheduleResult | null>(null);
 useEffect(() => {
  let active = true;
  const update = async () => { const result = await readSchedule(); if (active) setSchedule(result); };
  void update();
  const interval = window.setInterval(update, 300000);
  const onVisible = () => { if (document.visibilityState === "visible") void update(); };
  document.addEventListener("visibilitychange", onVisible);
  return () => { active = false; window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); };
 }, []);
 return schedule;
}
function ScheduleStatus({ schedule }: { schedule: ScheduleResult | null }) {
 if (!schedule) return <p className="schedule-loading" role="status">Checking the visit schedule…</p>;
 return <div className="status-message"><h3>{schedule.status === "unavailable" ? "The schedule is temporarily unavailable." : "No upcoming visits are listed."}</h3><p>Check the original calendar or email Alexander for visit details.</p><div className="panel-links"><a href={CALENDAR_URL}>Open Google Calendar</a><a href={"mailto:" + EMAIL}>Email Alexander</a></div></div>;
}
export function VisitPanel({ compact = false }: { compact?: boolean }) {
 const schedule = useSchedule();
 const visit = schedule?.visits[0];
 return <section className={"visit-panel " + (compact ? "compact" : "")} aria-labelledby="next-visit-heading">
  <div className="panel-label"><CalendarDays size={25} aria-hidden="true" /><h2 id="next-visit-heading">Next visit with Alexander</h2></div>
  <div aria-live="polite" aria-atomic="true">{visit ? <><h3 className="visit-date"><time dateTime={visit.start}>{visitDate(visit)}</time></h3><p className="visit-time">{visitTime(visit)}</p><p className="visit-location">{visit.location || "Check the calendar for the location."}</p></> : <ScheduleStatus schedule={schedule} />}</div>
  {compact && <Link className="button button-outline" href="/visit-schedule">View Visit Schedule</Link>}
 </section>;
}
export function UpcomingVisits() {
 const schedule = useSchedule();
 if (!schedule?.visits.length) return <div aria-live="polite"><ScheduleStatus schedule={schedule} /></div>;
 return <ol className="schedule-list" aria-label="Next eight visits">{schedule.visits.map(visit => {
  const date = dateForDisplay(visit);
  return <li key={visit.id} className="visit-row"><div className="date-tile" aria-hidden="true"><span>{new Intl.DateTimeFormat("en-US", { month: "short", timeZone: TIME_ZONE }).format(date)}</span><strong>{new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: TIME_ZONE }).format(date)}</strong></div><div><h3><time dateTime={visit.start}>{visitDate(visit)}</time></h3><p className="visit-time">{visitTime(visit)}</p><p>{visit.title}</p><p>{visit.location || "Check the calendar for the location."}</p></div></li>;
 })}</ol>;
}
