"use client";

import React from "react";
import { css } from "./css";
import { Hover } from "./Hover";
import { EyeOff, LockClosed, LockOpen, Printer } from "./Icons";
import type { Vals } from "@/state/useVals";

function Stat({
  onClick,
  title,
  color,
  children,
}: {
  onClick: () => void;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <Hover
      as="button"
      onClick={onClick}
      title={title}
      style={css(`flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;background:none;border:0;padding:5px 13px;border-radius:9px;color:${color};`)}
      hoverStyle={css("background:#11161f;")}
    >
      {children}
    </Hover>
  );
}

const divider = (
  <span style={css("width:1px;height:26px;background:rgba(255,255,255,.08);")} />
);

export function AppBar({ v }: { v: Vals }) {
  return (
    <div style={css("display:flex;align-items:center;gap:18px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:26px;flex-wrap:wrap;")}>
      {/* Logo — click returns to home */}
      <Hover
        as="div"
        onClick={v.onHome}
        title="Back to home dashboard"
        role="button"
        style={css("display:flex;align-items:center;gap:13px;cursor:pointer;border-radius:11px;transition:opacity .15s;")}
        hoverStyle={css("opacity:.78;")}
      >
        <div
          aria-hidden="true"
          style={css("height:50px;width:50px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#1A2230,#090B10);border:1px solid rgba(255,255,255,.12);font-family:'Saira Condensed';font-weight:800;font-size:18px;letter-spacing:.04em;color:#F2F5F9;box-shadow:inset 0 0 0 1px rgba(43,166,255,.18);")}
        >
          RW
        </div>
        <div style={css("line-height:1;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:23.5px;letter-spacing:.32em;")}>{v.centreName}</div>
          <div style={css("font-size:9px;font-weight:600;letter-spacing:.4em;color:#7A8497;margin-top:5px;")}>RACING&nbsp;SIMULATORS</div>
        </div>
      </Hover>

      {/* Stat strip */}
      <div style={css("display:flex;flex:1;align-items:center;justify-content:space-between;gap:2px;padding:5px;background:#0E1219;border:1px solid rgba(255,255,255,.08);border-radius:13px;")}>
        <Stat onClick={v.onStatOnline} title="Pods online" color="#F2F5F9">
          <span style={css("display:flex;align-items:center;gap:5px;font-family:'Saira Condensed';font-weight:800;font-size:19px;line-height:1;")}>
            <span style={css("width:7px;height:7px;border-radius:50%;background:#2FD27A;animation:livePulse 1.6s infinite;")} />
            {v.counts.online}
            <span style={css("font-size:11px;color:#5A6475;margin-left:2px;")}>/&thinsp;{v.counts.total}</span>
          </span>
          <span style={css("font-size:8.5px;font-weight:600;letter-spacing:.18em;color:#7A8497;")}>ONLINE</span>
        </Stat>
        {divider}
        <Stat onClick={v.onStatInrace} title="Pods in race" color="#2FD27A">
          <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:19px;line-height:1;")}>{v.counts.inrace}</span>
          <span style={css("font-size:8.5px;font-weight:600;letter-spacing:.18em;color:#7A8497;")}>IN RACE</span>
        </Stat>
        {divider}
        <Stat onClick={v.onStatReady} title="Pods ready" color="#FFB020">
          <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:19px;line-height:1;")}>{v.counts.ready}</span>
          <span style={css("font-size:8.5px;font-weight:600;letter-spacing:.18em;color:#7A8497;")}>READY</span>
        </Stat>
        {divider}
        <Stat onClick={v.onStatLocked} title="Pods locked" color="#FF3B5C">
          <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:19px;line-height:1;")}>{v.counts.locked}</span>
          <span style={css("font-size:8.5px;font-weight:600;letter-spacing:.18em;color:#7A8497;")}>LOCKED</span>
        </Stat>
      </div>

      {/* Action bar */}
      <div className="rw-actionbar" style={css("display:flex;align-items:center;gap:14px;flex-wrap:wrap;")}>
        <div className="rw-lockgroup" style={css("display:flex;align-items:center;gap:10px;")}>
          <button
            onClick={v.onLockAll}
            style={css("display:inline-flex;align-items:center;gap:8px;height:56px;padding:0 20px;border-radius:12px;border:1px solid rgba(255,59,92,.5);background:rgba(255,59,92,.1);color:#FF6B82;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:15px;cursor:pointer;")}
          >
            <LockClosed w={17} h={17} sw={2.3} />
            <span className="rw-blabel">LOCK</span>
          </button>
          <button
            onClick={v.onStandbyAll}
            style={css("display:inline-flex;align-items:center;gap:8px;height:56px;padding:0 18px;border-radius:12px;border:1px solid rgba(167,139,250,.42);background:rgba(167,139,250,.1);color:#C4B5FD;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:15px;cursor:pointer;")}
          >
            <EyeOff w={17} h={17} sw={2.2} />
            <span className="rw-blabel">STANDBY</span>
          </button>
          <button
            onClick={v.onUnlockAll}
            style={css("display:inline-flex;align-items:center;gap:8px;height:56px;padding:0 22px;border-radius:12px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:15px;cursor:pointer;box-shadow:0 6px 18px rgba(43,166,255,.3);")}
          >
            <LockOpen w={17} h={17} sw={2.3} />
            <span className="rw-blabel">UNLOCK</span>
          </button>
        </div>
        <div className="rw-clock" style={css("font-family:'Saira Condensed';font-weight:700;font-size:17px;letter-spacing:.06em;color:#C7D0DC;font-variant-numeric:tabular-nums;min-width:84px;text-align:right;")}>{v.clock}</div>
        <Hover
          as="button"
          onClick={v.onPrintReceipt}
          className="rw-receipt"
          title="Print receipt"
          style={css("display:inline-flex;align-items:center;justify-content:center;gap:8px;height:56px;padding:0 17px;border-radius:12px;background:#0E1219;border:1px solid rgba(255,255,255,.1);color:#9FB0C4;cursor:pointer;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:13px;")}
          hoverStyle={css("border-color:rgba(43,166,255,.45);color:#5BC0FF;")}
        >
          <Printer w={17} h={17} />
          <span className="rw-receipt-label">RECEIPT</span>
        </Hover>
        <Hover
          as="button"
          onClick={v.onGetStatus}
          className="rw-avatar"
          title="Get live Sim Lock status"
          style={css("width:56px;height:56px;border-radius:12px;background:linear-gradient(160deg,#1A2230,#11151C);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-family:'Saira Condensed';font-weight:700;font-size:14px;color:#9FB0C4;cursor:pointer;")}
          hoverStyle={css("border-color:rgba(47,210,122,.45);color:#2FD27A;")}
        >
          ST
        </Hover>
      </div>
    </div>
  );
}
