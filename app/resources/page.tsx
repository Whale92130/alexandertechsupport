import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, MapPin, ShieldCheck } from "lucide-react";
import { PageIntro } from "../page-intro";
import { BackHome } from "../back-home";
import { APP_URL, CLASSES } from "@/lib/content";
export const metadata: Metadata = { title: "Resources & Classes", description: "Class presentations, San Diego library technology help, TruConnect, and Alex’s Phone Cleaner." };
export default function Resources() {
 return <main id="main-content" tabIndex={-1}>
  <BackHome />
  <PageIntro title="Resources & Classes" />
  <div className="container section content-stack">
   <section className="resource-section" id="class-materials" aria-labelledby="classes-heading"><h2 id="classes-heading"><BookOpen aria-hidden="true" />Class Materials</h2><ul className="class-list">{CLASSES.map(item => <li key={item.url}><a className="class-card" href={item.url}><img src={item.preview} alt="" width={1600} height={900} loading="lazy" /><div><h3>{item.title}</h3><p>{item.summary}</p><span className="class-card-link">View slides <ArrowUpRight size={22} aria-hidden="true" /></span></div></a></li>)}</ul></section>
   <section className="resource-section" id="local-help" aria-labelledby="local-heading"><h2 id="local-heading"><MapPin aria-hidden="true" />Local Help</h2><div className="local-grid">
    <article className="resource-card">
     <h3>Get a free phone</h3>
     <p>Visit TruConnect to see if you qualify.</p>
     <address>1131 Broadway<br />San Diego, CA 92101</address>
     <p>Between Eleventh Ave and Park Blvd.</p>
     <p>Call <a href="tel:+16193433690">(619) 343-3690</a></p>
     <ul className="local-hours">
      <li><strong>Monday to Saturday:</strong><br />10 a.m. to 7 p.m.</li>
      <li><strong>Sunday:</strong><br />10 a.m. to 6 p.m.</li>
     </ul>
     <a href="https://maps.app.goo.gl/5KSEH7fe7i6wT8oTA" className="button button-outline">Find TruConnect</a>
    </article>
    <article className="resource-card">
     <h3>Digital Navigators</h3>
     <p>San Diego Public Library</p>
     <p>Free, one-on-one assistance for San Diegans with:</p>
     <ul className="local-services">
      <li>Obtaining low-cost computers</li>
      <li>Signing up for affordable internet</li>
      <li>Improving computer skills</li>
      <li>Basic tech support</li>
     </ul>
     <p>Call for help by phone or to schedule an in-person appointment.</p>
     <p>Call <a href="tel:18003506945">1-800-350-6945</a></p>
     <a href="https://www.sandiego.gov/digital-navigator-program" className="button button-outline">Library Tech Help</a>
    </article>
    <article className="resource-card">
     <h3>Tech on the Go</h3>
     <p>Free in-person classes for San Diegans to learn computer and internet skills.</p>
     <p>Classes are held at libraries and community centers. All skill levels welcome.</p>
     <a href="https://sdfutures.org/digital-skills-classes-1" className="button button-outline">View Class Schedule</a>
    </article>
   </div></section>
   <section className="resource-section" id="android-app" aria-labelledby="app-heading"><h2 id="app-heading"><ShieldCheck aria-hidden="true" />Android Antivirus App</h2><div className="app-panel"><h3>Alex’s Phone Cleaner</h3><a href={APP_URL} className="button button-outline">View on Google Play</a></div></section>
  </div>
 </main>;
}
