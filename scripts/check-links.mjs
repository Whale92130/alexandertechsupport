import { CLASSES, FORM_URL, APP_URL, CALENDAR_URL, DIRECTIONS_URL } from "../lib/content.ts";
const urls = [FORM_URL,...CLASSES.map(item=>item.url),APP_URL,CALENDAR_URL,DIRECTIONS_URL,"https://www.sandiego.gov/digital-navigator-program","https://sdfutures.org/digital-skills-classes-1","https://maps.app.goo.gl/5KSEH7fe7i6wT8oTA"];
const results = await Promise.all(urls.map(async url => {
 try {
  const response = await fetch(url,{signal:AbortSignal.timeout(20000)});
  const html = await response.text();
  return {url,status:response.status,finalUrl:response.url,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.slice(0,180),
   ...(url===FORM_URL ? {anonymousFormVisible:html.includes("Tech Support Request") && html.includes("What is your name?"),signInRedirect:response.url.includes("accounts.google.com")} : {})};
 } catch(error) { return {url,error:error.message}; }
}));
console.log(JSON.stringify(results,null,2));
if(results.some(result=>result.error || result.status>=400 || result.anonymousFormVisible===false || result.signInRedirect))process.exitCode=1;
