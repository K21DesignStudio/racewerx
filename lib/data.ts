// ============================================================================
// Racewerx — shared types, constants and pure data helpers.
// Ported verbatim (values & logic) from the Claude Design prototype so the
// behaviour stays identical; only the structure is adapted to TypeScript.
// ============================================================================

export type PodStatus = "locked" | "unlocked" | "inrace" | "ready" | "offline";

export interface Pod {
  id: number;
  status: PodStatus;
  volumeLevel?: number;
  volumeMuted?: boolean;
  bridgeReady?: boolean;
  pendingCommandLabel?: string;
  lastSeen?: string | null;
}

export interface Aids {
  drive: string;
  gear: string;
  brake: string;
  steer: string;
}

export type AidKey = keyof Aids;

export interface Tele {
  speed: number;
  gear: number;
  rpm: number;
  lap: number;
  laps: number;
  pos: number;
  grid: number;
  lapTime: string;
  lastLap: string;
}

export interface Perf {
  fps: number;
  cpuTemp: number;
  gpuTemp: number;
  cpu: number;
  gpu: number;
  ram: number;
  vram: number;
  frame: string;
  ping: number;
  net: string;
}

export interface PrintOpts {
  receipt: boolean;
  session: boolean;
  podStatus: boolean;
  takings: boolean;
}

export type PrintOptKey = keyof PrintOpts;

export type ScreenName =
  | "home"
  | "simlock"
  | "raceSetup"
  | "raceSelect"
  | "pods"
  | "lobby"
  | "raceReady";

export type ModalName = "unlockConfirm" | "till" | "unlockSuccess" | null;

export type ViewMode = "list" | "map";

export type PackageKey =
  | "x3"
  | "x5"
  | "gold"
  | "plat"
  | "silver"
  | "bronze"
  | "voucher"
  | "min30"
  | "min60"
  | "custom";

export type RaceKey = "r1" | "r2" | "r3";

export interface RaceDef {
  key: RaceKey;
  n: string;
  car: string;
  cls: string;
  track: string;
  loc: string;
  len: string;
  turns: string;
  color: string;
  map: string;
}

export interface StatusMeta {
  label: string;
  color: string;
  soft: string;
  desc: string;
  live?: boolean;
}

// ---------------------------------------------------------------------------
// Configuration — these were editable props on the prototype. Defaults match
// the prototype's `data-props` exactly. tillRequired:false means "Unlock All"
// skips the till step and unlocks immediately; set it true to require the
// till transaction before pods go live.
// ---------------------------------------------------------------------------
export const CONFIG = {
  centreName: "RACEWERX",
  podCount: 8,
  tillRequired: false,
  unlockPrice: 15,
};

// Seed used to lay out the initial pod grid (cycled across podCount).
export const POD_SEED: PodStatus[] = [
  "unlocked",
  "unlocked",
  "inrace",
  "inrace",
  "locked",
  "locked",
  "ready",
  "offline",
];

export function meta(status: PodStatus): StatusMeta {
  const M: Record<PodStatus, StatusMeta> = {
    locked: {
      label: "LOCKED",
      color: "#FF3B5C",
      soft: "rgba(255,59,92,.13)",
      desc: "Pod secured",
    },
    unlocked: {
      label: "UNLOCKED",
      color: "#2BA6FF",
      soft: "rgba(43,166,255,.14)",
      desc: "Open for customer use",
    },
    inrace: {
      label: "IN RACE",
      color: "#2FD27A",
      soft: "rgba(47,210,122,.14)",
      desc: "Session live now",
      live: true,
    },
    ready: {
      label: "READY",
      color: "#FFB020",
      soft: "rgba(255,176,32,.14)",
      desc: "Entered – ready to start",
    },
    offline: {
      label: "OFFLINE",
      color: "#6B7689",
      soft: "rgba(107,118,137,.12)",
      desc: "Not connected",
    },
  };
  return M[status] || M.offline;
}

// Package display names.
export const PK: Record<PackageKey, string> = {
  x3: "x3 Race Session",
  x5: "x4 Race Session",
  gold: "Open Gold Package",
  plat: "Open Platinum Package",
  silver: "Open Silver Package",
  bronze: "Open Bronze Package",
  voucher: "Voucher Booking",
  min30: "30 Minute Package",
  min60: "60 Minute Package",
  custom: "Custom Combo",
};

export const TRK = ["Silverstone Classic", "Monza Classic", "Nürburgring"];

export const RACES: Record<RaceKey, RaceDef> = {
  r1: {
    key: "r1",
    n: "01",
    car: "McLaren 650S GT3",
    cls: "GT3",
    track: "Silverstone Classic",
    loc: "England",
    len: "5.90 km",
    turns: "18 turns",
    color: "#FF8A3D",
    map: "M14,44 L22,28 L36,24 L43,33 L60,28 L66,17 L88,16 L106,27 L99,41 L82,45 L74,57 L50,59 L33,55 L19,52 Z",
  },
  r2: {
    key: "r2",
    n: "02",
    car: "Formula X",
    cls: "OPEN WHEEL",
    track: "Monza Classic",
    loc: "Italy",
    len: "5.79 km",
    turns: "11 turns",
    color: "#2BA6FF",
    map: "M16,21 L98,15 L110,28 L101,41 L60,43 L67,56 L40,58 L22,51 L31,38 L18,33 Z",
  },
  r3: {
    key: "r3",
    n: "03",
    car: "Formula X",
    cls: "OPEN WHEEL",
    track: "Nürburgring",
    loc: "Germany",
    len: "5.15 km",
    turns: "15 turns",
    color: "#2FD27A",
    map: "M14,40 C14,23 31,17 45,24 C57,30 52,43 67,45 C84,47 85,25 99,23 C114,21 111,47 92,53 C71,59 49,55 33,55 C19,55 14,50 14,40 Z",
  },
};

export const RACE_ORDER: RaceKey[] = ["r1", "r2", "r3"];

export function aidColor(v: string): string {
  const M: Record<string, string> = {
    OFF: "#FF6B82",
    ON: "#2FD27A",
    FULL: "#2FD27A",
    HIGH: "#2FD27A",
    NORMAL: "#FFB020",
    LOW: "#FFB020",
    AUTOMATIC: "#5BC0FF",
    MANUAL: "#FFB020",
    SEQUENTIAL: "#2FD27A",
  };
  return M[v] || "#9FB0C4";
}

export const AIDLBL: Record<AidKey, string> = {
  drive: "DRIVING AIDS",
  gear: "GEARBOX",
  brake: "BRAKING ASSIST",
  steer: "STEERING ASSIST",
};

export const AID_OPTS: Record<AidKey, string[]> = {
  drive: ["OFF", "NORMAL", "FULL"],
  gear: ["AUTOMATIC", "MANUAL", "SEQUENTIAL"],
  brake: ["OFF", "LOW", "HIGH"],
  steer: ["OFF", "ON"],
};

export const AID_CYCLE_LABEL: Record<AidKey, string> = {
  drive: "Driving aids",
  gear: "Gearbox",
  brake: "Braking assist",
  steer: "Steering assist",
};

// Quick-combo presets (race line-ups + locked-in aids), from the prototype.
export const COMBO_RACES: RaceKey[][] = [
  ["r1", "r2"],
  ["r2", "r3"],
  ["r1", "r2", "r3"],
];

export const COMBO_AIDS: Aids[] = [
  { drive: "NORMAL", gear: "AUTOMATIC", brake: "LOW", steer: "ON" },
  { drive: "NORMAL", gear: "MANUAL", brake: "OFF", steer: "OFF" },
  { drive: "OFF", gear: "SEQUENTIAL", brake: "OFF", steer: "OFF" },
];

// Remote-action icon paths used in the PC detail view.
export const FNICON: Record<string, string> = {
  play: "M8 5v14l11-7z",
  screen: "M3 4h18v12H3zM8 20h8M12 16v4",
  msg: "M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z",
  power: "M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  off: "M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0",
};

// Deterministic per-pod PC spec (mirrors prototype's podSpec).
export function podSpec(id: number) {
  const pick = <T,>(arr: T[]): T => arr[(id - 1) % arr.length];
  return {
    host: "RW-SIM-" + String(id).padStart(2, "0"),
    cpu: pick([
      "Intel Core i7-13700K",
      "Intel Core i9-13900K",
      "AMD Ryzen 7 7800X3D",
    ]),
    gpu: pick([
      "NVIDIA RTX 4070 Ti",
      "NVIDIA RTX 4080 SUPER",
      "NVIDIA RTX 4090",
    ]),
    ram: "32 GB DDR5-6000",
    storage: "2 TB NVMe Gen4 SSD",
    mobo: pick(["ASUS ROG STRIX Z790", "MSI MAG B650", "Gigabyte AORUS Z790"]),
    os: "Windows 11 Pro 23H2",
    wheel: pick([
      "Fanatec CSL DD 8Nm",
      "Fanatec ClubSport DD+",
      "Logitech G PRO",
      "Thrustmaster T818",
    ]),
    pedals: pick(["Fanatec CSL LC", "Heusinkveld Sprint", "Logitech G PRO"]),
    rig: pick(["Next Level GTtrack", "Sim-Lab GT1 PRO", "Playseat Trophy"]),
    disp: pick([
      '49″ Samsung G9 240Hz',
      'Triple 27″ 165Hz',
      '42″ LG OLED 120Hz',
    ]),
    res: pick(["5120 × 1440", "3840 × 2160", "2560 × 1440 ×3"]),
    ip: "10.0.1." + (20 + id),
    build: "PCARS2 v7.3.0",
    uptimeH: 2 + ((id * 7) % 9),
    uptimeM: (id * 13) % 60,
  };
}

// Live performance metrics generator (mirrors prototype's genPerf).
export function genPerf(racing: boolean): Perf {
  const r = () => Math.random();
  return {
    fps: racing ? 132 + Math.round(r() * 36) : 60,
    cpuTemp: Math.round((racing ? 61 : 37) + r() * 13),
    gpuTemp: Math.round((racing ? 67 : 42) + r() * 15),
    cpu: Math.round((racing ? 42 : 7) + r() * 24),
    gpu: Math.round((racing ? 70 : 4) + r() * 24),
    ram: Math.round((racing ? 56 : 33) + r() * 11),
    vram: Math.round((racing ? 64 : 28) + r() * 12),
    frame: ((racing ? 6.6 : 16.2) + r() * 2.2).toFixed(1),
    ping: Math.round((racing ? 11 : 8) + r() * 9),
    net: (racing ? 2.4 : 0.3 + r() * 0.5).toFixed(1),
  };
}

export const BACK_MAP: Partial<Record<ScreenName, ScreenName>> = {
  simlock: "home",
  raceSetup: "home",
  raceSelect: "home",
  pods: "raceSelect",
  lobby: "pods",
  raceReady: "pods",
};
