"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function AboutTile() {
 const [expanded, setExpanded] = useState(false);
 const ToggleIcon = expanded ? ChevronUp : ChevronDown;

 return <section className="about-tile" aria-labelledby="about-heading" data-expanded={expanded}>
  <div className="about-heading">
   <h2 id="about-heading">About Me</h2>
  </div>
  <div className="about-image-stage">
   <div className="about-photo">
    <picture>
     <source media="(max-width: 760px)" srcSet="/images/alexander-helping-portrait.jpg" width={1153} height={2048} />
     <img src="/images/alexander-helping-landscape.jpg" width={2048} height={1153} alt="Alexander helping a senior with technology." loading="lazy" decoding="async" />
    </picture>
   </div>
   <div className="about-summary">
    <p>{expanded
     ? "Hi, I am Alexander, the Tech Support Guy. I am committed to helping anyone with any technical issues, whether it is with a phone, laptop, or any other device. I can help with troubleshooting, setting up accounts, changing settings, or any software issue."
     : "Hi, I am Alexander, the Tech Support Guy. I am committed to ...."}</p>
    <div id="about-details" className="about-details" hidden={!expanded}>
     <p>Over the past three years, I have helped hundreds of seniors and people experiencing homelessness with their technology needs. I visit the Gary and Mary Senior Center most Sundays from 11 a.m. to 1 p.m. I also occasionally visit We See You, San Diego, to provide tech support.</p>
     <p>Check the <a href="/visit-schedule">schedule</a> on my website to see when I will be visiting next. If you have any questions about my services or would like to contact me, email me at <a href="mailto:alexandertechhelp@gmail.com">alexandertechhelp@gmail.com</a>.</p>
    </div>
    <button className="about-toggle" type="button" aria-expanded={expanded} aria-controls="about-details" onClick={() => setExpanded(value => !value)}>
     {expanded ? "Show less" : "Show more"}<ToggleIcon size={20} aria-hidden="true" />
    </button>
   </div>
  </div>
 </section>;
}
