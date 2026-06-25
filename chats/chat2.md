# Race preset selection logic

_Started 2026-06-20 19:15 UTC_

---

## User

great, now for the race select we need to select the race pre set 

which is basilcy the pre made game package 

race 1 - 650s mclaren gt3 in silverstone classic 

race 2 - monza classic - formula x 

race 3 - nurburing - formula x 

driving aids = normal
gearbox = automatic 
asisits = none ( braking / steering ) 

now some logic needs to be done in the background such as 

in project cars 2 
main lobby gets created with set settings 

then the remaing pods join and start session

this brings onto race start ready for them to go

## Assistant

_[tool: list_files]_

_[tool: read_file]_

Got it — adding a **Race Select** step (the 3 preset packages with their fixed assist rules) plus the Project CARS 2 **lobby-hosting** sequence between pod selection and race-ready. Wiring the logic first.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the template — spin keyframe, Race Select screen, Lobby screen, plus pod-header and race-ready tweaks.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Let me verify the new screens by driving the flow.

_[tool: show_html]_

Added a **Race Select** step and the **Project CARS 2 lobby-host sequence**:

- **Select Race** (after picking a package): the 3 pre-built presets — *01 McLaren 650S GT3 · Silverstone Classic*, *02 Formula X · Monza Classic*, *03 Formula X · Nürburgring* — with the shared session rules shown up top: Driving Aids **Normal**, Gearbox **Automatic**, Braking + Steering assist **Off**.
- Flow is now **Race Setup → Select Race → Select Pods → Creating Lobby → Race Ready → Start**.
- **Creating Lobby** screen animates the background logic: main lobby created with the settings → pods join the session one-by-one → session synchronised → then "Proceed to Grid" lands on Race Ready.

_[tool: ready_for_verification]_

Done. The race-select preset step and the lobby-hosting sequence are wired into the flow.

## User

on the main dashboard can you add a widget for lock / unlock all so it can be easy and bold to see on this screen, this will skip a step and let staff go directly into race set up

## Assistant

_[tool: dc_html_str_replace]_

Added a bold **Quick Pod Control** widget to the dashboard — Lock All / Unlock All right on the home screen so staff can secure or open every pod in one tap without entering Sim Lock, then go straight to Race Setup. Unlock All still routes through the till confirmation.

_[tool: ready_for_verification]_

Done — the Quick Pod Control widget is live on the dashboard.

