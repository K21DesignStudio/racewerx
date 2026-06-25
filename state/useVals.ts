"use client";

import { useMemo } from "react";
import {
  AIDLBL,
  AID_OPTS,
  AidKey,
  BACK_MAP,
  CONFIG,
  FNICON,
  PK,
  RACES,
  RACE_ORDER,
  TRK,
  aidColor,
  genPerf,
  meta,
  podSpec,
} from "@/lib/data";
import { useStore } from "./store";

// The derived view-model — a direct port of the prototype's renderVals().
export function useVals() {
  const { state: S, actions: A_ } = useStore();

  return useMemo(() => {
    const dec = S.pods.map((p) => {
      const m = meta(p.status);
      const selectable = p.status !== "offline" && p.status !== "inrace";
      const isSel = S.sel.includes(p.id);
      const canBuild = p.status === "unlocked";
      const inBuild = S.buildSel.includes(p.id);
      return {
        id: p.id,
        num: String(p.id).padStart(2, "0"),
        label: m.label,
        color: m.color,
        soft: m.soft,
        desc: m.desc,
        track: TRK[(p.id - 1) % 3],
        live: !!m.live,
        notLive: !m.live,
        actionable:
          p.status === "locked" ||
          p.status === "unlocked" ||
          p.status === "standby" ||
          p.status === "ready",
        inrace: p.status === "inrace",
        offline: p.status === "offline",
        selectable,
        unselectable: !selectable,
        isSelected: isSel,
        notSelected: selectable && !isSel,
        canBuild,
        inBuild,
        notInBuild: canBuild && !inBuild,
        onBuildToggle: () => A_.toggleBuild(p.id),
        onLock: () => A_.lockPod(p.id),
        onUnlock: () => A_.unlockPod(p.id),
        onStandby: () => A_.standbyPod(p.id),
        onSelect: () => A_.toggleSel(p.id),
        onExpand: () => A_.openExpand(p.id),
        onReset: () => A_.resetCar(p.id),
        onDetail: () => A_.openDetail(p.id),
      };
    });

    const c = (st: string) => S.pods.filter((p) => p.status === st).length;
    const counts = {
      total: S.pods.length,
      online: S.pods.filter((p) => p.status !== "offline").length,
      inrace: c("inrace"),
      locked: c("locked"),
      ready: c("ready"),
      unlocked: c("unlocked"),
    };
    const unlockCount = S.pods.filter((p) => p.status !== "offline").length;
    const price = CONFIG.unlockPrice;

    const raceList = RACE_ORDER.map((k) => ({
      ...RACES[k],
      onSelect: () => A_.toggleRace(k),
      isSelected: S.selRaces.includes(k),
      notSelected: !S.selRaces.includes(k),
      order: S.selRaces.indexOf(k) + 1,
    }));
    const race = S.race ? RACES[S.race] : null;

    const Aids = S.aids;
    const aidChips = (["drive", "gear", "brake", "steer"] as AidKey[]).map(
      (k) => ({
        key: k,
        label: AIDLBL[k],
        val: Aids[k],
        color: aidColor(Aids[k]),
        onCycle: () => A_.cycleAid(k),
      })
    );

    const isMap = S.view === "map";
    const leftCount = Math.round((dec.length * 3) / 5);
    const leftPods = dec.slice(0, leftCount);
    const rightPods = dec.slice(leftCount);

    const rulesRows = (["drive", "gear", "brake", "steer"] as AidKey[]).map(
      (k) => ({
        key: k,
        label: AIDLBL[k],
        val: Aids[k],
        color: aidColor(Aids[k]),
        opts: AID_OPTS[k].map((v) => ({
          v,
          active: Aids[k] === v,
          inactive: Aids[k] !== v,
          color: aidColor(v),
          onPick: () => A_.setAid(k, v),
        })),
      })
    );

    const exPod =
      S.expandPod != null ? S.pods.find((p) => p.id === S.expandPod) : null;
    const exMeta = exPod ? meta(exPod.status) : null;
    const exRace = exPod ? RACES[RACE_ORDER[(exPod.id - 1) % 3]] : null;
    const T = S.tele;

    const STATDEF: Record<
      string,
      { title: string; test: (p: { status: string }) => boolean }
    > = {
      online: { title: "PODS ONLINE", test: (p) => p.status !== "offline" },
      inrace: { title: "PODS IN RACE", test: (p) => p.status === "inrace" },
      ready: { title: "PODS READY", test: (p) => p.status === "ready" },
      locked: { title: "PODS LOCKED", test: (p) => p.status === "locked" },
    };
    const statDef = S.statGroup ? STATDEF[S.statGroup] : null;
    const statList = statDef
      ? dec
          .filter((d) => {
            const pod = S.pods.find((p) => p.id === d.id);
            return pod ? statDef.test(pod) : false;
          })
          .map((d) => ({ ...d, onOpen: () => A_.openExpand(d.id) }))
      : [];

    const lobbyTotal = S.sel.length;
    const lobbySteps = [
      {
        title: "Main lobby created",
        sub: "Race settings applied to the host",
        done: S.lobbyStep >= 1,
        active: S.lobbyStep === 0,
      },
      {
        title: "Pods joining session",
        sub: S.joined + " of " + lobbyTotal + " pods connected",
        done: S.lobbyStep >= 2,
        active: S.lobbyStep === 1,
      },
      {
        title: "Session synchronised",
        sub: "All drivers ready on the grid",
        done: S.lobbyStep >= 3,
        active: S.lobbyStep === 2,
      },
    ].map((st, i) => ({
      ...st,
      idx: String(i + 1),
      subTxt: st.sub,
      stDone: st.done,
      stActive: st.active && !st.done,
      stPend: !st.done && !st.active,
    }));
    const joinChips = S.sel.map((id, idx) => ({
      num: String(id).padStart(2, "0"),
      on: idx < S.joined,
      off: !(idx < S.joined),
    }));

    // ----- PC detail view -----
    const dPod =
      S.detailPod != null ? S.pods.find((p) => p.id === S.detailPod) : null;
    const dMeta = dPod ? meta(dPod.status) : null;
    const dSpec = dPod ? podSpec(dPod.id) : null;
    const dRacing = dPod ? dPod.status === "inrace" : false;
    const dTrack = dPod ? TRK[(dPod.id - 1) % 3] : "";
    const dRace = dPod ? RACES[RACE_ORDER[(dPod.id - 1) % 3]] : null;
    const dCar = dRace ? dRace.car : "";
    const P = S.perf;
    const barColor = (v: number) =>
      v > 85 ? "#FF3B5C" : v > 65 ? "#FFB020" : "#2FD27A";
    const tempColor = (v: number) =>
      v > 80 ? "#FF3B5C" : v > 68 ? "#FFB020" : "#2FD27A";
    const perfBars = P
      ? [
          { label: "CPU LOAD", val: P.cpu, txt: P.cpu + "%", color: barColor(P.cpu) },
          { label: "GPU LOAD", val: P.gpu, txt: P.gpu + "%", color: barColor(P.gpu) },
          { label: "MEMORY", val: P.ram, txt: P.ram + "%", color: barColor(P.ram) },
          { label: "VRAM", val: P.vram, txt: P.vram + "%", color: barColor(P.vram) },
        ]
      : [];
    const dStats = P
      ? [
          {
            k: "FRAME RATE",
            v: P.fps,
            u: "FPS",
            c: P.fps >= 120 ? "#2FD27A" : P.fps >= 60 ? "#FFB020" : "#FF3B5C",
          },
          { k: "FRAME TIME", v: P.frame, u: "MS", c: "#5BC0FF" },
          { k: "CPU TEMP", v: P.cpuTemp, u: "°C", c: tempColor(P.cpuTemp) },
          { k: "GPU TEMP", v: P.gpuTemp, u: "°C", c: tempColor(P.gpuTemp) },
          { k: "NETWORK", v: P.ping, u: "MS", c: P.ping < 25 ? "#2FD27A" : "#FFB020" },
          { k: "THROUGHPUT", v: P.net, u: "MB/S", c: "#9FB0C4" },
        ]
      : [];
    const dHw = dSpec
      ? [
          { k: "Processor", v: dSpec.cpu },
          { k: "Graphics", v: dSpec.gpu },
          { k: "Memory", v: dSpec.ram },
          { k: "Storage", v: dSpec.storage },
          { k: "Motherboard", v: dSpec.mobo },
          { k: "Operating System", v: dSpec.os },
        ]
      : [];
    const dPeriph = dSpec
      ? [
          { k: "Wheelbase", v: dSpec.wheel },
          { k: "Pedals", v: dSpec.pedals },
          { k: "Cockpit", v: dSpec.rig },
          { k: "Display", v: dSpec.disp },
        ]
      : [];
    const dGame =
      dPod && dSpec
        ? [
            { k: "Title", v: "Project CARS 2" },
            { k: "Build", v: dSpec.build },
            { k: "Resolution", v: dSpec.res },
            { k: "Graphics Preset", v: "Ultra" },
            { k: "Driving Line", v: Aids.steer === "ON" ? "On" : "Off" },
            {
              k: "Gearbox",
              v: Aids.gear.charAt(0) + Aids.gear.slice(1).toLowerCase(),
            },
            {
              k: "Braking Assist",
              v:
                Aids.brake === "OFF"
                  ? "Off"
                  : Aids.brake.charAt(0) + Aids.brake.slice(1).toLowerCase(),
            },
            {
              k: "Stability Control",
              v:
                Aids.drive === "OFF"
                  ? "Off"
                  : Aids.drive.charAt(0) + Aids.drive.slice(1).toLowerCase(),
            },
          ]
        : [];

    const dFuncs = dPod
      ? [
          {
            key: "launch",
            label: dRacing ? "Restart Game" : "Launch Game",
            tone: "blue",
            icon: "play",
            onTap: () =>
              A_.toast(
                (dRacing ? "Restarting" : "Launching") +
                  " Project CARS 2 on Pod " +
                  dPod.id
              ),
          },
          {
            key: "remote",
            label: "Remote Desktop",
            tone: "plain",
            icon: "screen",
            onTap: () =>
              A_.toast("Connecting to Pod " + dPod.id + " via remote desktop…"),
          },
          {
            key: "message",
            label: "Send Message",
            tone: "plain",
            icon: "msg",
            onTap: () => A_.toast("Message dialog opened for Pod " + dPod.id),
          },
          {
            key: "restart",
            label: "Restart PC",
            tone: "amber",
            icon: "power",
            onTap: () => A_.toast("Pod " + dPod.id + " is restarting…"),
          },
          {
            key: "lock",
            label: dPod.status === "locked" ? "Unlock Pod" : "Lock Pod",
            tone: dPod.status === "locked" ? "blue" : "red",
            icon: "lock",
            onTap: () => {
              if (dPod.status === "locked") {
                A_.unlockPod(dPod.id);
                A_.toast("Pod " + dPod.id + " unlocked");
              } else {
                A_.lockPod(dPod.id);
                A_.toast("Pod " + dPod.id + " locked");
              }
            },
          },
          {
            key: "power",
            label: "Power Off",
            tone: "red",
            icon: "off",
            onTap: () => A_.toast("Pod " + dPod.id + " powering down…"),
          },
        ]
      : [];
    const dFuncList = dFuncs.map((f) => {
      const tones: Record<string, { bd: string; bg: string; fg: string }> = {
        blue: { bd: "rgba(43,166,255,.4)", bg: "rgba(43,166,255,.1)", fg: "#5BC0FF" },
        red: { bd: "rgba(255,59,92,.4)", bg: "rgba(255,59,92,.09)", fg: "#FF6B82" },
        amber: { bd: "rgba(255,176,32,.4)", bg: "rgba(255,176,32,.09)", fg: "#FFB020" },
        plain: { bd: "rgba(255,255,255,.12)", bg: "#141A24", fg: "#C7D0DC" },
      };
      const t = tones[f.tone] || tones.plain;
      return {
        ...f,
        path: FNICON[f.icon],
        style: {
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "flex-start" as const,
          gap: "10px",
          height: "84px",
          padding: "14px 16px",
          borderRadius: "13px",
          cursor: "pointer",
          textAlign: "left" as const,
          border: "1px solid " + t.bd,
          background: t.bg,
          color: t.fg,
          fontFamily: "'Saira Condensed'",
          fontWeight: 700,
          letterSpacing: ".05em",
          fontSize: "15px",
        },
      };
    });
    const dResetEnabled = dRacing && !S.resetting;

    return {
      centreName: CONFIG.centreName,
      clock: S.clock,
      isHome: S.screen === "home",
      isSimlock: S.screen === "simlock",
      isRaceSetup: S.screen === "raceSetup",
      isPods: S.screen === "pods",
      isRaceReady: S.screen === "raceReady",
      isRaceSelect: S.screen === "raceSelect",
      isLobby: S.screen === "lobby",
      onBack: () => A_.go(BACK_MAP[S.screen] || "home"),
      pods: dec,
      counts,
      pkgName: S.pkg ? PK[S.pkg] : "",
      selLabel: S.sel.join(", "),
      selCount: S.sel.length,
      raceList,
      hasRace: !!race,
      raceSelCount: S.selRaces.length,
      hasRaceSel: S.selRaces.length > 0,
      noRaceSel: S.selRaces.length === 0,
      onRacesContinue: () => A_.racesContinue(),
      raceCar: race ? race.car : "",
      raceTrack: race ? race.track : "",
      raceN: race ? race.n : "",
      raceCls: race ? race.cls : "",
      raceColor: race ? race.color : "#2BA6FF",
      raceLoc: race ? race.loc : "",
      raceLen: race ? race.len : "",
      raceTurns: race ? race.turns : "",
      lobbySteps,
      joinChips,
      lobbyReady: S.lobbyReady,
      lobbyWorking: !S.lobbyReady,
      lobbyJoined: S.joined,
      lobbyTotal,
      onProceed: () => A_.proceedGrid(),
      hasSel: S.sel.length > 0,
      noSel: S.sel.length === 0,
      showModal: S.modal !== null,
      mUnlockConfirm: S.modal === "unlockConfirm",
      mTill: S.modal === "till",
      mSuccess: S.modal === "unlockSuccess",
      unlockCount,
      total: "£" + unlockCount * price + ".00",
      perPrice: "£" + price + ".00",
      toast: S.toast,
      hasToast: S.toast !== null,
      aidChips,
      aidDrive: Aids.drive,
      aidDriveColor: aidColor(Aids.drive),
      aidGear: Aids.gear,
      aidGearColor: aidColor(Aids.gear),
      aidBrake: Aids.brake,
      aidBrakeColor: aidColor(Aids.brake),
      aidSteer: Aids.steer,
      aidSteerColor: aidColor(Aids.steer),
      onCycleDrive: () => A_.cycleAid("drive"),
      onCycleGear: () => A_.cycleAid("gear"),
      onCycleBrake: () => A_.cycleAid("brake"),
      onCycleSteer: () => A_.cycleAid("steer"),
      onStatOnline: () => A_.jumpToPods(),
      onStatInrace: () => A_.jumpToPods(),
      onStatReady: () => A_.jumpToPods(),
      onStatLocked: () => A_.jumpToPods(),
      showStat: statDef != null,
      statTitle: statDef ? statDef.title : "",
      statList,
      statCount: statList.length,
      statEmpty: statList.length === 0,
      onStatClose: () => A_.closeStat(),
      showExpand: exPod != null,
      showDetail: dPod != null,
      dNum: dPod ? String(dPod.id).padStart(2, "0") : "",
      dHost: dSpec ? dSpec.host : "",
      dIp: dSpec ? dSpec.ip : "",
      dStatusLabel: dMeta ? dMeta.label : "",
      dStatusColor: dMeta ? dMeta.color : "#8A95A6",
      dStatusSoft: dMeta ? dMeta.soft : "rgba(255,255,255,.06)",
      dStatusDesc: dMeta ? dMeta.desc : "",
      dRacing,
      dIdle: !dRacing,
      dTrack,
      dCar,
      dUptime: dSpec ? dSpec.uptimeH + "h " + dSpec.uptimeM + "m" : "",
      dStats,
      perfBars,
      dHw,
      dPeriph,
      dGame,
      dFuncList,
      dShowReset: dRacing,
      dResetEnabled,
      dResetDisabled: !dResetEnabled,
      onCloseDetail: () => A_.closeDetail(),
      onDetailReset: () => {
        if (dPod) A_.resetCar(dPod.id);
      },
      exNum: exPod ? String(exPod.id).padStart(2, "0") : "",
      exStatus: exMeta ? exMeta.label : "",
      exColor: exMeta ? exMeta.color : "#8A95A6",
      exSoft: exMeta ? exMeta.soft : "rgba(255,255,255,.06)",
      exDesc: exMeta ? exMeta.desc : "",
      exInRace: !!(exPod && exPod.status === "inrace"),
      exNotRacing: !!(exPod && exPod.status !== "inrace"),
      exCar: exRace ? exRace.car : "",
      exTrack: exRace ? exRace.track : "",
      exLoc: exRace ? exRace.loc : "",
      exCls: exRace ? exRace.cls : "",
      exMap: exRace ? exRace.map : "",
      exRaceColor: exRace ? exRace.color : "#2BA6FF",
      teleSpeed: T ? T.speed : 0,
      teleGear: T ? T.gear : 0,
      teleRpmPct: T ? Math.round(T.rpm * 100) + "%" : "0%",
      teleLap: T ? T.lap : 0,
      teleLaps: T ? T.laps : 0,
      telePos: T ? T.pos : 0,
      teleGrid: T ? T.grid : 0,
      teleLapTime: T ? T.lapTime : "--:--",
      teleLastLap: T ? T.lastLap : "--:--",
      resetting: S.resetting,
      notResetting: !S.resetting,
      onExpandClose: () => A_.closeExpand(),
      onResetCar: () => A_.resetCar(exPod ? exPod.id : 0),
      onExpandManage: () => {
        A_.closeExpand();
        A_.go("simlock");
      },
      onSimLock: () => A_.go("simlock"),
      onRaceSetup: () => A_.go("raceSetup"),
      onPrintReceipt: () => A_.printReceipt(),
      showPrint: S.printOpen,
      onClosePrint: () => A_.closePrint(),
      onConfirmPrint: () => A_.confirmPrint(),
      printRows: [
        {
          key: "receipt" as const,
          label: "Customer receipt",
          sub: "Itemised payment receipt",
          on: S.printOpts.receipt,
        },
        {
          key: "session" as const,
          label: "Session summary",
          sub: "Package, races & driving aids",
          on: S.printOpts.session,
        },
        {
          key: "podStatus" as const,
          label: "Pod status report",
          sub: "Live state of every pod",
          on: S.printOpts.podStatus,
        },
        {
          key: "takings" as const,
          label: "Daily takings",
          sub: "Running total for the day",
          on: S.printOpts.takings,
        },
      ].map((r) => ({
        ...r,
        off: !r.on,
        onToggle: () => A_.togglePrintOpt(r.key),
      })),
      combos: [
        {
          n: "1",
          label: "Rookie Combo",
          desc: "Silverstone + Monza",
          onPick: () => A_.comboSelect(0),
        },
        {
          n: "2",
          label: "Sport Combo",
          desc: "Monza + Nürburgring",
          onPick: () => A_.comboSelect(1),
        },
        {
          n: "3",
          label: "Pro Combo",
          desc: "All three circuits",
          onPick: () => A_.comboSelect(2),
        },
      ],
      isListView: !isMap,
      isMapView: isMap,
      leftPods,
      rightPods,
      showRules: S.rulesOpen,
      rulesRows,
      onRulesExpand: () => A_.openRules(),
      onCloseRules: () => A_.closeRules(),
      stop: (e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
      },
      onLockAll: () => A_.lockAll(),
      onStandbyAll: () => A_.standbyAll(),
      onGetStatus: () => A_.getStatus(),
      onUnlockAll: () => A_.openUnlock(),
      onConfirmUnlock: () => A_.confirmUnlock(),
      onConfirmPayment: () => A_.confirmPayment(),
      onCloseModal: () => A_.closeModal(),
      selX3: () => A_.selectPackage("x3"),
      selX5: () => A_.selectPackage("x5"),
      selGold: () => A_.selectPackage("gold"),
      selPlat: () => A_.selectPackage("plat"),
      selSilver: () => A_.selectPackage("silver"),
      selBronze: () => A_.selectPackage("bronze"),
      selVoucher: () => A_.selectPackage("voucher"),
      selMin30: () => A_.selectPackage("min30"),
      selMin60: () => A_.selectPackage("min60"),
      selCustom: () => A_.selectPackage("custom"),
      onSubmit: () => A_.submitRace(),
      onStart: () => A_.startRace(),
      onEdit: () => A_.editPods(),
      onCancel: () => A_.cancelSetup(),
      onHome: () => A_.go("home"),
      buildCount: S.buildSel.length,
      hasBuild: S.buildSel.length > 0,
      buildUnlockedTotal: counts.unlocked,
      onBuildCreate: () => A_.startBuildRace(false),
      onBuildClear: () => A_.clearBuild(),
    };
  }, [S, A_]);
}

export type Vals = ReturnType<typeof useVals>;
