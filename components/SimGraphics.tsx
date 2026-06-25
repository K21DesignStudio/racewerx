import React from "react";
import { css } from "./css";

/**
 * The faux Project CARS 2 perspective track used inside every live preview.
 * `variant="card"` matches the dashboard/sim-lock cards (apex 40); `"screen"`
 * matches the larger expand-modal / PC-detail sim screens (apex 37).
 */
export function PerspectiveTrack({
  variant = "card",
}: {
  variant?: "card" | "screen";
}) {
  const apex = variant === "card" ? 40 : 37;
  const centerTop = variant === "card" ? 42 : 40;
  const grad =
    variant === "card"
      ? "linear-gradient(#13203a 0%,#2d3f63 32%,#6a5b54 42%,#143a20 42%,#0a1f12 100%)"
      : "linear-gradient(#13203a 0%,#2d3f63 30%,#6a5b54 41%,#143a20 41%,#0a1f12 100%)";
  return (
    <>
      <span style={css(`display:block;position:absolute;inset:0;background:${grad};`)} />
      <svg
        viewBox="0 0 160 90"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={css("position:absolute;inset:0;")}
      >
        <polygon points={`66,${apex} 94,${apex} 150,90 10,90`} fill="#17191e" />
        <line x1="66" y1={apex} x2="10" y2="90" stroke="#c62828" strokeWidth="3.5" />
        <line
          x1="66"
          y1={apex}
          x2="10"
          y2="90"
          stroke="#f5f5f5"
          strokeWidth="3.5"
          strokeDasharray="6 6"
        />
        <line x1="94" y1={apex} x2="150" y2="90" stroke="#c62828" strokeWidth="3.5" />
        <line
          x1="94"
          y1={apex}
          x2="150"
          y2="90"
          stroke="#f5f5f5"
          strokeWidth="3.5"
          strokeDasharray="6 6"
        />
        <line
          x1="80"
          y1={centerTop}
          x2="80"
          y2="90"
          stroke="#efeae0"
          strokeWidth="2.4"
          strokeDasharray="5 8"
          style={css("animation:dashMove .45s linear infinite;")}
        />
      </svg>
    </>
  );
}
