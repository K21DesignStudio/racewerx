import { NextResponse } from "next/server";

type PortalPodState = "STANDBY" | "UNLOCKED" | "LOCKED" | "OFFLINE";

type PortalPod = {
  id?: string;
  name?: string;
  state?: PortalPodState;
  lastSeen?: string | null;
};

function statusFor(state?: PortalPodState) {
  if (state === "LOCKED") return "locked";
  if (state === "UNLOCKED") return "unlocked";
  if (state === "STANDBY") return "standby";
  return "offline";
}

function numberFromPortalId(id?: string) {
  const match = String(id || "").match(/pod-(\d+)/i);
  return match ? Number(match[1]) : null;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const agentBaseUrl =
    process.env.SIM_LOCK_AGENT_URL ?? "https://sim-lock-portal.vercel.app";
  const statusPath =
    process.env.SIM_LOCK_STATUS_PATH ?? "/api/bridge/status";

  const controller = new AbortController();
  const timeout = Number(process.env.SIM_LOCK_TIMEOUT_MS ?? 8000);
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(new URL(statusPath, agentBaseUrl).toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-bridge-key":
          process.env.SIM_LOCK_AGENT_TOKEN ?? "racewerx-bridge-secret-001",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok || !payload?.ok || !Array.isArray(payload.pods)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Sim Lock agent rejected the status request",
          status: response.status,
          agent: payload,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        pods: payload.pods
          .map((pod: PortalPod) => {
            const id = numberFromPortalId(pod.id);
            return id == null
              ? null
              : {
                  id,
                  status: statusFor(pod.state),
                  name: pod.name,
                  lastSeen: pod.lastSeen ?? null,
                };
          })
          .filter(Boolean),
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach Sim Lock agent";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
