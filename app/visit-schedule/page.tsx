import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageIntro } from "../page-intro";
import { VisitPanel, UpcomingVisits } from "../visit-panel";
import { ADDRESS, CENTER, DIRECTIONS_URL, EMAIL } from "@/lib/content";
export const metadata: Metadata = { title: "Visit Schedule", description: "Find Alexander’s next visit at the Gary and Mary West Senior Wellness Center in San Diego." };
export default function VisitSchedule() {
 return <main id="main-content" tabIndex={-1}>
  <PageIntro title="Visit Alexander in person"><p>Find the next visit at the senior wellness center. Check the dates before you come.</p></PageIntro>
  <div className="container section content-stack">
   <div className="schedule-layout"><div className="content-stack"><VisitPanel /><section aria-labelledby="upcoming-heading"><h2 id="upcoming-heading">Upcoming visits</h2><p className="small-note">All times are Pacific time.</p><UpcomingVisits /></section></div>
    <aside className="location-card" aria-labelledby="location-heading"><span className="icon-box"><MapPin aria-hidden="true" /></span><h2 id="location-heading">Where to find Alexander</h2><address><strong>{CENTER}</strong><br />{ADDRESS}</address><a className="button button-outline" href={DIRECTIONS_URL}>Get Directions</a><p className="small-note" style={{ marginTop: 24 }}>Have a question about your visit?</p><a href={"mailto:" + EMAIL}>Email Alexander</a></aside>
   </div>
  </div>
 </main>;
}