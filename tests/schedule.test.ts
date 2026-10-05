import test from "node:test";
import assert from "node:assert/strict";
import { createScheduleLoader, normalizeGoogleEvents, parseCalendarFeed } from "../lib/schedule.ts";
import { visitDate, visitTime } from "../lib/schedule-types.ts";
const now = new Date("2026-10-04T19:00:00Z");
const calendar = (events: string) => ["BEGIN:VCALENDAR","VERSION:2.0","X-WR-TIMEZONE:America/Los_Angeles",
"BEGIN:VTIMEZONE","TZID:America/Los_Angeles",
"BEGIN:DAYLIGHT","TZOFFSETFROM:-0800","TZOFFSETTO:-0700","DTSTART:19700308T020000","RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU","END:DAYLIGHT",
"BEGIN:STANDARD","TZOFFSETFROM:-0700","TZOFFSETTO:-0800","DTSTART:19701101T020000","RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU","END:STANDARD","END:VTIMEZONE",events,"END:VCALENDAR"].join("\r\n");
const weekly = ["BEGIN:VEVENT","UID:weekly","DTSTART;TZID=America/Los_Angeles:20261004T110000","DTEND;TZID=America/Los_Angeles:20261004T130000","RRULE:FREQ=WEEKLY;COUNT=12","EXDATE;TZID=America/Los_Angeles:20261018T110000","SUMMARY:Alexander at GMW","LOCATION:Senior Wellness Center","END:VEVENT"].join("\r\n");
const moved = ["BEGIN:VEVENT","UID:weekly","RECURRENCE-ID;TZID=America/Los_Angeles:20261011T110000","DTSTART;TZID=America/Los_Angeles:20261012T140000","DTEND;TZID=America/Los_Angeles:20261012T160000","SUMMARY:Rescheduled visit","LOCATION:Different room","END:VEVENT"].join("\r\n");
const cancelled = ["BEGIN:VEVENT","UID:weekly","RECURRENCE-ID;TZID=America/Los_Angeles:20261025T110000","STATUS:CANCELLED","END:VEVENT"].join("\r\n");
test("recurring visits respect exclusions, moved dates, cancellations, and the eight-visit limit", () => {
 const visits = parseCalendarFeed(calendar([weekly,moved,cancelled].join("\r\n")),now);
 assert.equal(visits.length,8);
 assert.equal(visits[0].start,"2026-10-04T18:00:00.000Z");
 assert.equal(visits[1].start,"2026-10-12T21:00:00.000Z");
 assert.equal(visits[1].title,"Rescheduled visit");
 assert.equal(visits[1].location,"Different room");
 assert.ok(!visits.some(v => v.start.includes("2026-10-18") || v.start.includes("2026-10-25")));
 assert.equal(visits[2].start,"2026-11-01T19:00:00.000Z");
 assert.equal(visitTime(visits[2]),"11:00 AM – 1:00 PM Pacific");
});
test("expired visits are removed without removing a visit currently in progress", () => {
 assert.equal(parseCalendarFeed(calendar(weekly),now)[0].start,"2026-10-04T18:00:00.000Z");
 assert.equal(parseCalendarFeed(calendar(weekly),new Date("2026-10-04T20:00:00Z"))[0].start,"2026-10-11T18:00:00.000Z");
});
test("all-day dates retain the Pacific date and use their exclusive end date", () => {
 const event=["BEGIN:VEVENT","UID:all-day","DTSTART;VALUE=DATE:20261004","DTEND;VALUE=DATE:20261005","SUMMARY:All day","END:VEVENT"].join("\r\n");
 const visits=parseCalendarFeed(calendar(event),now);
 assert.equal(visits.length,1);
 assert.equal(visits[0].start,"2026-10-04");
 assert.equal(visitDate(visits[0]),"Sunday, October 4, 2026");
 assert.equal(visitTime(visits[0]),"All day");
 assert.equal(parseCalendarFeed(calendar(event),new Date("2026-10-05T07:00:00Z")).length,0);
});
test("Google API normalization removes cancelled, invalid and ended events", () => {
 const event={id:"good",summary:"Visit",start:{dateTime:"2026-10-11T11:00:00-07:00"},end:{dateTime:"2026-10-11T13:00:00-07:00"}};
 const visits=normalizeGoogleEvents([event,{...event,id:"cancel",status:"cancelled"},{id:"bad",start:{dateTime:"invalid"},end:{dateTime:"invalid"}}],now);
 assert.equal(visits.length,1);
 assert.equal(visits[0].title,"Visit");
});
test("the loader uses the API when configured and requests expanded, ordered events", async () => {
 let requested="";
 const fetcher: typeof fetch = async input => { requested=String(input); return Response.json({items:[{id:"one",start:{dateTime:"2026-10-11T18:00:00Z"},end:{dateTime:"2026-10-11T20:00:00Z"}}]}); };
 const load=createScheduleLoader({fetcher,apiKey:"test-only",clock:()=>now});
 assert.equal((await load()).visits.length,1);
 const url=new URL(requested);
 assert.equal(url.searchParams.get("singleEvents"),"true");
 assert.equal(url.searchParams.get("orderBy"),"startTime");
 assert.equal(url.searchParams.get("showDeleted"),"false");
 assert.equal(url.searchParams.get("timeZone"),"America/Los_Angeles");
});
test("API failure falls back to the same public calendar", async () => {
 let calls=0;
 const fetcher: typeof fetch = async () => { calls++; return calls===1 ? new Response("",{status:403}) : new Response(calendar(weekly)); };
 const load=createScheduleLoader({fetcher,apiKey:"test-only",clock:()=>now});
 assert.equal((await load()).status,"ready");
 assert.equal(calls,2);
});
test("the five-minute cache refreshes calendar changes and combines concurrent requests", async () => {
 let calls=0, time=now.getTime();
 const fetcher: typeof fetch = async () => { calls++; return new Response(calendar(calls===1 ? weekly : "")); };
 const load=createScheduleLoader({fetcher,clock:()=>new Date(time)});
 const values=await Promise.all([load(),load(),load()]);
 assert.ok(values.every(value=>value.visits.length===8));
 assert.equal(calls,1);
 time+=299999;
 await load(); assert.equal(calls,1);
 time+=1;
 assert.equal((await load()).visits.length,0);
 assert.equal(calls,2);
});
test("upstream failure yields unavailable rather than invented or old dates", async () => {
 const load=createScheduleLoader({fetcher:async()=>{throw new Error("Network down");},clock:()=>now});
 assert.deepEqual(await load(),{status:"unavailable",visits:[]});
});
test("a valid calendar with no upcoming visits is a successful empty state", async () => {
 const load=createScheduleLoader({fetcher:async()=>new Response(calendar("")),clock:()=>now});
 assert.deepEqual(await load(),{status:"ready",visits:[]});
});
