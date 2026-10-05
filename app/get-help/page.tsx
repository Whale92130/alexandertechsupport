import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "../page-intro";
import { EMAIL, FORM_URL } from "@/lib/content";
export const metadata: Metadata = { title: "Get Help", description: "Ask Alexander a technology question and choose help by video guide, in person, or both." };
export default function GetHelp() {
 return <main id="main-content" tabIndex={-1}>
  <PageIntro title="Ask Alexander for help"><p>Tell me what you need help with. You do not need to know the technical words.</p></PageIntro>
  <div className="container section content-stack">
   <section className="callout reading-width" id="request-help" aria-labelledby="request-heading"><h2 id="request-heading">Start with a support request</h2><p>Share your name, describe your question, and choose how you would like help.</p><p className="small-note">The button opens the existing Google Form in this tab.</p><a className="button" href={FORM_URL}>Open Support Form</a></section>
   <section aria-labelledby="options-heading"><h2 id="options-heading">Choose the help that works for you</h2><ol className="help-options">
    <li><span className="option-number" aria-hidden="true">1</span><h3>A video guide</h3><p>Choose “By a video guide” in the form for a guide you can watch.</p></li>
    <li><span className="option-number" aria-hidden="true">2</span><h3>Help in person</h3><p>Choose “In person on Sunday” and check the schedule for Alexander’s next visit.</p></li>
    <li><span className="option-number" aria-hidden="true">3</span><h3>Both</h3><p>Choose “Both” if you would like a video guide and help during a visit.</p></li>
   </ol><Link href="/visit-schedule">View the visit schedule</Link></section>
   <section className="reading-width" aria-labelledby="email-heading"><h2 id="email-heading">Prefer to email?</h2><p>You can also send your question directly to Alexander.</p><div className="contact-actions"><a className="email-link" href={"mailto:" + EMAIL}>{EMAIL}</a></div></section>
  </div>
 </main>;
}