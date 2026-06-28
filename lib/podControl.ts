import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const STORAGE_KEY = "racewerx:pod-control:v1";
const LOCAL_STATE_FILE = path.join(process.cwd(), ".data", "racewerx-pods.json");
const OFFLINE_GRACE_MS = 15000;

export type RemotePodState = "LOCKED" | "UNLOCKED" | "STANDBY" | "OFFLINE";
export type RemoteCommand = "lock" | "unlock" | "unblocked" | "timed" | "volume" | "none";

export type VolumeCommand = {
  level?: number;
  muted?: boolean;
};

export type QueuedCommand = {
  id: number;
  command: Exclude<RemoteCommand, "none">;
  label: string;
  volume?: VolumeCommand;
  createdAt: string;
};

export type RemotePod = {
  id: string;
  name: string;
  state: RemotePodState;
  detail: string;
  countdown: string;
  agentVersion: string;
  version: string;
  updateStatus: string;
  localUrl?: string;
  volumeLevel?: number;
  volumeMuted?: boolean;
  lastSeen: string | null;
  lastCommandId: number;
  lastAckCommandId: number;
  pendingCommand: RemoteCommand;
  pendingCommandLabel: string;
  commandQueue: QueuedCommand[];
  log: string[];
};

export type AgentPollBody = {
  podId: string;
  podName?: string;
  state?: RemotePodState;
  detail?: string;
  countdown?: string;
  version?: string;
  agentVersion?: string;
  updateStatus?: string;
  localUrl?: string;
  volumeLevel?: number;
  volumeMuted?: boolean;
  log?: string[];
  ackCommandId?: number;
};

type PortalState = {
  pods: Record<string, RemotePod>;
  update: {
    desiredVersion: string;
    downloadUrl: string;
    notes: string;
  };
};

declare global {
  var racewerxPodState: PortalState | undefined;
}

function nowIso() {
  return new Date().toISOString();
}

function defaultPod(id: string): RemotePod {
  const label = id.replace("pod-", "POD ").toUpperCase();

  return {
    id,
    name: label,
    state: "OFFLINE",
    detail: "No check-in yet",
    countdown: "Offline",
    version: "unknown",
    agentVersion: "unknown",
    updateStatus: "current",
    localUrl: "",
    volumeLevel: 50,
    volumeMuted: false,
    lastSeen: null,
    lastCommandId: 0,
    lastAckCommandId: 0,
    pendingCommand: "none",
    pendingCommandLabel: "None",
    commandQueue: [],
    log: [],
  };
}

function normalizePodId(id: string) {
  const value = String(id || "pod-unknown").trim();
  const numeric = value.match(/^(?:pod-)?0*(\d+)$/i);

  if (numeric) {
    return `pod-${Number(numeric[1])}`;
  }

  return value || "pod-unknown";
}

function defaultState(): PortalState {
  return {
    pods: {},
    update: {
      desiredVersion: "7.1.0",
      downloadUrl: "",
      notes: "Racewerx volume-capable pod bridge.",
    },
  };
}

function hasRedisEnv() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisCommand<T>(command: unknown[]): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis command failed: ${response.status}`);
  }

  const data = (await response.json()) as { result: T | null };
  return data.result;
}

async function readLocalState() {
  try {
    const state = JSON.parse(await readFile(LOCAL_STATE_FILE, "utf8")) as PortalState;
    globalThis.racewerxPodState = state;
    return state;
  } catch {
    const state = globalThis.racewerxPodState || defaultState();
    globalThis.racewerxPodState = state;
    return state;
  }
}

async function writeLocalState(state: PortalState) {
  globalThis.racewerxPodState = state;

  try {
    await mkdir(path.dirname(LOCAL_STATE_FILE), { recursive: true });
    await writeFile(LOCAL_STATE_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch {
    // Serverless filesystems are not durable. Use Redis for production state.
  }
}

async function getPortalState() {
  let state: PortalState;

  if (hasRedisEnv()) {
    const raw = await redisCommand<string>(["GET", STORAGE_KEY]);
    state = raw ? JSON.parse(raw) as PortalState : defaultState();
  } else {
    state = await readLocalState();
  }

  if (canonicalizePortalState(state)) {
    await savePortalState(state);
  }

  return state;
}

async function savePortalState(state: PortalState) {
  if (hasRedisEnv()) {
    await redisCommand(["SET", STORAGE_KEY, JSON.stringify(state)]);
    return;
  }

  await writeLocalState(state);
}

function commandLabel(command: Exclude<RemoteCommand, "none">, volume?: VolumeCommand) {
  if (command === "volume") {
    const levelLabel = typeof volume?.level === "number" ? `${volume.level}%` : "";
    const muteLabel = volume?.muted ? "muted" : volume?.muted === false ? "unmuted" : "";
    return ["volume", levelLabel, muteLabel].filter(Boolean).join(" ");
  }

  return command === "unblocked" ? "standby" : command;
}

function getCommandQueue(pod: RemotePod) {
  return (pod.commandQueue || []).filter((item) => item.id > pod.lastAckCommandId);
}

function lastSeenTime(pod: RemotePod) {
  return pod.lastSeen ? new Date(pod.lastSeen).getTime() || 0 : 0;
}

function mergeCommandQueues(
  first: RemotePod,
  second: RemotePod,
  lastAckCommandId: number
) {
  const byId = new Map<number, QueuedCommand>();

  [...getCommandQueue(first), ...getCommandQueue(second)]
    .filter((item) => item.id > lastAckCommandId)
    .sort((a, b) => a.id - b.id)
    .forEach((item) => byId.set(item.id, item));

  return [...byId.values()].sort((a, b) => a.id - b.id);
}

function mergePodRecords(current: RemotePod, next: RemotePod, id: string) {
  const currentTime = lastSeenTime(current);
  const nextTime = lastSeenTime(next);
  const primary = nextTime >= currentTime ? next : current;
  const secondary = primary === next ? current : next;
  const lastAckCommandId = Math.max(
    current.lastAckCommandId || 0,
    next.lastAckCommandId || 0
  );
  const commandQueue = mergeCommandQueues(secondary, primary, lastAckCommandId);
  const lastCommandId = Math.max(
    current.lastCommandId || 0,
    next.lastCommandId || 0,
    commandQueue.at(-1)?.id || 0
  );

  return withPendingFromQueue(
    {
      ...secondary,
      ...primary,
      id,
      lastAckCommandId,
      lastCommandId,
    },
    commandQueue
  );
}

function canonicalizePortalState(state: PortalState) {
  let changed = false;
  const pods: Record<string, RemotePod> = {};

  Object.entries(state.pods || {}).forEach(([key, pod]) => {
    const id = normalizePodId(pod.id || key);
    const normalizedPod = pod.id === id ? pod : { ...pod, id };

    if (key !== id || pod.id !== id) {
      changed = true;
    }

    if (pods[id]) {
      pods[id] = mergePodRecords(pods[id], normalizedPod, id);
      changed = true;
      return;
    }

    pods[id] = normalizedPod;
  });

  state.pods = pods;
  return changed;
}

function withPendingFromQueue(pod: RemotePod, queue: QueuedCommand[]): RemotePod {
  const nextCommand = queue[0];

  return {
    ...pod,
    pendingCommand: nextCommand?.command || "none",
    pendingCommandLabel: nextCommand?.label || "None",
    commandQueue: queue,
  };
}

function nextCommandIdFor(pod: RemotePod, queue: QueuedCommand[]) {
  const lastQueuedId = queue.at(-1)?.id || 0;
  return Math.max(pod.lastCommandId || 0, pod.lastAckCommandId || 0, lastQueuedId) + 1;
}

function normalizeVolume(volume: VolumeCommand) {
  const normalized: VolumeCommand = {};

  if (typeof volume.level === "number" && Number.isFinite(volume.level)) {
    normalized.level = Math.max(0, Math.min(100, Math.round(volume.level)));
  }

  if (typeof volume.muted === "boolean") {
    normalized.muted = volume.muted;
  }

  if (normalized.level === undefined && normalized.muted === undefined) {
    throw new Error("Volume command requires level or muted");
  }

  return normalized;
}

export function verifyAgentSecret(request: Request) {
  const suppliedSecret = request.headers.get("x-agent-key") || "";
  const allowedSecrets = [process.env.AGENT_SECRET, "pod-agent-secret-001"].filter(Boolean) as string[];

  return allowedSecrets.some((secret) => secret === suppliedSecret);
}

export async function listPods() {
  const state = await getPortalState();
  const cutoff = Date.now() - OFFLINE_GRACE_MS;

  return Object.values(state.pods)
    .filter((pod) => pod.lastSeen)
    .map((pod) => {
      const lastSeenAt = new Date(pod.lastSeen as string).getTime();
      if (lastSeenAt < cutoff) {
        return { ...pod, state: "OFFLINE" as const, detail: "Agent not seen recently", countdown: "Offline" };
      }
      return pod;
    })
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export async function queuePodCommand(podId: string, command: Exclude<RemoteCommand, "none" | "volume">) {
  const state = await getPortalState();
  const id = normalizePodId(podId);
  const pod = state.pods[id] || defaultPod(id);
  const queue = getCommandQueue(pod);
  const nextCommandId = nextCommandIdFor(pod, queue);
  const queuedCommand: QueuedCommand = {
    id: nextCommandId,
    command,
    label: commandLabel(command),
    createdAt: nowIso(),
  };

  state.pods[id] = withPendingFromQueue({ ...pod, id, lastCommandId: nextCommandId }, [...queue, queuedCommand]);
  await savePortalState(state);
  return state.pods[id];
}

export async function queuePodVolume(podId: string, volume: VolumeCommand) {
  const normalizedVolume = normalizeVolume(volume);
  const state = await getPortalState();
  const id = normalizePodId(podId);
  const pod = state.pods[id] || defaultPod(id);

  const queue = getCommandQueue(pod);
  const nextCommandId = nextCommandIdFor(pod, queue);
  const queuedCommand: QueuedCommand = {
    id: nextCommandId,
    command: "volume",
    label: commandLabel("volume", normalizedVolume),
    volume: normalizedVolume,
    createdAt: nowIso(),
  };

  state.pods[id] = withPendingFromQueue(
    {
      ...pod,
      id,
      lastCommandId: nextCommandId,
      volumeLevel: normalizedVolume.level ?? pod.volumeLevel,
      volumeMuted: normalizedVolume.muted ?? pod.volumeMuted,
    },
    [...queue, queuedCommand]
  );

  await savePortalState(state);
  return state.pods[id];
}

export async function handleAgentPoll(body: AgentPollBody) {
  const state = await getPortalState();
  const podId = normalizePodId(body.podId || "pod-unknown");
  const existing = state.pods[podId] || defaultPod(podId);
  const suppliedLog = Array.isArray(body.log) ? body.log.slice(-80) : existing.log;

  let lastAckCommandId = existing.lastAckCommandId;
  let commandQueue = getCommandQueue(existing);
  const suppliedAckCommandId = Number(body.ackCommandId || 0);

  if (suppliedAckCommandId > lastAckCommandId) {
    lastAckCommandId = suppliedAckCommandId;
  }

  commandQueue = commandQueue.filter((item) => item.id > lastAckCommandId);

  const updated = withPendingFromQueue(
    {
      ...existing,
      name: body.podName || existing.name,
      state: body.state || existing.state,
      detail: body.detail || existing.detail,
      countdown: body.countdown || existing.countdown,
      version: body.version || existing.version,
      agentVersion: body.agentVersion || existing.agentVersion,
      updateStatus: body.updateStatus || existing.updateStatus,
      localUrl: body.localUrl || existing.localUrl,
      volumeLevel: body.volumeLevel ?? existing.volumeLevel,
      volumeMuted: body.volumeMuted ?? existing.volumeMuted,
      lastSeen: nowIso(),
      lastAckCommandId,
      log: suppliedLog,
    },
    commandQueue
  );

  state.pods[podId] = updated;
  await savePortalState(state);

  const nextCommand = updated.commandQueue[0];

  return {
    ok: true,
    serverTime: nowIso(),
    commandId: nextCommand ? nextCommand.id : 0,
    command: nextCommand ? nextCommand.command : "none",
    volume: nextCommand?.volume,
    update: state.update,
  };
}
