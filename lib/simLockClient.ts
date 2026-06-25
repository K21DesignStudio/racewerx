export type SimLockAction =
  | "lock"
  | "unlock"
  | "standby"
  | "lock-all"
  | "unlock-all"
  | "standby-all";

export interface SimLockCommandResult {
  ok: boolean;
  action: SimLockAction;
  podId?: number;
  simulated?: boolean;
  message?: string;
}

export async function sendSimLockCommand(
  action: SimLockAction,
  podId?: number
): Promise<SimLockCommandResult> {
  const response = await fetch("/api/sim-lock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, podId }),
  });

  const payload = (await response
    .json()
    .catch(() => ({ ok: false, message: "Invalid Sim Lock response" }))) as
    | SimLockCommandResult
    | { ok: false; message?: string; error?: string };

  if (!response.ok || !payload.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : payload.message || "Sim Lock command failed"
    );
  }

  return payload;
}
