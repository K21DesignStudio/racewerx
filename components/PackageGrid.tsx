"use client";

import React from "react";
import { css } from "./css";
import { Hover } from "./Hover";
import { ArrowRight, Plus, Voucher } from "./Icons";
import type { Vals } from "@/state/useVals";

interface PricedProps {
  onClick: () => void;
  border: string;
  hoverBorder: string;
  bg?: string;
  topBar: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  meta: string;
  title: string;
  price: string;
  unit: string;
  selectColor: string;
}

function Priced(p: PricedProps) {
  return (
    <Hover
      as="button"
      onClick={p.onClick}
      style={css(`text-align:left;cursor:pointer;border:1px solid ${p.border};border-radius:16px;overflow:hidden;background:${p.bg || "#0E1219"};color:#F2F5F9;display:flex;flex-direction:column;`)}
      hoverStyle={css(`border-color:${p.hoverBorder};`)}
    >
      <div style={css(`height:4px;background:${p.topBar};`)} />
      <div style={css("padding:18px;display:flex;flex-direction:column;gap:11px;")}>
        <div style={css("display:flex;align-items:center;justify-content:space-between;")}>
          <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.16em;font-size:11px;color:${p.tagColor};background:${p.tagBg};padding:4px 9px;border-radius:6px;`)}>{p.tag}</span>
          <span style={css("font-family:'Saira Condensed';font-weight:600;letter-spacing:.1em;font-size:11px;color:#8A95A6;")}>{p.meta}</span>
        </div>
        <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:22px;line-height:1.05;")}>{p.title}</div>
        <div style={css("display:flex;align-items:center;justify-content:space-between;padding-top:2px;")}>
          <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:19px;")}>
            {p.price}
            <span style={css("font-size:12px;color:#8A95A6;font-weight:600;")}> {p.unit}</span>
          </span>
          <span style={css(`display:inline-flex;align-items:center;gap:6px;color:${p.selectColor};font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:13px;`)}>
            SELECT
            <ArrowRight w={15} h={15} />
          </span>
        </div>
      </div>
    </Hover>
  );
}

export function PackageGrid({ v, minmax }: { v: Vals; minmax: string }) {
  return (
    <div style={css(`display:grid;grid-template-columns:repeat(auto-fit,minmax(${minmax},1fr));gap:14px;`)}>
      <Priced
        onClick={v.selX3}
        border="rgba(43,166,255,.22)"
        hoverBorder="rgba(43,166,255,.5)"
        topBar="linear-gradient(90deg,#2BA6FF,#1E7FE0)"
        tag="SPRINT"
        tagColor="#5BC0FF"
        tagBg="rgba(43,166,255,.12)"
        meta="3 RACES"
        title="x3 Race Session"
        price="£15"
        unit="/ driver"
        selectColor="#2BA6FF"
      />
      <Priced
        onClick={v.selX5}
        border="rgba(43,166,255,.22)"
        hoverBorder="rgba(43,166,255,.5)"
        topBar="linear-gradient(90deg,#5BC0FF,#2BA6FF)"
        tag="GRAND PRIX"
        tagColor="#5BC0FF"
        tagBg="rgba(43,166,255,.12)"
        meta="4 RACES"
        title="x4 Race Session"
        price="£20"
        unit="/ driver"
        selectColor="#2BA6FF"
      />
      <Priced
        onClick={v.selMin30}
        border="rgba(43,166,255,.22)"
        hoverBorder="rgba(43,166,255,.5)"
        topBar="linear-gradient(90deg,#37C8C3,#1E9E9A)"
        tag="OPEN SESSION"
        tagColor="#5FD6D1"
        tagBg="rgba(55,200,195,.13)"
        meta="30 MIN"
        title="30 Minute Package"
        price="£25"
        unit="/ driver"
        selectColor="#37C8C3"
      />
      <Priced
        onClick={v.selMin60}
        border="rgba(43,166,255,.22)"
        hoverBorder="rgba(43,166,255,.5)"
        topBar="linear-gradient(90deg,#5B8DEF,#3563D6)"
        tag="OPEN SESSION"
        tagColor="#8FB0F5"
        tagBg="rgba(91,141,239,.14)"
        meta="60 MIN"
        title="60 Minute Package"
        price="£45"
        unit="/ driver"
        selectColor="#5B8DEF"
      />

      {/* Custom Combo — build-your-own */}
      <Hover
        as="button"
        onClick={v.selCustom}
        style={css("text-align:left;cursor:pointer;border:1.5px dashed rgba(43,166,255,.45);border-radius:16px;overflow:hidden;background:linear-gradient(160deg,rgba(43,166,255,.07),rgba(43,166,255,0) 60%),#0B0F15;color:#F2F5F9;display:flex;flex-direction:column;")}
        hoverStyle={css("border-color:rgba(43,166,255,.85);background:linear-gradient(160deg,rgba(43,166,255,.12),rgba(43,166,255,0) 60%),#0B0F15;")}
      >
        <div style={css("height:4px;background:repeating-linear-gradient(90deg,#2BA6FF 0 8px,transparent 8px 14px);")} />
        <div style={css("padding:18px;display:flex;flex-direction:column;gap:11px;")}>
          <div style={css("display:flex;align-items:center;justify-content:space-between;")}>
            <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.16em;font-size:11px;color:#5BC0FF;background:rgba(43,166,255,.12);padding:4px 9px;border-radius:6px;")}>CUSTOM</span>
            <span style={css("font-family:'Saira Condensed';font-weight:600;letter-spacing:.1em;font-size:11px;color:#8A95A6;")}>BUILD</span>
          </div>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:22px;line-height:1.05;")}>Custom Combo</div>
          <div style={css("display:flex;align-items:center;justify-content:space-between;padding-top:2px;")}>
            <span style={css("display:inline-flex;align-items:center;gap:7px;font-family:'Saira Condensed';font-weight:800;font-size:15px;letter-spacing:.02em;color:#5BC0FF;")}>
              <Plus w={17} h={17} />Pick races
            </span>
            <span style={css("display:inline-flex;align-items:center;gap:6px;color:#2BA6FF;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:13px;")}>
              BUILD<ArrowRight w={15} h={15} />
            </span>
          </div>
        </div>
      </Hover>

      <Priced
        onClick={v.selBronze}
        border="rgba(199,123,60,.3)"
        hoverBorder="rgba(199,123,60,.55)"
        topBar="linear-gradient(90deg,#E0A063,#B5702F)"
        tag="BRONZE · OPEN"
        tagColor="#D49460"
        tagBg="rgba(199,123,60,.14)"
        meta="15 MIN"
        title="Open Bronze Package"
        price="£60"
        unit="/ EB"
        selectColor="#D49460"
      />
      <Priced
        onClick={v.selSilver}
        border="rgba(199,212,228,.24)"
        hoverBorder="rgba(199,212,228,.5)"
        topBar="linear-gradient(90deg,#D7DEE8,#9FB0C4)"
        tag="SILVER · OPEN"
        tagColor="#C7D0DC"
        tagBg="rgba(199,212,228,.12)"
        meta="20 MIN"
        title="Open Silver Package"
        price="£100"
        unit="/ EB"
        selectColor="#C7D0DC"
      />
      <Priced
        onClick={v.selGold}
        border="rgba(255,176,32,.3)"
        hoverBorder="rgba(255,176,32,.55)"
        topBar="linear-gradient(90deg,#FFCD5C,#E0961A)"
        tag="GOLD · OPEN"
        tagColor="#FFC555"
        tagBg="rgba(255,176,32,.13)"
        meta="30 MIN"
        title="Open Gold Package"
        price="£100"
        unit="/ EB"
        selectColor="#FFB020"
      />
      <Priced
        onClick={v.selPlat}
        border="rgba(199,212,228,.28)"
        hoverBorder="rgba(199,212,228,.55)"
        bg="linear-gradient(160deg,rgba(199,212,228,.07),rgba(199,212,228,0) 60%),#0E1219"
        topBar="linear-gradient(90deg,#FF4FA3,#E11473)"
        tag="PLATINUM · PRO"
        tagColor="#E7EDF5"
        tagBg="rgba(199,212,228,.14)"
        meta="60 MIN"
        title="Open Platinum Package"
        price="£200"
        unit="/ EB"
        selectColor="#E7EDF5"
      />

      {/* Voucher Booking — enter code instead of price */}
      <Hover
        as="button"
        onClick={v.selVoucher}
        style={css("text-align:left;cursor:pointer;border:1px solid rgba(159,122,234,.32);border-radius:16px;overflow:hidden;background:linear-gradient(160deg,rgba(159,122,234,.08),rgba(159,122,234,0) 60%),#0E1219;color:#F2F5F9;display:flex;flex-direction:column;")}
        hoverStyle={css("border-color:rgba(159,122,234,.6);")}
      >
        <div style={css("height:4px;background:linear-gradient(90deg,#1E7D4F,#0C5132);")} />
        <div style={css("padding:18px;display:flex;flex-direction:column;gap:11px;")}>
          <div style={css("display:flex;align-items:center;justify-content:space-between;")}>
            <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.16em;font-size:11px;color:#C4AEF5;background:rgba(159,122,234,.14);padding:4px 9px;border-radius:6px;")}>VOUCHER</span>
            <span style={css("font-family:'Saira Condensed';font-weight:600;letter-spacing:.1em;font-size:11px;color:#8A95A6;")}>REDEEM</span>
          </div>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:22px;line-height:1.05;")}>Voucher Booking</div>
          <div style={css("display:flex;align-items:center;justify-content:space-between;padding-top:2px;")}>
            <span style={css("display:inline-flex;align-items:center;gap:7px;font-family:'Saira Condensed';font-weight:800;font-size:15px;letter-spacing:.02em;color:#C4AEF5;")}>
              <Voucher w={16} h={16} />Enter code
            </span>
            <span style={css("display:inline-flex;align-items:center;gap:6px;color:#9F7AEA;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:13px;")}>
              SELECT<ArrowRight w={15} h={15} />
            </span>
          </div>
        </div>
      </Hover>
    </div>
  );
}
