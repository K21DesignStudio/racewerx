import { queuePodVolume, type VolumeCommand } from "@/lib/podControl";

export const dynamic = "force-dynamic";

function parseVolume(body: VolumeCommand | null) {
  const volume: VolumeCommand = {};

  if (typeof body?.level === "number" && Number.isFinite(body.level)) {
    volume.level = Math.max(0, Math.min(100, Math.round(body.level)));
  }

  if (typeof body?.muted === "boolean") {
    volume.muted = body.muted;
  }

  return volume;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ podId: string }> }
) {
  const { podId } = await context.params;
  const body = (await request.json().catch(() => null)) as VolumeCommand | null;
  const volume = parseVolume(body);

  if (volume.level === undefined && volume.muted === undefined) {
    return Response.json({ error: "Volume command requires level or muted" }, { status: 400 });
  }

  try {
    return Response.json(
      { ok: true, pod: await queuePodVolume(podId, volume) },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Volume command failed" },
      { status: 409, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
