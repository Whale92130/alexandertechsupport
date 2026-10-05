export type Visit = { id: string; title: string; start: string; end: string; allDay: boolean; location: string };
export type ScheduleResult = { status: "ready" | "unavailable"; visits: Visit[] };
export const TIME_ZONE = "America/Los_Angeles";
export function dateForDisplay(visit: Visit) { return new Date(visit.allDay ? visit.start + "T12:00:00Z" : visit.start); }
export function visitDate(visit: Visit) { return new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(dateForDisplay(visit)); }
export function visitTime(visit: Visit) {
 if (visit.allDay) return "All day";
 const f = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" });
 return f.format(new Date(visit.start)) + " to " + f.format(new Date(visit.end));
}
