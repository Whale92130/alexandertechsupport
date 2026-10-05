import type { Metadata } from "next";
import { BookOpen, MapPin, ShieldCheck } from "lucide-react";
import { PageIntro } from "../page-intro";
import { APP_URL, CLASSES } from "@/lib/content";
export const metadata: Metadata = { title: "Resources & Classes", description: "Explore Alexander’s class materials, San Diego library technology help, phone assistance, and the Android antivirus app." };
export default function Resources() {
 return <main id="main-content" tabIndex={-1}>
  <PageIntro title="Resources & Classes"><p>Class materials to revisit and local places to find more help.</p><nav className="resource-jumps" aria-label="Resource sections"><a href="#class-materials">Class Materials</a><a href="#local-help">Local Help</a><a href="#android-app">Android Antivirus App</a></nav></PageIntro>
  <div className="container section content-stack">
   <section className="resource-section" id="class-materials" aria-labelledby="classes-heading"><h2 id="classes-heading"><BookOpen aria-hidden="true" />Class Materials</h2><p>Open a class presentation to review the slides at your own pace. Each link opens Google Slides in this tab.</p><ul className="class-list">{CLASSES.map(item => <li key={item.url}><h3><a href={item.url}>{item.title}</a></h3><p>{item.summary}</p></li>)}</ul></section>
   <section className="resource-section" id="local-help" aria-labelledby="local-heading"><h2 id="local-heading"><MapPin aria-hidden="true" />Local Help</h2><div className="local-grid">
    <article className="resource-card"><h3>San Diego Public Library</h3><p>The Digital Navigator program offers free one-on-one technology help, including basic support, computer skills, and help finding affordable internet.</p><p>Call <a href="tel:18003506945">1-800-350-6945</a> for help or to ask about an in-person appointment.</p><a href="https://www.sandiego.gov/public-library/san-diego-access-4-all">View Library Tech Support</a></article>
    <article className="resource-card"><h3>Phone assistance</h3><p>Ask TruConnect about phone assistance and whether you qualify. Check with the provider for current availability.</p><a href="https://maps.app.goo.gl/5KSEH7fe7i6wT8oTA">Find the San Diego TruConnect location</a></article>
   </div></section>
   <section className="resource-section" id="android-app" aria-labelledby="app-heading"><h2 id="app-heading"><ShieldCheck aria-hidden="true" />Android Antivirus App</h2><div className="app-panel"><div><h3>Alex’s Phone Cleaner</h3><p>View the app’s listing on Google Play to learn about it and check device compatibility.</p><p className="small-note">For Android devices. The button opens Google Play.</p></div><a href={APP_URL} className="button button-outline">View App on Google Play</a></div></section>
  </div>
 </main>;
}
