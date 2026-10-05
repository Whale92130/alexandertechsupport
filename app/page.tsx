import Link from "next/link";
import { BookOpen, MapPin, MessageCircle } from "lucide-react";
import { VisitPanel } from "./visit-panel";
export default function Home() {
 return <main id="main-content" tabIndex={-1}>
  <section className="home-hero"><div className="container hero-grid">
   <div className="hero-copy"><p className="eyebrow">Technology help in San Diego</p><h1>Friendly help with your technology.</h1><p className="lead">Have a question about your phone, computer, or tablet? Ask Alexander for help, or come by an upcoming visit.</p><Link href="/get-help" className="button">Ask Alexander for Help</Link></div>
   <VisitPanel compact />
  </div></section>
  <section className="section container" aria-labelledby="start-heading"><div className="section-heading"><p className="eyebrow">A clear place to start</p><h2 id="start-heading">How can I help?</h2></div>
   <div className="card-grid">
    <article className="action-card"><span className="icon-box"><MessageCircle aria-hidden="true" /></span><h3>Ask a question</h3><p>Describe what you need help with and choose a video guide, an in-person visit, or both.</p><Link href="/get-help">Find out how to get help</Link></article>
    <article className="action-card"><span className="icon-box"><MapPin aria-hidden="true" /></span><h3>Visit in person</h3><p>Find Alexander’s upcoming dates at the Gary and Mary West Senior Wellness Center.</p><Link href="/visit-schedule">See the visit schedule</Link></article>
    <article className="action-card"><span className="icon-box"><BookOpen aria-hidden="true" /></span><h3>Learn at your pace</h3><p>Revisit class materials and find local technology support and phone assistance.</p><Link href="/resources">View Classes & Resources</Link></article>
   </div>
  </section>
 </main>;
}
