"use client";

import React from "react";
import { css } from "./css";
import { Hover } from "./Hover";
import { PerspectiveTrack } from "./SimGraphics";
import {
  ChevRight,
  LockClosed,
  LockOpen,
  Plus,
  Check,
  ExpandCorners,
  EyeOff,
  Reset,
} from "./Icons";
import type { Vals } from "@/state/useVals";

type PodVal = Vals["pods"][number];

export function PodManageCard({
  p,
  showBuild,
}: {
  p: PodVal;
  showBuild: boolean;
}) {
  return (
    <div style={css("background:#141A24;border:1px solid rgba(255,255,255,.07);border-radius:15px;overflow:hidden;")}>
      <div style={css(`height:4px;background:${p.color};`)} />
      <div style={css("padding:18px;display:flex;flex-direction:column;gap:15px;")}>
        <button
          onClick={p.onDetail}
          title="Open PC details"
          style={css("display:flex;align-items:flex-start;justify-content:space-between;gap:12px;cursor:pointer;background:none;border:0;padding:0;text-align:left;color:#F2F5F9;width:100%;")}
        >
          <div>
            <div style={css("font-size:11px;font-weight:600;letter-spacing:.26em;color:#6B7689;")}>SIM POD</div>
            <div style={css("display:flex;align-items:center;gap:8px;margin-top:3px;")}>
              <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:36px;line-height:1;")}>{p.num}</span>
              <span style={css("display:inline-flex;color:#5A6475;")}>
                <ChevRight w={17} h={17} />
              </span>
            </div>
          </div>
          <span style={css(`display:inline-flex;align-items:center;gap:8px;padding:7px 13px;border-radius:999px;background:${p.soft};`)}>
            {p.live ? (
              <span style={css(`width:8px;height:8px;border-radius:50%;background:${p.color};animation:livePulse 1.4s infinite;`)} />
            ) : (
              <span style={css(`width:8px;height:8px;border-radius:50%;background:${p.color};`)} />
            )}
            <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.12em;font-size:13px;color:${p.color};`)}>{p.label}</span>
          </span>
        </button>

        <div style={css("font-size:13px;color:#8A95A6;border-top:1px solid rgba(255,255,255,.06);padding-top:13px;")}>{p.desc}</div>

        {p.actionable && (
          <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;")}>
            <button
              onClick={p.onLock}
              style={css("height:50px;border-radius:11px;border:1px solid rgba(255,59,92,.35);background:rgba(255,59,92,.07);color:#FF6B82;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;")}
            >
              <LockClosed w={15} h={15} />LOCK
            </button>
            <button
              onClick={p.onStandby}
              style={css("height:50px;border-radius:11px;border:1px solid rgba(167,139,250,.38);background:rgba(167,139,250,.09);color:#C4B5FD;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;")}
            >
              <EyeOff w={15} h={15} />STANDBY
            </button>
            <button
              onClick={p.onUnlock}
              style={css("height:50px;border-radius:11px;border:1px solid rgba(43,166,255,.4);background:rgba(43,166,255,.1);color:#5BC0FF;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;")}
            >
              <LockOpen w={15} h={15} />UNLOCK
            </button>
          </div>
        )}

        {showBuild && p.canBuild && (
          <>
            {p.notInBuild && (
              <Hover
                as="button"
                onClick={p.onBuildToggle}
                title="Add this pod to a new race"
                style={css("height:46px;border-radius:11px;border:1px dashed rgba(47,210,122,.55);background:rgba(47,210,122,.05);color:#2FD27A;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;")}
                hoverStyle={css("background:rgba(47,210,122,.12);border-color:rgba(47,210,122,.85);")}
              >
                <Plus w={16} h={16} sw={2.4} />ADD TO RACE
              </Hover>
            )}
            {p.inBuild && (
              <Hover
                as="button"
                onClick={p.onBuildToggle}
                title="Remove from race build"
                style={css("height:46px;border-radius:11px;border:1px solid rgba(47,210,122,.7);background:rgba(47,210,122,.16);color:#2FD27A;font-family:'Saira Condensed';font-weight:800;letter-spacing:.07em;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;")}
                hoverStyle={css("background:rgba(47,210,122,.24);")}
              >
                <Check w={16} h={16} sw={2.8} />IN RACE BUILD&nbsp;·&nbsp;
                <span style={css("font-weight:700;color:#9FE6BE;")}>REMOVE</span>
              </Hover>
            )}
          </>
        )}

        {p.inrace && (
          <div style={css("display:flex;flex-direction:column;gap:10px;")}>
            <button
              onClick={p.onExpand}
              title="Open live sim view"
              style={css("position:relative;display:block;width:100%;aspect-ratio:16/9;border-radius:11px;overflow:hidden;border:1px solid rgba(255,255,255,.12);cursor:pointer;padding:0;background:#0a0e14;")}
            >
              <PerspectiveTrack variant="card" />
              <span style={css("position:absolute;top:9px;left:9px;font-family:'Saira Condensed';font-weight:800;font-size:13px;color:#fff;background:rgba(8,12,18,.6);border-radius:5px;padding:3px 8px;")}>POD {p.num}</span>
              <span style={css("position:absolute;top:9px;right:9px;display:inline-flex;align-items:center;gap:5px;background:rgba(225,18,51,.9);border-radius:5px;padding:3px 7px;font-family:'Saira Condensed';font-weight:800;letter-spacing:.12em;font-size:10px;color:#fff;animation:liveBlink 1.4s infinite;")}>
                <span style={css("width:6px;height:6px;border-radius:50%;background:#fff;")} />LIVE
              </span>
              <span style={css("position:absolute;bottom:9px;left:9px;font-family:'Saira Condensed';font-weight:600;letter-spacing:.04em;font-size:10px;color:#C7D0DC;")}>{p.track}</span>
              <span style={css("position:absolute;bottom:8px;right:9px;display:inline-flex;align-items:center;gap:5px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:10px;color:#9FD4FF;")}>
                EXPAND<ExpandCorners w={12} h={12} sw={2.4} />
              </span>
            </button>
            <div style={css("display:flex;align-items:center;justify-content:center;gap:9px;height:38px;border-radius:10px;background:rgba(47,210,122,.08);border:1px solid rgba(47,210,122,.25);color:#2FD27A;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:13px;")}>
              <span style={css("width:8px;height:8px;border-radius:50%;background:#2FD27A;animation:livePulse 1.4s infinite;")} />RACE IN PROGRESS
            </div>
            <button
              onClick={p.onReset}
              style={css("height:46px;border-radius:11px;border:1px solid rgba(255,176,32,.4);background:rgba(255,176,32,.09);color:#FFB020;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;")}
            >
              <Reset w={16} h={16} />RESET CAR
            </button>
          </div>
        )}

        {p.offline && (
          <div style={css("display:flex;align-items:center;justify-content:center;gap:9px;height:50px;border-radius:11px;background:rgba(107,118,137,.08);border:1px solid rgba(107,118,137,.22);color:#8A95A6;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:14px;")}>POD OFFLINE</div>
        )}
      </div>
    </div>
  );
}
