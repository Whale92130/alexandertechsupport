import { env } from "cloudflare:workers";
import { createScheduleLoader } from "@/lib/schedule";
export const dynamic = "force-dynamic";
let loader: ReturnType<typeof createScheduleLoader> | undefined;
export async function GET() {
 const apiKey = (env as { GOOGLE_CALENDAR_API_KEY?: string }).GOOGLE_CALENDAR_API_KEY || "";
 loader ??= createScheduleLoader({apiKey});
 const result = await loader();
 return Response.json(result, { status: result.status === "ready" ? 200 : 503, headers: {
  "Cache-Control": result.status === "ready" ? "public, max-age=300" : "no-store",
  "X-Content-Type-Options": "nosniff",
 }});
}
