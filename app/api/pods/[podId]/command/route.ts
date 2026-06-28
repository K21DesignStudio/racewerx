import { queuePodCommand, type RemoteCommand } from "@/lib/podControl";

const allowed = new Set<RemoteCommand>(["lock", "unlock", "unblocked", "timed"]);

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ podId: string }> }
) {
  const { podId } = await context.params;
  const body = (await request.json().catch(() => null)) as { command?: RemoteCommand } | null;

  if (!body?.command || !allowed.has(body.command)) {
    return Response.json({ error: "Invalid command" }, { status: 400 });
  }

  return Response.json(
    { ok: true, pod: await queuePodCommand(podId, body.command as Exclude<RemoteCommand, "none" | "volume">) },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
