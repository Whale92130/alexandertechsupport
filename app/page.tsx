import Link from "next/link";
import { BookOpen, MapPin, ClipboardList, ShieldCheck } from "lucide-react";
import { APP_URL, FORM_URL } from "@/lib/content";
import { VisitPanel } from "./visit-panel";
export default function Home() {
 return <main id="main-content" tabIndex={-1} className="container home-dashboard">
  <VisitPanel compact primaryHeading />
  <nav className="home-actions" aria-label="Main actions">
   <a className="home-action" href={APP_URL}><ShieldCheck size={36} aria-hidden="true" /><span><strong>Antivirus App</strong><span className="action-note">For Android · Google Play</span></span></a>
   <Link className="home-action" href="/resources#class-materials"><BookOpen size={36} aria-hidden="true" /><strong>Class Presentations</strong></Link>
   <Link className="home-action" href="/resources#local-help"><MapPin size={36} aria-hidden="true" /><strong>Local Help</strong></Link>
   <a className="home-action" href={FORM_URL}><ClipboardList size={36} aria-hidden="true" /><span><strong>Support Form</strong><span className="action-note">Opens Google Forms</span></span></a>
  </nav>
 </main>;
}
