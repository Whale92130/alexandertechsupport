import Link from "next/link";
export default function NotFound() {
 return <main id="main-content" tabIndex={-1} className="container error-page"><h1>This page could not be found.</h1><p>You can return to the homepage or ask Alexander for help.</p><div className="contact-actions" style={{justifyContent:"center"}}><Link className="button" href="/">Go to Home</Link><Link className="button button-outline" href="/get-help">Get Help</Link></div></main>;
}