import { listPods } from "@/lib/podControl";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { ok: true, pods: await listPods() },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
