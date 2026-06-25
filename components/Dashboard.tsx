"use client";

import React from "react";
import { css } from "./css";
import { useVals } from "@/state/useVals";
import { AppBar } from "./AppBar";
import { HomeScreen } from "./HomeScreen";
import {
  SimLockScreen,
  RaceSetupScreen,
  RaceSelectScreen,
  PodsScreen,
  LobbyScreen,
  RaceReadyScreen,
} from "./screens";
import {
  PrintDialog,
  UnlockModals,
  StatModal,
  ExpandModal,
  RulesModal,
  DetailView,
  Toast,
} from "./overlays";

export function Dashboard() {
  const v = useVals();

  return (
    <div style={css("min-height:100vh;color:#F2F5F9;font-family:'Saira','Saira Condensed',system-ui,sans-serif;background:radial-gradient(1200px 620px at 10% -10%,rgba(43,166,255,.10),transparent 58%),radial-gradient(1000px 700px at 100% -4%,rgba(193,18,46,.13),transparent 54%),#07090D;")}>
      <div style={css("max-width:1340px;margin:0 auto;padding:clamp(16px,3vw,30px) clamp(16px,3vw,32px) 60px;")}>
        <AppBar v={v} />
        {v.isHome && <HomeScreen v={v} />}
        {v.isSimlock && <SimLockScreen v={v} />}
        {v.isRaceSetup && <RaceSetupScreen v={v} />}
        {v.isRaceSelect && <RaceSelectScreen v={v} />}
        {v.isPods && <PodsScreen v={v} />}
        {v.isLobby && <LobbyScreen v={v} />}
        {v.isRaceReady && <RaceReadyScreen v={v} />}
      </div>

      {/* Overlays — fixed-position, rendered on top of any screen */}
      <PrintDialog v={v} />
      <UnlockModals v={v} />
      <StatModal v={v} />
      <ExpandModal v={v} />
      <RulesModal v={v} />
      <DetailView v={v} />
      <Toast v={v} />
    </div>
  );
}
