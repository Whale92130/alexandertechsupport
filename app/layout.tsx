import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "./site-chrome";
export const metadata: Metadata = {
 title: { default: "Alexander Tech Support", template: "%s | Alexander Tech Support" },
 description: "Friendly technology help in San Diego. Ask Alexander a question, find upcoming visits, and explore class materials and local resources.",
 icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><Header />{children}<Footer /></body></html>;
}
