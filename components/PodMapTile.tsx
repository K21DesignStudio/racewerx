"use client";

import React from "react";
import { css } from "./css";
import { Hover } from "./Hover";
import { PerspectiveTrack } from "./SimGraphics";
import type { Vals } from "@/state/useVals";

type PodVal = Vals["pods"][number];

export function PodMapTile({ p }: { p: PodVal }) {
  return (
    <Hover
      as="button"
      onClick={p.onExpand}
      title="Open pod view"
      style={css(`display:flex;flex-direction:column;gap:8px;text-align:left;cursor:pointer;background:#141A24;border:1px solid rgba(255,255,255,.08);border-left:3px solid ${p.color};border-radius:12px;padding:10px;color:#F2F5F9;`)}
      hoverStyle={css("border-color:rgba(255,255,255,.2);background:#171f2b;")}
    >
      {p.inrace && (
        <span style={css("position:relative;display:block;width:100%;aspect-ratio:16/9;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.1);")}>
          <PerspectiveTrack variant="card" />
          <span style={css("position:absolute;top:6px;right:6px;display:inline-flex;align-items:center;gap:4px;background:rgba(225,18,51,.9);border-radius:4px;padding:2px 5px;font-family:'Saira Condensed';font-weight:800;letter-spacing:.1em;font-size:8px;color:#fff;animation:liveBlink 1.4s infinite;")}>
            <span style={css("width:5px;height:5px;border-radius:50%;background:#fff;")} />LIVE
          </span>
          <span style={css("position:absolute;bottom:5px;left:7px;font-family:'Saira Condensed';font-weight:600;font-size:9px;color:#C7D0DC;")}>{p.track}</span>
        </span>
      )}
      <span style={css("display:flex;align-items:center;gap:9px;")}>
        <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:21px;line-height:1;min-width:26px;")}>{p.num}</span>
        <span style={css("display:flex;align-items:center;gap:6px;min-width:0;")}>
          <span style={css(`width:7px;height:7px;border-radius:50%;background:${p.color};flex:none;`)} />
          <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:12px;color:${p.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`)}>{p.label}</span>
        </span>
      </span>
    </Hover>
  );
}
