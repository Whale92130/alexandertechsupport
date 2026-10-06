import { ArrowLeft } from "lucide-react";

export function BackHome() {
 return <nav className="back-home-bar" aria-label="Page navigation">
  <div className="container">
   <a className="button button-outline" href="/"><ArrowLeft size={22} aria-hidden="true" />Back to Home</a>
  </div>
 </nav>;
}
