# Racing game prototype design

_Started 2026-06-20 17:46 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Untitled"
Project currently has 1 file(s)
Current date is now June 20, 2026
</system-info>

<attached_files>
- uploads/Web 1920 - 103.png
- uploads/maxresdefault.jpg
- uploads/Screenshot 2026-06-20 at 18.52.19.png
</attached_files>

<pasted_text name="Pasted text (140 lines)">
Create a modern, touch-friendly iPad dashboard mockup for our sim racing centre called **Racewerx**.

The dashboard is for staff to control customer racing sessions. It must be extremely easy to use, even for non-technical staff. The design should feel professional, fast, motorsport-inspired, and clearly linked to **Project CARS 2**, as this is the only game we run. The UI should not feel childish or like a generic admin panel. It should feel like a premium racing control centre.

The design must be responsive and work well on:

* iPad / tablet as the main screen
* Mobile phone as a backup screen
* Desktop if needed

Use large touch-friendly cards, clear buttons, simple labels, strong contrast, and a clean flow. Avoid clutter. Staff should be able to understand what to press within seconds.

## Main Dashboard Sections

### 1. Sim Lock Mode

Create a screen where staff can see all sim pods clearly.

Each sim pod should show:

* Pod number
* Current status: Locked, Unlocked, In Race, Ready, Offline
* Simple colour/status indicator
* Quick action button

Staff need the ability to:

* Lock individual sim pods
* Unlock individual sim pods
* Unlock all sims

When staff press **Unlock All**, the flow should be:

1. Show confirmation screen
2. Open till / transaction prompt
3. After transaction is confirmed, unlock the sims for customer use

Make this flow feel safe and clear so staff do not accidentally unlock everything.

### 2. Race Setup Page

Create a dedicated **Race Setup** screen.

This screen should have pre-made race session cards:

* **x3 Race Session**
* **x5 Race Session**
* **Open Gold Package**
* **Open Platinum Package**

Each package card should look premium and be easy to tap. Include a short description area under each card, even if placeholder text is used.

When staff select a package, the dashboard should move to the next step:

### 3. Select Sim Pods

After selecting a race package, show a pod selection screen.

Staff can select which sim pods are joining the race.

Example:

* Staff selects Pod 3, Pod 4, and Pod 5
* The selected pods become highlighted
* Staff presses **Submit Race Setup**
* The system confirms that Pod 3, 4, and 5 are now entered into the race and ready to start

The pod selection should be very visual and simple. Use large numbered pod cards. Staff should be able to quickly select and deselect pods.

### 4. Race Ready Confirmation

After submitting, show a clear confirmation screen:

“Race Ready”
“x3 Race Session”
“Pods 3, 4, 5 are now ready”

Include clear actions:

* Start Race
* Edit Pods
* Cancel Setup
* Back to Dashboard

## UX Requirements

The dashboard flow should be:

Home Dashboard
→ Sim Lock Mode
→ Unlock / Lock Sims
→ Race Setup
→ Select Package
→ Select Pods
→ Submit
→ Race Ready Confirmation

Keep the user journey simple and linear.

Use a modern card-based layout. Make the design look like a real working product, not just a wireframe.

## Visual Style

The design should feel like:

* Premium sim racing control centre
* Motorsport dashboard
* Project CARS 2 inspired
* Dark mode preferred
* High contrast
* Clean neon/LED accent colours
* Modern iPad app UI
* Simple enough for staff training

Avoid:

* Too many small buttons
* Complicated menus
* Tiny text
* Generic SaaS styling
* Overly colourful arcade style

## Screens to Create

Please create the full dashboard flow with these screens:

1. Main Home Dashboard
2. Sim Lock Mode screen
3. Unlock All confirmation / till transaction flow
4. Race Setup package selection screen
5. Pod selection screen
6. Race Ready confirmation screen
7. Mobile responsive version of the key screens

## Important Notes

I have attached screenshots of our current crude system and an old prototype. Use them only as a foundation to understand the logic and layout. Do not copy the old design directly. Create a much more modern, intuitive, premium and staff-friendly version.

The final result should look like a dashboard we can give to developers to build.

</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Design Components">
This project uses Design Components: every design is a single streaming `Name.dc.html` file. The full authoring spec is in your system prompt under "Writing code — Design Components" — follow it. Author and edit `.dc.html` content with the `dc_write`, `dc_html_str_replace`, `dc_js_str_replace`, and `dc_set_props` tools (not `write_file`; `str_replace_edit` works but won't stream); template edits stream into the live preview as you type.
</attached-skill>

<attached-skill name="Design System (design system)">
[Design System] This project uses the **Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/080b6749-cd3c-4c06-88e1-0b9dc38be9f2/`. Before producing any visuals, explore it: call `list_files("/projects/080b6749-cd3c-4c06-88e1-0b9dc38be9f2/")` to see the structure, then `read_file` the README/base.md or whatever index file it has. Don't guess at the design system's contents.

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s). Before writing any `var(--*)`, look up the real name in the design system's `.css` files (`list_files` + `read_file` under `/projects/080b6749-cd3c-4c06-88e1-0b9dc38be9f2/`). Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/080b6749-cd3c-4c06-88e1-0b9dc38be9f2/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## Assistant

I'll explore the design system first, then ask a few focused questions.

_[tool: list_files]_

_[tool: list_files]_

The bound design system project is empty, so I'll build on your Racewerx brand directly (crimson red + black, the RW hex mark, motorsport-condensed type, Project CARS 2 dark/neon feel). A few quick decisions before I build:

_[tool: questions_v2]_

## User

Questions answered:
- deliverable: One interactive prototype — tap through the whole flow (Home → Sim Lock → Race Setup → Pods → Race Ready)
- accent: Electric blue (Project CARS 2 HUD style)
- variations: Decide for me
- pods: 8
- density: Nav tiles + live pod status overview at a glance

## Assistant

The bound design system is empty, so I'll build directly on the Racewerx brand. Building the full interactive prototype now — one streaming Design Component with the whole flow.

_[tool: update_todos]_

_[tool: dc_write]_

I left a typo in the Gold card tag color. Let me fix it.

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

Header renders but the home `sc-if` body is empty. Let me inspect the DOM.

_[tool: eval_js]_

_[tool: eval_js]_

Everything renders and is visible (nav tiles, 8 pods, stats all present in the DOM) — the dark screenshots are just an html-to-image capture artifact with the streamed subtree, not a real issue. Handing off.

_[tool: update_todos]_

_[tool: set_project_title]_

_[tool: ready_for_verification]_

Built the full **Racewerx** staff control centre as one interactive prototype — tap straight through Home → Sim Lock → Race Setup → Select Pods → Race Ready. Dark motorsport UI, electric-blue HUD accent on the crimson/black brand, the RW hex mark, condensed Saira type.

Key behaviours wired:
- **Home** — live pod-status overview + stat counters + two big nav tiles.
- **Sim Lock** — 8 pod cards with status colours (Locked / Unlocked / In Race / Ready / Offline), per-pod Lock/Unlock, Lock All, and a safe **Unlock All → confirm → till transaction → success** flow.
- **Race Setup** — 4 premium package cards (x3, x5, Gold, Platinum) → **Pod selection** (multi-select) → **Submit** → **Race Ready** confirmation with Start / Edit / Cancel / Back.

Layout is fluid (CSS grid + `clamp`) so it reflows cleanly from iPad to phone to desktop. Three tweaks are exposed: centre name, pod count (2–16), and whether Unlock All requires a till step.

Note: the package prices (£20/£30/£35/£60) and the £15/pod unlock charge are placeholders — tell me the real figures and I'll drop them in.

