"use client";

import React from "react";
import { css } from "./css";
import { Hover } from "./Hover";
import { ArrowRight, Flag } from "./Icons";
import { PodManageCard } from "./PodManageCard";
import { PodMapTile } from "./PodMapTile";
import { PackageGrid } from "./PackageGrid";
import type { Vals } from "@/state/useVals";

export function HomeScreen({ v }: { v: Vals }) {
  return (
    <div style={css("animation:popIn .4s ease both;")}>
      {/* ===== Pods — list view ===== */}
      {v.isListView && (
        <div data-pod-section="" style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(262px,1fr));gap:16px;")}>
          {v.pods.map((p) => (
            <PodManageCard key={p.id} p={p} showBuild />
          ))}
        </div>
      )}

      {/* ===== Pods — map view ===== */}
      {v.isMapView && (
        <div style={css("display:grid;grid-template-columns:1fr minmax(200px,1.2fr) 1fr;gap:14px;align-items:stretch;background:#0B0F15;border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:16px;")}>
          <div style={css("display:flex;flex-direction:column;gap:11px;")}>
            <div style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.2em;font-size:11px;color:#6B7689;text-align:center;")}>LEFT BAY</div>
            {v.leftPods.map((p) => (
              <PodMapTile key={p.id} p={p} />
            ))}
          </div>
          <div style={css("border-radius:14px;background:radial-gradient(120% 100% at 50% 0%,#11161f,#090d13);border:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:22px 16px;min-height:240px;")}>
            <div style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.26em;font-size:11px;color:#6B7689;")}>RACE FLOOR</div>
            <svg width="140" height="118" viewBox="0 0 120 100" fill="none">
              <ellipse cx="60" cy="50" rx="42" ry="34" stroke="#2BA6FF" strokeWidth="2.5" opacity="0.5" />
              <ellipse cx="60" cy="50" rx="26" ry="18" stroke="#2BA6FF" strokeWidth="1.5" opacity="0.25" />
              <rect x="57" y="14" width="6" height="6" fill="#e9edf3" />
            </svg>
            <div style={css("display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:#0E1219;border:1px solid rgba(255,255,255,.08);")}>
              <span style={css("width:8px;height:8px;border-radius:50%;background:#2FD27A;animation:livePulse 1.6s infinite;")} />
              <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:12px;color:#C7D0DC;")}>{v.counts.online}/{v.counts.total} PODS ONLINE</span>
            </div>
          </div>
          <div style={css("display:flex;flex-direction:column;gap:11px;")}>
            <div style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.2em;font-size:11px;color:#6B7689;text-align:center;")}>RIGHT BAY</div>
            {v.rightPods.map((p) => (
              <PodMapTile key={p.id} p={p} />
            ))}
          </div>
        </div>
      )}

      {/* ===== Sticky build bar ===== */}
      {v.hasBuild && (
        <div style={css("position:sticky;bottom:16px;z-index:45;display:flex;align-items:center;gap:12px;padding:12px 14px 12px 18px;border-radius:16px;background:#10151D;border:1px solid rgba(47,210,122,.5);box-shadow:0 16px 44px rgba(0,0,0,.6);animation:popIn .3s ease both;margin:10px 0 24px;")}>
          <span style={css("display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:38px;padding:0 10px;border-radius:10px;background:rgba(47,210,122,.16);color:#2FD27A;font-family:'Saira Condensed';font-weight:800;font-size:18px;flex:none;")}>{v.buildCount}</span>
          <span style={css("display:flex;flex-direction:column;min-width:0;")}>
            <span style={css("font-family:'Saira Condensed';font-weight:800;letter-spacing:.04em;font-size:15px;color:#F2F5F9;line-height:1.1;white-space:nowrap;")}>Building a race</span>
            <span style={css("font-size:11.5px;color:#8A95A6;white-space:nowrap;")}>{v.buildCount} of {v.buildUnlockedTotal} unlocked pods added · tap CREATE RACE when ready</span>
          </span>
          <span style={css("flex:1;")} />
          <Hover
            as="button"
            onClick={v.onBuildClear}
            title="Clear race build"
            style={css("height:44px;padding:0 16px;border-radius:11px;border:1px solid rgba(255,255,255,.14);background:#141A24;color:#C7D0DC;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:13px;cursor:pointer;flex:none;")}
            hoverStyle={css("border-color:rgba(255,59,92,.45);color:#FF6B82;")}
          >
            CLEAR
          </Hover>
          <button
            onClick={v.onBuildCreate}
            title="Continue to race setup"
            style={css("height:44px;padding:0 20px;border-radius:11px;border:0;background:linear-gradient(135deg,#2FD27A,#16A85B);color:#04140B;font-family:'Saira Condensed';font-weight:800;letter-spacing:.06em;font-size:14px;cursor:pointer;flex:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 8px 22px rgba(47,210,122,.3);")}
          >
            CREATE RACE<ArrowRight w={17} h={17} sw={2.4} />
          </button>
        </div>
      )}

      {/* ===== LIVE POD STATUS divider ===== */}
      <div style={css("display:flex;align-items:center;gap:13px;margin:34px 0 18px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:14px;color:#C7D0DC;")}>
        <span style={css("width:8px;height:8px;border-radius:50%;background:#2BA6FF;flex:none;")} />
        <span style={css("flex:none;")}>LIVE POD STATUS</span>
        <span style={css("flex:1;height:2px;border-radius:2px;background:#2BA6FF;")} />
      </div>

      {/* ===== RACE SETUP header ===== */}
      <div style={css("display:flex;align-items:center;gap:11px;margin-bottom:14px;")}>
        <span style={css("display:inline-flex;width:34px;height:34px;border-radius:10px;align-items:center;justify-content:center;background:rgba(225,18,51,.14);color:#FF6B82;flex:none;")}>
          <Flag w={18} h={18} />
        </span>
        <div style={css("flex:1;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:20px;letter-spacing:.04em;line-height:1;")}>RACE SETUP</div>
          <div style={css("color:#8A95A6;font-size:13px;margin-top:3px;")}>Pick a session package to start building a race</div>
        </div>
      </div>

      <div style={css("margin-bottom:30px;")}>
        <PackageGrid v={v} minmax="228px" />
      </div>
    </div>
  );
}
