"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AID_CYCLE_LABEL,
  AID_OPTS,
  AidKey,
  Aids,
  COMBO_AIDS,
  COMBO_RACES,
  CONFIG,
  genPerf,
  ModalName,
  Perf,
  Pod,
  PodStatus,
  POD_SEED,
  PackageKey,
  PrintOpts,
  PrintOptKey,
  RaceKey,
  ScreenName,
  Tele,
  ViewMode,
} from "@/lib/data";
import { sendSimLockCommand } from "@/lib/simLockClient";

// ---------------------------------------------------------------------------
// State shape — one object, mirroring the prototype's component state.
// ---------------------------------------------------------------------------
export interface DashboardState {
  screen: ScreenName;
  modal: ModalName;
  pkg: PackageKey | null;
  race: RaceKey | null;
  sel: number[];
  toast: string | null;
  clock: string;
  lobbyStep: number;
  joined: number;
  lobbyReady: boolean;
  aids: Aids;
  expandPod: number | null;
  tele: Tele | null;
  resetting: boolean;
  statGroup: "online" | "inrace" | "ready" | "locked" | null;
  detailPod: number | null;
  perf: Perf | null;
  view: ViewMode;
  rulesOpen: boolean;
  selRaces: RaceKey[];
  buildSel: number[];
  presel: number[];
  printOpen: boolean;
  printOpts: PrintOpts;
  pods: Pod[];
}

function makePods(n: number): Pod[] {
  const count = Math.max(2, Math.min(16, n || 8));
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: POD_SEED[i % POD_SEED.length],
  }));
}

function initialState(): DashboardState {
  return {
    screen: "home",
    modal: null,
    pkg: null,
    race: null,
    sel: [],
    toast: null,
    clock: "--:--:--",
    lobbyStep: 0,
    joined: 0,
    lobbyReady: false,
    aids: { drive: "NORMAL", gear: "AUTOMATIC", brake: "OFF", steer: "OFF" },
    expandPod: null,
    tele: null,
    resetting: false,
    statGroup: null,
    detailPod: null,
    perf: null,
    view: "list",
    rulesOpen: false,
    selRaces: [],
    buildSel: [],
    presel: [],
    printOpen: false,
    printOpts: {
      receipt: true,
      session: false,
      podStatus: false,
      takings: false,
    },
    pods: makePods(CONFIG.podCount),
  };
}

export interface DashboardActions {
  go: (screen: ScreenName) => void;
  toggleBuild: (id: number) => void;
  startBuildRace: (auto: boolean) => void;
  clearBuild: () => void;
  lockPod: (id: number) => void;
  unlockPod: (id: number) => void;
  standbyPod: (id: number) => void;
  lockAll: () => void;
  standbyAll: () => void;
  openUnlock: () => void;
  confirmUnlock: () => void;
  confirmPayment: () => void;
  closeModal: () => void;
  selectPackage: (key: PackageKey) => void;
  selectRace: (key: RaceKey) => void;
  toggleRace: (key: RaceKey) => void;
  racesContinue: () => void;
  printReceipt: () => void;
  closePrint: () => void;
  togglePrintOpt: (key: PrintOptKey) => void;
  confirmPrint: () => void;
  jumpToPods: () => void;
  comboSelect: (idx: number) => void;
  setView: (v: ViewMode) => void;
  openRules: () => void;
  closeRules: () => void;
  setAid: (key: AidKey, val: string) => void;
  toggleSel: (id: number) => void;
  submitRace: () => void;
  proceedGrid: () => void;
  startRace: () => void;
  editPods: () => void;
  cancelSetup: () => void;
  cycleAid: (key: AidKey) => void;
  openStat: (group: DashboardState["statGroup"]) => void;
  closeStat: () => void;
  openExpand: (id: number) => void;
  closeExpand: () => void;
  openDetail: (id: number) => void;
  closeDetail: () => void;
  resetCar: (id: number) => void;
  toast: (msg: string) => void;
}

interface StoreValue {
  state: DashboardState;
  actions: DashboardActions;
}

const StoreContext = createContext<StoreValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState);

  // Always-fresh snapshot for actions that read-then-write (timers etc.).
  const ref = useRef(state);
  ref.current = state;

  // Timer handles, mirroring the prototype's instance fields.
  const toastT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const teleT = useRef<ReturnType<typeof setInterval> | null>(null);
  const perfT = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lobT = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const patch = useCallback((p: Partial<DashboardState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const toast = useCallback((msg: string) => {
    if (toastT.current) clearTimeout(toastT.current);
    setState((s) => ({ ...s, toast: msg }));
    toastT.current = setTimeout(
      () => setState((s) => ({ ...s, toast: null })),
      2600
    );
  }, []);

  const clearLobby = useCallback(() => {
    lobT.current.forEach((t) => {
      clearTimeout(t);
      clearInterval(t as unknown as ReturnType<typeof setInterval>);
    });
    lobT.current = [];
  }, []);

  // ---- clock ----
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (x: number) => String(x).padStart(2, "0");
      setState((s) => ({
        ...s,
        clock: p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()),
      }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => {
      clearInterval(t);
      if (toastT.current) clearTimeout(toastT.current);
      if (teleT.current) clearInterval(teleT.current);
      if (perfT.current) clearInterval(perfT.current);
      if (resetT.current) clearTimeout(resetT.current);
      lobT.current.forEach((x) => {
        clearTimeout(x);
        clearInterval(x as unknown as ReturnType<typeof setInterval>);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = useCallback((id: number, status: PodStatus) => {
    setState((s) => ({
      ...s,
      pods: s.pods.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  }, []);

  const lockPod = useCallback(
    async (id: number) => {
      const previous = ref.current.pods.find((p) => p.id === id)?.status;
      setStatus(id, "locked");

      try {
        const result = await sendSimLockCommand("lock", id);
        toast(
          "Pod " +
            String(id).padStart(2, "0") +
            " locked" +
            (result.simulated ? " (demo)" : "")
        );
      } catch (error) {
        if (previous) setStatus(id, previous);
        toast(
          "Pod " +
            String(id).padStart(2, "0") +
            " lock failed – " +
            (error instanceof Error ? error.message : "Sim Lock unavailable")
        );
      }
    },
    [setStatus, toast]
  );
  const unlockPod = useCallback(
    async (id: number) => {
      const previous = ref.current.pods.find((p) => p.id === id)?.status;
      setStatus(id, "unlocked");

      try {
        const result = await sendSimLockCommand("unlock", id);
        toast(
          "Pod " +
            String(id).padStart(2, "0") +
            " unlocked" +
            (result.simulated ? " (demo)" : "")
        );
      } catch (error) {
        if (previous) setStatus(id, previous);
        toast(
          "Pod " +
            String(id).padStart(2, "0") +
            " unlock failed – " +
            (error instanceof Error ? error.message : "Sim Lock unavailable")
        );
      }
    },
    [setStatus, toast]
  );

  const standbyPod = useCallback(
    async (id: number) => {
      const previous = ref.current.pods.find((p) => p.id === id)?.status;
      setStatus(id, "standby");

      try {
        const result = await sendSimLockCommand("standby", id);
        toast(
          "Pod " +
            String(id).padStart(2, "0") +
            " standby" +
            (result.simulated ? " (demo)" : "")
        );
      } catch (error) {
        if (previous) setStatus(id, previous);
        toast(
          "Pod " +
            String(id).padStart(2, "0") +
            " standby failed – " +
            (error instanceof Error ? error.message : "Sim Lock unavailable")
        );
      }
    },
    [setStatus, toast]
  );

  const doUnlockAll = useCallback(async () => {
    const previous = ref.current.pods;
    setState((s) => ({
      ...s,
      pods: s.pods.map((p) =>
        p.status === "offline" ? p : { ...p, status: "unlocked" }
      ),
    }));

    try {
      const result = await sendSimLockCommand("unlock-all");
      toast("All available pods unlocked" + (result.simulated ? " (demo)" : ""));
      return true;
    } catch (error) {
      setState((s) => ({ ...s, pods: previous }));
      toast(
        "Unlock all failed – " +
          (error instanceof Error ? error.message : "Sim Lock unavailable")
      );
      return false;
    }
  }, [toast]);

  const actions = useMemo<DashboardActions>(() => {
    const go = (screen: ScreenName) => {
      if (ref.current.screen === "lobby") clearLobby();
      const extra: Partial<DashboardState> =
        screen === "home" ? { presel: [], buildSel: [] } : {};
      setState((s) => ({ ...s, screen, ...extra }));
    };

    const toggleBuild = (id: number) => {
      setState((s) => {
        const inB = s.buildSel.includes(id);
        return {
          ...s,
          buildSel: inB
            ? s.buildSel.filter((x) => x !== id)
            : s.buildSel.concat(id).sort((a, b) => a - b),
        };
      });
    };

    const startBuildRace = (auto: boolean) => {
      const sel = ref.current.buildSel.slice();
      if (!sel.length) return;
      patch({ sel, presel: sel, buildSel: [], screen: "raceSetup" });
      toast(
        (auto ? "All unlocked pods added – " : "") +
          sel.length +
          " pod" +
          (sel.length > 1 ? "s" : "") +
          " ready – choose a package"
      );
    };

    const clearBuild = () => {
      patch({ buildSel: [] });
      toast("Race build cleared");
    };

    const lockAll = async () => {
      const previous = ref.current.pods;
      setState((s) => ({
        ...s,
        pods: s.pods.map((p) =>
          p.status === "offline" || p.status === "inrace"
            ? p
            : { ...p, status: "locked" }
        ),
      }));

      try {
        const result = await sendSimLockCommand("lock-all");
        toast("All available pods locked" + (result.simulated ? " (demo)" : ""));
      } catch (error) {
        setState((s) => ({ ...s, pods: previous }));
        toast(
          "Lock all failed – " +
            (error instanceof Error ? error.message : "Sim Lock unavailable")
        );
      }
    };

    const standbyAll = async () => {
      const previous = ref.current.pods;
      setState((s) => ({
        ...s,
        pods: s.pods.map((p) =>
          p.status === "offline" || p.status === "inrace"
            ? p
            : { ...p, status: "standby" }
        ),
      }));

      try {
        const result = await sendSimLockCommand("standby-all");
        toast(
          "All available pods set to standby" +
            (result.simulated ? " (demo)" : "")
        );
      } catch (error) {
        setState((s) => ({ ...s, pods: previous }));
        toast(
          "Standby all failed – " +
            (error instanceof Error ? error.message : "Sim Lock unavailable")
        );
      }
    };

    const openUnlock = () => patch({ modal: "unlockConfirm" });

    const confirmUnlock = async () => {
      if (CONFIG.tillRequired === false) {
        if (await doUnlockAll()) patch({ modal: "unlockSuccess" });
      } else {
        patch({ modal: "till" });
      }
    };

    const confirmPayment = async () => {
      if (await doUnlockAll()) patch({ modal: "unlockSuccess" });
    };

    const closeModal = () => patch({ modal: null });

    const selectPackage = (key: PackageKey) => {
      setState((s) => ({
        ...s,
        pkg: key,
        race: null,
        sel: s.presel && s.presel.length ? s.presel.slice() : [],
        selRaces: [],
        screen: "raceSelect",
      }));
    };

    const selectRace = (key: RaceKey) => {
      setState((s) => ({
        ...s,
        race: key,
        sel: s.presel && s.presel.length ? s.presel.slice() : [],
        screen: "pods",
      }));
    };

    const toggleRace = (key: RaceKey) => {
      setState((s) => ({
        ...s,
        selRaces: s.selRaces.includes(key)
          ? s.selRaces.filter((x) => x !== key)
          : s.selRaces.concat(key),
      }));
    };

    const racesContinue = () => {
      if (!ref.current.selRaces.length) return;
      setState((s) => ({
        ...s,
        race: s.selRaces[0],
        sel: s.presel && s.presel.length ? s.presel.slice() : [],
        screen: "pods",
      }));
    };

    const printReceipt = () => patch({ printOpen: true });
    const closePrint = () => patch({ printOpen: false });
    const togglePrintOpt = (key: PrintOptKey) => {
      setState((s) => ({
        ...s,
        printOpts: { ...s.printOpts, [key]: !s.printOpts[key] },
      }));
    };
    const confirmPrint = () => {
      const o = ref.current.printOpts;
      const n = (Object.keys(o) as PrintOptKey[]).filter((k) => o[k]).length;
      if (!n) {
        toast("Select at least one document to print");
        return;
      }
      patch({ printOpen: false });
      toast(n + " document" + (n > 1 ? "s" : "") + " sent to the printer");
    };

    const jumpToPods = () => {
      patch({ view: "map", statGroup: null });
      setTimeout(() => {
        try {
          const el = document.querySelector("[data-pod-section]");
          if (el) {
            const y =
              el.getBoundingClientRect().top + window.pageYOffset - 16;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        } catch {
          /* noop */
        }
      }, 70);
    };

    const comboSelect = (idx: number) => {
      patch({ selRaces: COMBO_RACES[idx].slice(), aids: COMBO_AIDS[idx] });
      toast("Combo " + (idx + 1) + " loaded – " + COMBO_RACES[idx].length + " races");
    };

    const setView = (v: ViewMode) => patch({ view: v });
    const openRules = () => patch({ rulesOpen: true });
    const closeRules = () => patch({ rulesOpen: false });

    const setAid = (key: AidKey, val: string) => {
      setState((s) => ({ ...s, aids: { ...s.aids, [key]: val } }));
      toast(AID_CYCLE_LABEL[key] + " → " + val);
    };

    const toggleSel = (id: number) => {
      setState((s) => ({
        ...s,
        sel: s.sel.includes(id)
          ? s.sel.filter((x) => x !== id)
          : s.sel.concat(id).sort((a, b) => a - b),
      }));
    };

    const enterLobby = () => {
      clearLobby();
      const total = ref.current.sel.length;
      patch({ screen: "lobby", lobbyStep: 0, joined: 0, lobbyReady: false });
      lobT.current.push(
        setTimeout(() => {
          patch({ lobbyStep: 1 });
          let i = 0;
          const iv = setInterval(() => {
            i++;
            patch({ joined: i });
            if (i >= total) {
              clearInterval(iv);
              lobT.current.push(
                setTimeout(() => {
                  patch({ lobbyStep: 2 });
                  lobT.current.push(
                    setTimeout(
                      () => patch({ lobbyStep: 3, lobbyReady: true }),
                      1100
                    )
                  );
                }, 520)
              );
            }
          }, 460);
          lobT.current.push(iv as unknown as ReturnType<typeof setTimeout>);
        }, 1200)
      );
    };

    const submitRace = () => {
      if (!ref.current.sel.length) return;
      setState((s) => ({
        ...s,
        pods: s.pods.map((p) =>
          s.sel.includes(p.id) ? { ...p, status: "ready" } : p
        ),
      }));
      enterLobby();
    };

    const proceedGrid = () => {
      clearLobby();
      patch({ screen: "raceReady" });
    };

    const startRace = () => {
      setState((s) => ({
        ...s,
        pods: s.pods.map((p) =>
          s.sel.includes(p.id) ? { ...p, status: "inrace" } : p
        ),
        screen: "home",
        pkg: null,
        sel: [],
        presel: [],
        buildSel: [],
      }));
      toast("Race started – good luck out there");
    };

    const editPods = () => patch({ screen: "pods" });

    const cancelSetup = () => {
      clearLobby();
      setState((s) => ({
        ...s,
        pkg: null,
        race: null,
        sel: [],
        selRaces: [],
        pods: s.pods.map((p) =>
          s.sel.includes(p.id) && p.status === "ready"
            ? { ...p, status: "unlocked" }
            : p
        ),
        screen: "home",
        presel: [],
        buildSel: [],
      }));
      toast("Race setup cancelled");
    };

    const cycleAid = (key: AidKey) => {
      const o = AID_OPTS[key];
      const nv = o[(o.indexOf(ref.current.aids[key]) + 1) % o.length];
      setState((s) => ({ ...s, aids: { ...s.aids, [key]: nv } }));
      toast(AID_CYCLE_LABEL[key] + " → " + nv);
    };

    const openStat = (group: DashboardState["statGroup"]) =>
      patch({ statGroup: group });
    const closeStat = () => patch({ statGroup: null });

    const openExpand = (id: number) => {
      const pod = ref.current.pods.find((p) => p.id === id);
      if (!pod) return;
      if (teleT.current) clearInterval(teleT.current);
      if (pod.status === "inrace") {
        const grid =
          ref.current.pods.filter((p) => p.status === "inrace").length || 6;
        patch({
          expandPod: id,
          statGroup: null,
          resetting: false,
          tele: {
            speed: 208,
            gear: 5,
            rpm: 0.72,
            lap: 2,
            laps: 3,
            pos: (id % grid) + 1,
            grid,
            lapTime: "01:24.6",
            lastLap: "01:26.1",
          },
        });
        teleT.current = setInterval(() => {
          setState((s) => {
            if (!s.tele) return s;
            const sp = Math.max(72, Math.round(150 + Math.random() * 98));
            const g = Math.max(2, Math.min(6, Math.round(sp / 40)));
            return {
              ...s,
              tele: { ...s.tele, speed: sp, gear: g, rpm: 0.42 + Math.random() * 0.52 },
            };
          });
        }, 650);
      } else {
        patch({ expandPod: id, statGroup: null, resetting: false, tele: null });
      }
    };

    const closeExpand = () => {
      if (teleT.current) clearInterval(teleT.current);
      patch({ expandPod: null, resetting: false, tele: null });
    };

    const openDetail = (id: number) => {
      const pod = ref.current.pods.find((p) => p.id === id);
      if (!pod) return;
      const racing = pod.status === "inrace";
      if (perfT.current) clearInterval(perfT.current);
      patch({ detailPod: id, perf: genPerf(racing) });
      perfT.current = setInterval(() => {
        setState((s) => {
          if (s.detailPod == null) return s;
          const p = s.pods.find((x) => x.id === s.detailPod);
          return { ...s, perf: genPerf(!!(p && p.status === "inrace")) };
        });
      }, 1200);
    };

    const closeDetail = () => {
      if (perfT.current) clearInterval(perfT.current);
      patch({ detailPod: null });
    };

    const resetCar = (id: number) => {
      if (ref.current.resetting) return;
      if (resetT.current) clearTimeout(resetT.current);
      patch({ resetting: true });
      resetT.current = setTimeout(() => {
        patch({ resetting: false });
        toast("Pod " + String(id).padStart(2, "0") + " – car reset to track");
      }, 1500);
    };

    return {
      go,
      toggleBuild,
      startBuildRace,
      clearBuild,
      lockPod,
      unlockPod,
      standbyPod,
      lockAll,
      standbyAll,
      openUnlock,
      confirmUnlock,
      confirmPayment,
      closeModal,
      selectPackage,
      selectRace,
      toggleRace,
      racesContinue,
      printReceipt,
      closePrint,
      togglePrintOpt,
      confirmPrint,
      jumpToPods,
      comboSelect,
      setView,
      openRules,
      closeRules,
      setAid,
      toggleSel,
      submitRace,
      proceedGrid,
      startRace,
      editPods,
      cancelSetup,
      cycleAid,
      openStat,
      closeStat,
      openExpand,
      closeExpand,
      openDetail,
      closeDetail,
      resetCar,
      toast,
    };
  }, [patch, toast, clearLobby, doUnlockAll, lockPod, standbyPod, unlockPod]);

  const value = useMemo<StoreValue>(() => ({ state, actions }), [state, actions]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within DashboardProvider");
  return ctx;
}
