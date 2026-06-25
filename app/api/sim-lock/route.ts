import { NextResponse } from "next/server";

type SimLockAction =
  | "lock"
  | "unlock"
  | "standby"
  | "lock-all"
  | "unlock-all"
  | "standby-all";

interface SimLockCommand {
  action?: SimLockAction;
  podId?: number;
}

const DEFAULT_PATHS: Record<SimLockAction, string> = {
  lock: "/api/bridge/command",
  unlock: "/api/bridge/command",
  standby: "/api/bridge/command",
  "lock-all": "/api/bridge/command",
  "unlock-all": "/api/bridge/command",
  "standby-all": "/api/bridge/command",
};

const PATH_ENV: Record<SimLockAction, string> = {
  lock: "SIM_LOCK_LOCK_PATH",
  unlock: "SIM_LOCK_UNLOCK_PATH",
  standby: "SIM_LOCK_STANDBY_PATH",
  "lock-all": "SIM_LOCK_LOCK_ALL_PATH",
  "unlock-all": "SIM_LOCK_UNLOCK_ALL_PATH",
  "standby-all": "SIM_LOCK_STANDBY_ALL_PATH",
};

function isAction(value: unknown): value is SimLockAction {
  return (
    value === "lock" ||
    value === "unlock" ||
    value === "standby" ||
    value === "lock-all" ||
    value === "unlock-all" ||
    value === "standby-all"
  );
}

function buildAgentUrl(baseUrl: string, action: SimLockAction, podId?: number) {
  const pathTemplate =
    process.env[PATH_ENV[action]] ?? DEFAULT_PATHS[action];
  const path = pathTemplate.replace("{podId}", String(podId ?? ""));
  return new URL(path, baseUrl).toString();
}

function portalPodId(podId?: number) {
  return typeof podId === "number" ? `pod-${podId}` : undefined;
}

export async function POST(request: Request) {
  let command: SimLockCommand;

  try {
    command = (await request.json()) as SimLockCommand;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid Sim Lock command JSON" },
      { status: 400 }
    );
  }

  if (!isAction(command.action)) {
    return NextResponse.json(
      { ok: false, error: "Unknown Sim Lock action" },
      { status: 400 }
    );
  }

  if (
    (command.action === "lock" ||
      command.action === "unlock" ||
      command.action === "standby") &&
    typeof command.podId !== "number"
  ) {
    return NextResponse.json(
      { ok: false, error: "podId is required for this Sim Lock action" },
      { status: 400 }
    );
  }

  const agentBaseUrl =
    process.env.SIM_LOCK_AGENT_URL ?? "https://sim-lock-portal.vercel.app";

  const controller = new AbortController();
  const timeout = Number(process.env.SIM_LOCK_TIMEOUT_MS ?? 8000);
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(
      buildAgentUrl(agentBaseUrl, command.action, command.podId),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-bridge-key":
            process.env.SIM_LOCK_AGENT_TOKEN ?? "racewerx-bridge-secret-001",
          ...(process.env.SIM_LOCK_AGENT_TOKEN
            ? { Authorization: `Bearer ${process.env.SIM_LOCK_AGENT_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({
          ...command,
          podId: portalPodId(command.podId),
        }),
        signal: controller.signal,
      }
    );

    const text = await response.text();
    let agentPayload: unknown = null;

    if (text) {
      try {
        agentPayload = JSON.parse(text);
      } catch {
        agentPayload = { message: text };
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Sim Lock agent rejected the command",
          status: response.status,
          agent: agentPayload,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      action: command.action,
      podId: command.podId,
      agent: agentPayload,
    });
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
