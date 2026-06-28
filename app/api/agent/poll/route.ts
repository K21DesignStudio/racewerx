import { handleAgentPoll, verifyAgentSecret, type AgentPollBody } from "@/lib/podControl";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!verifyAgentSecret(request)) {
    return Response.json({ error: "Unauthorized agent" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as AgentPollBody | null;

  if (!body?.podId) {
    return Response.json({ error: "podId is required" }, { status: 400 });
  }

  return Response.json(
    await handleAgentPoll(body),
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
