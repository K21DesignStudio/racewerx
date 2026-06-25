# Race selection UI enhancements

_Started 2026-06-21 02:11 UTC_

---

## User

I want you to on the choose race section with the races to include a car + track map preview in the race box 

I want the section in there that shows driving aids for it to be tap able so we can modify it if needed 

I also want a open to expand view on dash board to also include a view of the sim screen of them racing 

I want you to add during during race a reset car function

## Assistant

_[tool: read_file]_

Got it — four changes. Let me implement them. Starting with the logic (state, aids cycling, expand/sim telemetry, reset car), then the template.

_[tool: dc_js_str_replace]_

Adding that too. Continuing the logic edits — including making the 4 stat cards open a list of those pods.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

## Assistant

_[tool: dc_js_str_replace]_

Logic done. Now the template. First, keyframes + the 4 stat cards becoming clickable:

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the dashboard pod card → opens expand view:

_[tool: dc_html_str_replace]_

Now the tappable driving-aids bar in RACE SELECT:

_[tool: dc_html_str_replace]_

Now the race card with car + track-map preview:

_[tool: dc_html_str_replace]_

Now drive the lobby aids from state:

_[tool: dc_html_str_replace]_

Now the RACE READY chips from state:

_[tool: dc_html_str_replace]_

Now add VIEW SIM + RESET CAR to the Sim Lock in-race cards:

_[tool: dc_html_str_replace]_

Now the two new overlays — the stat-group list modal and the expand/sim-screen modal with reset. Inserting before the toast:

_[tool: dc_html_str_replace]_

Let me verify it renders cleanly and check the key new views.

_[tool: show_html]_

_[tool: show_html]_

The 4 stat cards now show chevrons and are clickable. Let me check the race-select preview and the sim view modal:

_[tool: multi_screenshot]_

_[tool: eval_js]_

_[tool: multi_screenshot]_

The race-select cards now show the track-map + car preview, and the tappable driving-aids bar renders with the cycle icons. Now let me check the sim view — navigate to an in-race pod via the IN RACE stat card:

_[tool: multi_screenshot]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

The "PODS IN RACE" list modal works (pods 03, 04 with OPEN). Now opening one to see the sim screen:

_[tool: multi_screenshot]_

All four features work. The sim screen renders with perspective track, curbs, HUD (position, lap, LIVE, car/track) and the RESET CAR overlay triggers correctly.

Summary of what I added:
- **Race boxes** now show a car + track-map preview (per-circuit map outline with a car-on-grid marker).
- **Driving aids** in the session-rules bar are tappable chips — tap to cycle (e.g. Driving aids → FULL/OFF), and the choices flow through to the lobby and race-ready screens.
- **Dashboard expand view**: clicking any pod (or the 4 stat cards → a pod list) opens a pod view; for racing pods it shows a live sim screen with telemetry HUD.
- **Reset car** is available in the sim view and on Sim Lock in-race cards, with a "Resetting car…" state and confirmation toast.

A note: the sim-view modal is tall, so on short preview windows it scrolls — it fits fully at the dashboard's normal height.

_[tool: ready_for_verification]_

