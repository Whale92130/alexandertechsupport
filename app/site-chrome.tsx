"use client";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { EMAIL, NAVIGATION } from "@/lib/content";
function FooterNavigation() {
 const pathname = usePathname();
 return <nav className="footer-nav" aria-label="Footer navigation">
  {NAVIGATION.map(({ href, label }) => <a key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</a>)}
 </nav>;
}
export function Header() {
 return <header className="site-header"><div className="container header-inner">
  <a href="/" className="brand" aria-label="Alexander Tech Support home"><img className="brand-logo" src="/tech-support-logo.png" alt="" width={80} height={80} /><span>Alexander Tech Support</span></a>
 </div></header>;
}
export function Footer() {
 return <footer className="site-footer"><div className="container">
  <div className="footer-top"><div className="footer-identity"><img className="footer-logo" src="/tech-support-logo.png" alt="" width={68} height={68} /><p className="footer-brand">Alexander Tech Support</p></div><a className="email-link" href={"mailto:" + EMAIL}><Mail size={23} aria-hidden="true" /><span>{EMAIL}</span></a></div>
  <FooterNavigation />
 </div></footer>;
}
