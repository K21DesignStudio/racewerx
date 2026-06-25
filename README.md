# Racewerx — Staff Control Centre

A touch-friendly, iPad-first dashboard for staff at the **Racewerx** sim-racing
centre to run customer sessions on **Project CARS 2**: lock/unlock sim pods,
build races from preset packages, host the in-game lobby, and monitor live
sessions and per-pod PC health.

This is a faithful **Next.js + React + TypeScript** implementation of the
interactive prototype designed in Claude Design. The original design bundle is
preserved under [`project/`](project/) (the `*.dc.html` prototype + assets) and
the full design conversation under [`chats/`](chats/).

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm start` (serve the
build), `npm run typecheck` (`tsc --noEmit`).

> The Saira / Saira Condensed fonts load from Google Fonts at runtime (as in the
> prototype). If your environment blocks `fonts.googleapis.com` the UI falls
> back to the system sans-serif; everything else works offline.

## What's in it

The whole staff journey is a single client-rendered dashboard with these
screens and overlays:

- **Home** — compact header stat strip (Online / In Race / Ready / Locked,
  clickable), header **LOCK / UNLOCK ALL**, **RECEIPT** print dialog, the live
  pod grid (list view = full per-pod management cards; map view = left/right
  bays around a race floor with inline live previews), a sticky **"build a
  race"** bar (tap unlocked pods → CREATE RACE), the **LIVE POD STATUS**
  divider, and the inline **Race Setup** package grid (10 packages).
- **Race Select** — 3 preset races (McLaren 650S GT3 · Silverstone, Formula X ·
  Monza, Formula X · Nürburgring), tappable session-rule aids, **Quick Combos**,
  and ordered multi-select.
- **Select Sim Pods** → **Creating Race Lobby** (Project CARS 2 host sequence:
  lobby created → pods join → synchronised) → **Race Ready** → **Start Race**.
- **Sim Lock Mode** — dedicated per-pod lock/unlock management grid.
- **Unlock All** safety flow — confirm → (optional) till transaction → success.
- **PC Detail view** — per-pod hardware, sim rig, game settings, live
  performance metrics and remote actions.
- **Pod expand / live sim view** with telemetry HUD and **Reset Car**, the
  **stat-group list** modal, the expandable **Session Rules** editor, and toasts.

Timed behaviour (pod seed states, telemetry, lobby timers, generated PC specs)
stays client-side as in the prototype. Lock/unlock actions now call the Sim Lock
bridge API first, then update the dashboard state.

## Architecture

```
app/
  layout.tsx          fonts + global metadata
  page.tsx            mounts <DashboardProvider><Dashboard/>
  globals.css         resets, keyframes, responsive app-bar rules
state/
  store.tsx           DashboardProvider — all state, actions & timers
                      (a 1:1 port of the prototype's DCLogic component)
  useVals.ts          derived view-model (port of renderVals())
lib/
  data.ts             types, status meta, packages, races, aids, PC-spec gens
components/
  css.ts              parses the prototype's inline CSS strings -> React style
  Hover.tsx           style-hover equivalent
  Icons.tsx           SVG icon set
  SimGraphics.tsx     the perspective "track" used in every live preview
  AppBar.tsx, HomeScreen.tsx, PackageGrid.tsx, PodManageCard.tsx,
  PodMapTile.tsx, screens.tsx, overlays.tsx, Dashboard.tsx
public/assets/racewerx-logo.png
```

The implementation preserves the prototype's structure deliberately: state lives
in one provider (mirroring the original component class), screens read a single
derived `vals` object, and inline styles are kept verbatim and parsed at runtime
so the visuals match pixel-for-pixel.

### Configuration

Editable knobs from the prototype live in `lib/data.ts` → `CONFIG`:
`centreName`, `podCount` (2–16), `tillRequired` (default `false` — Unlock All
skips the till step; set `true` to require a till transaction), and
`unlockPrice`.

### Sim Lock bridge

Home screen pod **LOCK / UNLOCK** buttons and the header **LOCK / UNLOCK ALL**
actions POST to `app/api/sim-lock/route.ts`.

Without `SIM_LOCK_AGENT_URL`, the route runs in demo mode and returns success so
the UI can be tested locally and on Vercel.

Set these environment variables when pointing the dashboard at the local Sim
Lock agent:

```bash
SIM_LOCK_AGENT_URL=http://localhost:8787
SIM_LOCK_AGENT_TOKEN=optional-secret
SIM_LOCK_TIMEOUT_MS=2500
```

Default agent endpoints:

```text
POST /api/pods/{podId}/lock
POST /api/pods/{podId}/unlock
POST /api/pods/lock-all
POST /api/pods/unlock-all
```

If the existing agent uses different paths, override them without changing the
dashboard code:

```bash
SIM_LOCK_LOCK_PATH=/lock/{podId}
SIM_LOCK_UNLOCK_PATH=/unlock/{podId}
SIM_LOCK_LOCK_ALL_PATH=/lock-all
SIM_LOCK_UNLOCK_ALL_PATH=/unlock-all
```

## Provenance

Generated from a Claude Design handoff bundle. The brief and every iteration —
adding the lobby sequence, the car/track previews, map view, multi-select,
voucher/custom packages, the PC detail view, the build-a-race flow, and the
teammate review comments — are captured in [`chats/`](chats/).
