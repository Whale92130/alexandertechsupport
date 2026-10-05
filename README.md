# Alexander Tech Support

A separate custom website with four pages, large readable text, and the original Google Forms and Google Calendar workflows.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

The local preview is at http://127.0.0.1:5173. The project is independently deployable and can be moved out of the parent arcade workspace as a complete folder.

## Calendar

`GET /api/schedule` returns the next eight calendar visits. Successful reads are cached for five minutes. Requests expand recurring events, respect exceptions and cancellations, and display Pacific time. Failures return HTTP 503 and an unavailable state; no dates are fabricated.

If `GOOGLE_CALENDAR_API_KEY` is configured as a hosting secret, the endpoint uses Google Calendar API v3 with singleEvents=true, orderBy=startTime and showDeleted=false. Otherwise, or if the API fails, it uses the verified public iCalendar feed of the same calendar. ICAL.js handles recurrence and the feed's time-zone definitions. No visitor sign-in is required by the custom website. Do not commit API keys.

The support request button opens the existing Google Form in the same tab. Submission and response handling remain in Google Forms. /home redirects to /, and /support-form redirects to /get-help#request-help.

## Checks

```sh
node --test tests/schedule.test.ts
node node_modules/typescript/bin/tsc --noEmit
node scripts/check-links.mjs
npm run build
```

Link checking sends anonymous, cookie-free reads and does not submit the support form.

## Launch

The new site can be previewed independently of alexandertechsupport.org. The original site's domain must not be changed until the replacement and target host are verified. A public launch needs a host that accepts the existing custom domain and runs the calendar endpoint. The source supports Cloudflare Workers through the bundled Sites integration. Keep the source project, schedule, and original form available for rollback.

Current source links were carried over from https://www.alexandertechsupport.org/. Library wording was checked against https://www.sandiego.gov/public-library/san-diego-access-4-all. The TruConnect location link is retained; volatile store hours, local phone numbers and device offers are omitted pending provider confirmation.
