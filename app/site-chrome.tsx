"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { EMAIL, NAVIGATION } from "@/lib/content";
function Navigation({ footer = false }: { footer?: boolean }) {
 const pathname = usePathname();
 return <nav className={footer ? "footer-nav" : "main-nav"} aria-label={footer ? "Footer navigation" : "Main navigation"}>
  {NAVIGATION.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
 </nav>;
}
export function Header() {
 return <header className="site-header"><div className="container header-inner">
  <Link href="/" className="brand" aria-label="Alexander Tech Support home"><img className="brand-logo" src="/tech-support-logo.png" alt="" width={80} height={80} /><span>Alexander<span className="brand-subtitle">Tech Support</span></span></Link>
  <Navigation />
 </div></header>;
}
export function Footer() {
 return <footer className="site-footer"><div className="container">
  <div className="footer-top"><div className="footer-identity"><img className="footer-logo" src="/tech-support-logo.png" alt="" width={68} height={68} /><div><p className="footer-brand">Alexander Tech Support</p><p>Technology help, one question at a time.</p></div></div><a className="email-link" href={"mailto:" + EMAIL}><Mail size={23} aria-hidden="true" /><span>{EMAIL}</span></a></div>
  <Navigation footer />
 </div></footer>;
}
