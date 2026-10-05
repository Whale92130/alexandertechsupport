import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, MapPin, ShieldCheck } from "lucide-react";
import { PageIntro } from "../page-intro";
import { APP_URL, CLASSES } from "@/lib/content";
export const metadata: Metadata = { title: "Resources & Classes", description: "Class presentations, San Diego library technology help, TruConnect, and Alex’s Phone Cleaner." };
export default function Resources() {
 return <main id="main-content" tabIndex={-1}>
  <PageIntro title="Resources & Classes" />
  <div className="container section content-stack">
   <section className="resource-section" id="class-materials" aria-labelledby="classes-heading"><h2 id="classes-heading"><BookOpen aria-hidden="true" />Class Materials</h2><ul className="class-list">{CLASSES.map(item => <li key={item.url}><a className="class-card" href={item.url}><img src={item.preview} alt="" width={1600} height={900} loading="lazy" /><div><h3>{item.title}</h3><p>{item.summary}</p><span className="class-card-link">View slides <ArrowUpRight size={22} aria-hidden="true" /></span></div></a></li>)}</ul></section>
   <section className="resource-section" id="local-help" aria-labelledby="local-heading"><h2 id="local-heading"><MapPin aria-hidden="true" />Local Help</h2><div className="local-grid">
    <article className="resource-card"><h3>San Diego Public Library</h3><p>Free one-on-one technology help.</p><p>Call <a href="tel:18003506945">1-800-350-6945</a></p><a href="https://www.sandiego.gov/public-library/san-diego-access-4-all" className="button button-outline">Library Tech Help</a></article>
    <article className="resource-card"><h3>Get a free phone</h3><p>TruConnect. Eligibility required.</p><a href="https://maps.app.goo.gl/5KSEH7fe7i6wT8oTA" className="button button-outline">Find TruConnect</a></article>
   </div></section>
   <section className="resource-section" id="android-app" aria-labelledby="app-heading"><h2 id="app-heading"><ShieldCheck aria-hidden="true" />Android Antivirus App</h2><div className="app-panel"><h3>Alex’s Phone Cleaner</h3><a href={APP_URL} className="button button-outline">View on Google Play</a></div></section>
  </div>
 </main>;
}
