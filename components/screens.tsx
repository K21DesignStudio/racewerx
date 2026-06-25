"use client";

import React from "react";
import { css } from "./css";
import { Hover } from "./Hover";
import {
  ArrowRight,
  Check,
  ChevLeft,
  Cycle,
  ExpandArrows,
  Flag,
  LockClosed,
  LockOpen,
  ListLines,
  Plus,
} from "./Icons";
import { PodManageCard } from "./PodManageCard";
import { PackageGrid } from "./PackageGrid";
import type { Vals } from "@/state/useVals";

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={css("display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:#141A24;color:#F2F5F9;cursor:pointer;flex:none;")}
    >
      <ChevLeft w={22} h={22} />
    </button>
  );
}

function PkgChip({ label }: { label: string }) {
  return (
    <span style={css("display:inline-flex;align-items:center;gap:9px;padding:9px 16px;border-radius:999px;background:rgba(43,166,255,.1);border:1px solid rgba(43,166,255,.3);font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:14px;color:#5BC0FF;")}>
      <Flag w={16} h={16} sw={2.2} />
      {label}
    </span>
  );
}

/* ============================ SIM LOCK ============================ */
export function SimLockScreen({ v }: { v: Vals }) {
  return (
    <div style={css("animation:popIn .4s ease both;")}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-bottom:24px;")}>
        <Back onClick={v.onBack} />
        <div style={css("flex:1;min-width:180px;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:clamp(26px,3.4vw,38px);line-height:1;")}>SIM LOCK MODE</div>
          <div style={css("color:#8A95A6;font-size:14px;margin-top:5px;")}>{v.counts.online} of {v.counts.total} pods connected</div>
        </div>
        <div style={css("display:flex;gap:10px;flex-wrap:wrap;")}>
          <button
            onClick={v.onLockAll}
            style={css("display:inline-flex;align-items:center;gap:9px;height:48px;padding:0 20px;border-radius:12px;border:1px solid rgba(255,59,92,.4);background:rgba(255,59,92,.08);color:#FF6B82;font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:15px;cursor:pointer;")}
          >
            <LockClosed w={18} h={18} sw={2.2} />LOCK ALL
          </button>
          <button
            onClick={v.onUnlockAll}
            style={css("display:inline-flex;align-items:center;gap:9px;height:48px;padding:0 22px;border-radius:12px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:15px;cursor:pointer;box-shadow:0 6px 20px rgba(43,166,255,.3);")}
          >
            <LockOpen w={18} h={18} sw={2.2} />UNLOCK ALL
          </button>
        </div>
      </div>
      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(262px,1fr));gap:16px;")}>
        {v.pods.map((p) => (
          <PodManageCard key={p.id} p={p} showBuild={false} />
        ))}
      </div>
    </div>
  );
}

/* ============================ RACE SETUP ============================ */
export function RaceSetupScreen({ v }: { v: Vals }) {
  return (
    <div style={css("animation:popIn .4s ease both;")}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-bottom:26px;")}>
        <Back onClick={v.onBack} />
        <div style={css("flex:1;min-width:180px;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:clamp(26px,3.4vw,38px);line-height:1;")}>RACE SETUP</div>
          <div style={css("color:#8A95A6;font-size:14px;margin-top:5px;")}>Choose a session package to begin</div>
        </div>
      </div>
      <PackageGrid v={v} minmax="232px" />
    </div>
  );
}

/* ============================ RACE SELECT ============================ */
export function RaceSelectScreen({ v }: { v: Vals }) {
  return (
    <div style={css("animation:popIn .4s ease both;")}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-bottom:18px;")}>
        <Back onClick={v.onBack} />
        <div style={css("flex:1;min-width:180px;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:clamp(26px,3.4vw,38px);line-height:1;")}>SELECT RACE</div>
          <div style={css("color:#8A95A6;font-size:14px;margin-top:5px;")}>Pre-built race packages · car, circuit &amp; assists ready to load</div>
        </div>
        <PkgChip label={v.pkgName} />
      </div>

      {/* session rules bar */}
      <div style={css("display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin-bottom:20px;padding:13px 18px;background:#0E1219;border:1px solid rgba(255,255,255,.07);border-radius:14px;")}>
        <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.16em;font-size:11px;color:#6B7689;margin-right:4px;")}>SESSION RULES</span>
        {v.aidChips.map((a) => (
          <Hover
            key={a.key}
            as="button"
            onClick={a.onCycle}
            style={css("display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:7px;background:#141A24;border:1px solid rgba(255,255,255,.1);cursor:pointer;font-family:'Saira Condensed';font-weight:700;letter-spacing:.05em;font-size:11.5px;color:#9FB0C4;")}
            hoverStyle={css("border-color:rgba(43,166,255,.5);background:#19222e;")}
          >
            {a.label}&nbsp;·&nbsp;<span style={css(`color:${a.color};`)}>{a.val}</span>
            <Cycle w={11} h={11} />
          </Hover>
        ))}
        <button
          onClick={v.onRulesExpand}
          style={css("margin-left:auto;display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:8px;border:1px solid rgba(43,166,255,.4);background:rgba(43,166,255,.08);color:#5BC0FF;cursor:pointer;font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:11px;")}
        >
          <ExpandArrows w={13} h={13} />EXPAND
        </button>
      </div>

      {/* race cards */}
      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(282px,1fr));gap:16px;")}>
        {v.raceList.map((r) => (
          <Hover
            key={r.key}
            as="button"
            onClick={r.onSelect}
            style={css("position:relative;text-align:left;cursor:pointer;border:1px solid rgba(255,255,255,.09);border-radius:18px;overflow:hidden;background:#0E1219;color:#F2F5F9;display:flex;flex-direction:column;min-height:248px;")}
            hoverStyle={css("border-color:rgba(255,255,255,.2);")}
          >
            {r.isSelected && (
              <>
                <span style={css("position:absolute;inset:0;border:2px solid #2BA6FF;border-radius:18px;box-shadow:0 0 0 4px rgba(43,166,255,.14);pointer-events:none;z-index:2;")} />
                <span style={css("position:absolute;top:13px;right:13px;z-index:3;width:28px;height:28px;border-radius:50%;background:#2BA6FF;color:#04101D;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(43,166,255,.5);font-family:'Saira Condensed';font-weight:800;font-size:16px;")}>{r.order}</span>
              </>
            )}
            <div style={css(`height:5px;background:${r.color};`)} />
            <div style={css("position:relative;height:132px;background:radial-gradient(130% 150% at 50% 0%,#10161f,#090d13);overflow:hidden;border-bottom:1px solid rgba(255,255,255,.06);")}>
              <svg viewBox="0 0 120 70" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={css("position:absolute;inset:0;padding:16px 22px;box-sizing:border-box;")}>
                <path d={r.map} fill={r.color} opacity="0.07" />
                <path d={r.map} fill="none" stroke={r.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
              </svg>
              <div style={css("position:absolute;left:50%;bottom:13px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:5px;")}>
                <div style={css(`position:relative;width:17px;height:27px;filter:drop-shadow(0 0 7px ${r.color});`)}>
                  <div style={css(`position:absolute;left:1px;right:1px;top:0;height:3px;border-radius:1px;background:${r.color};`)} />
                  <div style={css(`position:absolute;left:3.5px;right:3.5px;top:2px;bottom:3px;border-radius:5px;background:${r.color};`)} />
                  <div style={css("position:absolute;left:5.5px;right:5.5px;top:9px;height:7px;border-radius:3px;background:#0A0E14;")} />
                  <div style={css(`position:absolute;left:1px;right:1px;bottom:0;height:3px;border-radius:1px;background:${r.color};`)} />
                </div>
                <div style={css("width:30px;height:6px;border-radius:1px;background:repeating-linear-gradient(90deg,#e9edf3 0 3px,#0a0e14 3px 6px);opacity:.85;")} />
              </div>
              <span style={css("position:absolute;top:11px;left:16px;display:inline-flex;align-items:baseline;gap:7px;")}>
                <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.2em;font-size:10px;color:#6B7689;")}>RACE</span>
                <span style={css(`font-family:'Saira Condensed';font-weight:800;font-size:22px;line-height:1;color:${r.color};`)}>{r.n}</span>
              </span>
              <span style={css("position:absolute;top:13px;right:16px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:10px;color:#C7D0DC;background:rgba(255,255,255,.07);padding:4px 8px;border-radius:5px;")}>{r.cls}</span>
              <span style={css("position:absolute;bottom:11px;left:16px;font-family:'Saira Condensed';font-weight:600;letter-spacing:.1em;font-size:10px;color:#8A95A6;")}>{r.loc}</span>
              <span style={css("position:absolute;bottom:11px;right:16px;font-family:'Saira Condensed';font-weight:600;letter-spacing:.06em;font-size:10px;color:#8A95A6;")}>{r.len} · {r.turns}</span>
            </div>
            <div style={css("padding:18px 20px;display:flex;flex-direction:column;gap:12px;flex:1;")}>
              <div>
                <div style={css("font-size:11px;font-weight:600;letter-spacing:.2em;color:#6B7689;margin-bottom:4px;")}>CAR</div>
                <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:24px;line-height:1.05;")}>{r.car}</div>
              </div>
              <div style={css("border-top:1px solid rgba(255,255,255,.07);padding-top:11px;")}>
                <div style={css("font-size:11px;font-weight:600;letter-spacing:.2em;color:#6B7689;margin-bottom:4px;")}>CIRCUIT</div>
                <div style={css("font-family:'Saira Condensed';font-weight:700;font-size:18px;line-height:1.1;")}>{r.track}</div>
              </div>
              <div style={css("margin-top:auto;display:flex;align-items:center;justify-content:flex-end;padding-top:4px;")}>
                {r.isSelected ? (
                  <span style={css("display:inline-flex;align-items:center;gap:7px;color:#2BA6FF;font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:14px;")}>
                    <Check w={16} h={16} />RACE {r.order} ADDED
                  </span>
                ) : (
                  <span style={css(`display:inline-flex;align-items:center;gap:7px;color:${r.color};font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:14px;`)}>
                    ADD RACE<Plus w={17} h={17} />
                  </span>
                )}
              </div>
            </div>
          </Hover>
        ))}
      </div>

      {/* quick combos */}
      <div style={css("margin-top:18px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:16px 18px;background:#0B0F15;border:1px solid rgba(255,255,255,.07);border-radius:14px;")}>
        <div style={css("display:flex;align-items:center;gap:9px;margin-right:4px;")}>
          <span style={css("display:inline-flex;width:30px;height:30px;border-radius:9px;align-items:center;justify-content:center;background:rgba(43,166,255,.14);color:#5BC0FF;flex:none;")}>
            <ListLines w={16} h={16} />
          </span>
          <div>
            <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:13px;letter-spacing:.1em;color:#C7D0DC;")}>QUICK COMBOS</div>
            <div style={css("font-size:11px;color:#6B7689;")}>Preset race line-ups — loaded in order</div>
          </div>
        </div>
        <div style={css("display:flex;flex-wrap:wrap;gap:10px;margin-left:auto;")}>
          {v.combos.map((cb) => (
            <Hover
              key={cb.n}
              as="button"
              onClick={cb.onPick}
              style={css("display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 14px;border-radius:11px;border:1px solid rgba(43,166,255,.3);background:rgba(43,166,255,.07);color:#F2F5F9;text-align:left;")}
              hoverStyle={css("border-color:rgba(43,166,255,.6);background:rgba(43,166,255,.12);")}
            >
              <span style={css("display:inline-flex;width:26px;height:26px;border-radius:50%;align-items:center;justify-content:center;background:#2BA6FF;color:#04101D;font-family:'Saira Condensed';font-weight:800;font-size:14px;flex:none;")}>{cb.n}</span>
              <span style={css("display:flex;flex-direction:column;")}>
                <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.04em;font-size:13px;")}>{cb.label}</span>
                <span style={css("font-size:11px;color:#8A95A6;")}>{cb.desc}</span>
              </span>
            </Hover>
          ))}
        </div>
      </div>

      {/* continue bar */}
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-top:24px;padding:18px 22px;background:#0E1219;border:1px solid rgba(255,255,255,.08);border-radius:16px;")}>
        <div style={css("display:flex;align-items:center;gap:13px;")}>
          <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:36px;line-height:1;color:#2BA6FF;min-width:34px;text-align:center;")}>{v.raceSelCount}</span>
          <span style={css("color:#8A95A6;font-size:14px;line-height:1.4;")}>races queued for<br /><b style={css("color:#F2F5F9;")}>{v.pkgName}</b></span>
        </div>
        {v.hasRaceSel ? (
          <button
            onClick={v.onRacesContinue}
            style={css("display:inline-flex;align-items:center;gap:10px;height:56px;padding:0 28px;border-radius:13px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:17px;cursor:pointer;box-shadow:0 8px 24px rgba(43,166,255,.3);")}
          >
            CONTINUE TO PODS<ArrowRight w={20} h={20} sw={2.4} />
          </button>
        ) : (
          <button
            disabled
            style={css("display:inline-flex;align-items:center;gap:10px;height:56px;padding:0 28px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:#141A24;color:#5A6475;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:17px;cursor:not-allowed;")}
          >
            SELECT AT LEAST ONE RACE
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================ POD SELECTION ============================ */
export function PodsScreen({ v }: { v: Vals }) {
  return (
    <div style={css("animation:popIn .4s ease both;")}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-bottom:24px;")}>
        <Back onClick={v.onBack} />
        <div style={css("flex:1;min-width:180px;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:clamp(26px,3.4vw,38px);line-height:1;")}>SELECT SIM PODS</div>
          <div style={css("color:#8A95A6;font-size:14px;margin-top:5px;")}>Tap the pods joining this race</div>
        </div>
        <div style={css("display:flex;flex-wrap:wrap;gap:9px;")}>
          <PkgChip label={v.pkgName} />
          <span style={css("display:inline-flex;align-items:center;gap:9px;padding:9px 16px;border-radius:999px;background:#141A24;border:1px solid rgba(255,255,255,.1);font-family:'Saira Condensed';font-weight:700;letter-spacing:.04em;font-size:14px;color:#C7D0DC;")}>{v.raceCar} · {v.raceTrack}</span>
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;")}>
        {v.pods.map((p) => {
          if (p.isSelected) {
            return (
              <button
                key={p.id}
                onClick={p.onSelect}
                style={css("position:relative;cursor:pointer;text-align:center;border:2px solid #2BA6FF;border-radius:18px;padding:26px 14px;background:linear-gradient(160deg,rgba(43,166,255,.22),rgba(43,166,255,.05));color:#fff;box-shadow:0 0 0 4px rgba(43,166,255,.14),0 12px 32px rgba(43,166,255,.2);min-height:158px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;")}
              >
                <span style={css("position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:50%;background:#2BA6FF;color:#04101D;display:flex;align-items:center;justify-content:center;")}>
                  <Check w={16} h={16} />
                </span>
                <span style={css("font-size:11px;letter-spacing:.24em;color:#9FD4FF;")}>POD</span>
                <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:54px;line-height:1;")}>{p.num}</span>
                <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.12em;font-size:13px;color:#5BC0FF;")}>SELECTED</span>
              </button>
            );
          }
          if (p.notSelected) {
            return (
              <button
                key={p.id}
                onClick={p.onSelect}
                style={css("cursor:pointer;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:26px 14px;background:#141A24;color:#F2F5F9;min-height:158px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;")}
              >
                <span style={css("font-size:11px;letter-spacing:.24em;color:#6B7689;")}>POD</span>
                <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:54px;line-height:1;")}>{p.num}</span>
                <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.12em;font-size:13px;color:${p.color};`)}>{p.label}</span>
              </button>
            );
          }
          return (
            <div
              key={p.id}
              style={css("text-align:center;border:1px dashed rgba(255,255,255,.1);border-radius:18px;padding:26px 14px;background:rgba(20,26,36,.45);min-height:158px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;opacity:.65;")}
            >
              <span style={css("font-size:11px;letter-spacing:.24em;color:#5A6475;")}>POD</span>
              <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:54px;line-height:1;color:#5A6475;")}>{p.num}</span>
              <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:12px;color:${p.color};`)}>{p.label}</span>
            </div>
          );
        })}
      </div>

      <div style={css("display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-top:24px;padding:18px 22px;background:#0E1219;border:1px solid rgba(255,255,255,.08);border-radius:16px;")}>
        <div style={css("display:flex;align-items:center;gap:13px;")}>
          <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:36px;line-height:1;color:#2BA6FF;min-width:34px;text-align:center;")}>{v.selCount}</span>
          <span style={css("color:#8A95A6;font-size:14px;line-height:1.4;")}>pods selected for<br /><b style={css("color:#F2F5F9;")}>{v.pkgName}</b></span>
        </div>
        {v.hasSel ? (
          <button
            onClick={v.onSubmit}
            style={css("display:inline-flex;align-items:center;gap:10px;height:56px;padding:0 28px;border-radius:13px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:17px;cursor:pointer;box-shadow:0 8px 24px rgba(43,166,255,.3);")}
          >
            SUBMIT RACE SETUP<ArrowRight w={20} h={20} sw={2.4} />
          </button>
        ) : (
          <button
            disabled
            style={css("display:inline-flex;align-items:center;gap:10px;height:56px;padding:0 28px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:#141A24;color:#5A6475;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:17px;cursor:not-allowed;")}
          >
            SELECT AT LEAST ONE POD
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================ LOBBY ============================ */
function AidRow({
  label,
  val,
  color,
  onClick,
}: {
  label: string;
  val: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <Hover
      as="button"
      onClick={onClick}
      title={"Tap to change " + label.toLowerCase()}
      style={css("display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:0;cursor:pointer;color:inherit;text-align:left;padding:5px 8px;margin:0 -8px;border-radius:8px;")}
      hoverStyle={css("background:rgba(255,255,255,.04);")}
    >
      <span style={css("color:#8A95A6;font-size:13px;")}>{label}</span>
      <span style={css(`display:inline-flex;align-items:center;gap:6px;font-family:'Saira Condensed';font-weight:700;font-size:14px;color:${color};letter-spacing:.04em;`)}>
        {val}
        <Cycle w={11} h={11} />
      </span>
    </Hover>
  );
}

export function LobbyScreen({ v }: { v: Vals }) {
  return (
    <div style={css("animation:popIn .4s ease both;")}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-bottom:24px;")}>
        <Back onClick={v.onBack} />
        <div style={css("flex:1;min-width:180px;")}>
          <div style={css("display:flex;align-items:center;gap:11px;font-family:'Saira Condensed';font-weight:600;letter-spacing:.3em;font-size:12px;color:#2BA6FF;")}>
            <span style={css("width:8px;height:8px;border-radius:50%;background:#2FD27A;animation:livePulse 1.4s infinite;")} />HOSTING ON PROJECT CARS 2
          </div>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:clamp(26px,3.4vw,38px);line-height:1;margin-top:8px;")}>CREATING RACE LOBBY</div>
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;align-items:start;")}>
        {/* race card */}
        <div style={css("background:#0E1219;border:1px solid rgba(255,255,255,.08);border-radius:18px;overflow:hidden;")}>
          <div style={css(`height:5px;background:${v.raceColor};`)} />
          <div style={css("padding:22px;display:flex;flex-direction:column;gap:16px;")}>
            <div style={css("display:flex;align-items:center;justify-content:space-between;")}>
              <span style={css("display:inline-flex;align-items:baseline;gap:9px;")}>
                <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.2em;font-size:12px;color:#6B7689;")}>RACE</span>
                <span style={css(`font-family:'Saira Condensed';font-weight:800;font-size:26px;line-height:1;color:${v.raceColor};`)}>{v.raceN}</span>
              </span>
              <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:11px;color:#C7D0DC;background:rgba(255,255,255,.06);padding:5px 10px;border-radius:6px;")}>{v.raceCls}</span>
            </div>
            <div>
              <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:24px;line-height:1.05;")}>{v.raceCar}</div>
              <div style={css("color:#9FB0C4;font-size:15px;margin-top:5px;")}>{v.raceTrack} · {v.raceLoc}</div>
            </div>
            <div style={css("display:flex;flex-direction:column;gap:9px;border-top:1px solid rgba(255,255,255,.07);padding-top:15px;")}>
              <AidRow label="Driving aids" val={v.aidDrive} color={v.aidDriveColor} onClick={v.onCycleDrive} />
              <AidRow label="Gearbox" val={v.aidGear} color={v.aidGearColor} onClick={v.onCycleGear} />
              <AidRow label="Braking assist" val={v.aidBrake} color={v.aidBrakeColor} onClick={v.onCycleBrake} />
              <AidRow label="Steering assist" val={v.aidSteer} color={v.aidSteerColor} onClick={v.onCycleSteer} />
            </div>
          </div>
        </div>

        {/* session status */}
        <div style={css("background:#0E1219;border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:16px;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:13px;color:#C7D0DC;")}>SESSION STATUS</div>
          {v.lobbySteps.map((st) => (
            <div key={st.idx} style={css("display:flex;gap:14px;align-items:flex-start;")}>
              {st.stDone && (
                <span style={css("width:27px;height:27px;border-radius:50%;background:#2FD27A;color:#04140B;display:flex;align-items:center;justify-content:center;flex:none;")}>
                  <Check w={15} h={15} />
                </span>
              )}
              {st.stActive && (
                <span style={css("display:block;width:27px;height:27px;border-radius:50%;border:2.5px solid rgba(43,166,255,.25);border-top-color:#2BA6FF;animation:spin .8s linear infinite;flex:none;")} />
              )}
              {st.stPend && (
                <span style={css("width:27px;height:27px;border-radius:50%;border:1px solid rgba(255,255,255,.14);color:#6B7689;display:flex;align-items:center;justify-content:center;flex:none;font-family:'Saira Condensed';font-weight:700;font-size:13px;")}>{st.idx}</span>
              )}
              <div style={css("flex:1;")}>
                <div style={css("font-family:'Saira Condensed';font-weight:700;font-size:17px;line-height:1.1;")}>{st.title}</div>
                <div style={css("color:#8A95A6;font-size:13px;margin-top:3px;")}>{st.subTxt}</div>
              </div>
            </div>
          ))}

          <div style={css("display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid rgba(255,255,255,.07);padding-top:16px;")}>
            {v.joinChips.map((c, i) =>
              c.on ? (
                <span key={i} style={css("display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:9px;background:rgba(47,210,122,.12);border:1px solid rgba(47,210,122,.3);font-family:'Saira Condensed';font-weight:700;font-size:12px;letter-spacing:.05em;color:#2FD27A;")}>
                  <Check w={12} h={12} sw={3.2} />POD {c.num}
                </span>
              ) : (
                <span key={i} style={css("display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:9px;background:#141A24;border:1px solid rgba(255,255,255,.08);font-family:'Saira Condensed';font-weight:700;font-size:12px;letter-spacing:.05em;color:#6B7689;")}>
                  <span style={css("width:11px;height:11px;border-radius:50%;border:2px solid rgba(255,255,255,.2);border-top-color:#8A95A6;animation:spin .8s linear infinite;")} />POD {c.num}
                </span>
              )
            )}
          </div>

          {v.lobbyReady ? (
            <button
              onClick={v.onProceed}
              style={css("height:60px;border:0;border-radius:14px;background:linear-gradient(135deg,#2FD27A,#16A85B);color:#04140B;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:18px;cursor:pointer;box-shadow:0 10px 28px rgba(47,210,122,.3);display:inline-flex;align-items:center;justify-content:center;gap:11px;animation:popIn .3s ease both;")}
            >
              PROCEED TO GRID<ArrowRight w={22} h={22} sw={2.4} />
            </button>
          ) : (
            <div style={css("height:60px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#141A24;color:#8A95A6;display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:15px;")}>
              <span style={css("width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(255,255,255,.18);border-top-color:#8A95A6;animation:spin .8s linear infinite;")} />SYNCHRONISING SESSION…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================ RACE READY ============================ */
function ReadyBadge({
  label,
  val,
  color,
  onClick,
}: {
  label: string;
  val: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <Hover
      as="button"
      onClick={onClick}
      title={"Tap to change " + label.toLowerCase()}
      style={css("display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:#141A24;border:1px solid rgba(255,255,255,.08);font-family:'Saira Condensed';font-weight:700;letter-spacing:.05em;font-size:12px;color:#9FB0C4;cursor:pointer;")}
      hoverStyle={css("border-color:rgba(43,166,255,.45);")}
    >
      {label}&nbsp;·&nbsp;<span style={css(`color:${color};`)}>{val}</span>
      <Cycle w={10} h={10} sw={2.6} />
    </Hover>
  );
}

export function RaceReadyScreen({ v }: { v: Vals }) {
  return (
    <div style={css("animation:popIn .4s ease both;display:flex;flex-direction:column;align-items:center;text-align:center;padding:clamp(16px,4vw,52px) 0;")}>
      <div style={css("width:88px;height:88px;border-radius:50%;background:linear-gradient(160deg,#2FD27A,#16A85B);display:flex;align-items:center;justify-content:center;color:#04140B;animation:ringPulse 1.8s infinite;")}>
        <Check w={44} h={44} />
      </div>
      <div style={css("font-family:'Saira Condensed';font-weight:600;letter-spacing:.34em;font-size:14px;color:#2FD27A;margin-top:26px;")}>RACE READY</div>
      <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:clamp(38px,6.6vw,64px);line-height:1;margin-top:10px;")}>{v.pkgName}</div>
      <div style={css("font-family:'Saira Condensed';font-weight:700;font-size:clamp(18px,2.8vw,26px);color:#C7D0DC;margin-top:14px;")}>{v.raceCar} · {v.raceTrack}</div>
      <div style={css("display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:16px;")}>
        <ReadyBadge label="AIDS" val={v.aidDrive} color={v.aidDriveColor} onClick={v.onCycleDrive} />
        <ReadyBadge label="GEARBOX" val={v.aidGear} color={v.aidGearColor} onClick={v.onCycleGear} />
        <ReadyBadge label="BRAKING" val={v.aidBrake} color={v.aidBrakeColor} onClick={v.onCycleBrake} />
        <ReadyBadge label="STEERING" val={v.aidSteer} color={v.aidSteerColor} onClick={v.onCycleSteer} />
      </div>
      <div style={css("color:#C7D0DC;font-size:clamp(16px,2.4vw,20px);margin-top:18px;max-width:560px;")}>Pods <b style={css("color:#fff;")}>{v.selLabel}</b> are entered and ready to start.</div>

      <div style={css("width:min(680px,100%);margin-top:38px;display:flex;flex-direction:column;gap:14px;")}>
        <button
          onClick={v.onStart}
          style={css("height:68px;border:0;border-radius:16px;background:linear-gradient(135deg,#2FD27A,#16A85B);color:#04140B;font-family:'Saira Condensed';font-weight:800;letter-spacing:.1em;font-size:22px;cursor:pointer;box-shadow:0 12px 32px rgba(47,210,122,.3);display:inline-flex;align-items:center;justify-content:center;gap:13px;")}
        >
          <Flag w={26} h={26} sw={2.3} />START RACE
        </button>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:12px;")}>
          <button onClick={v.onEdit} style={css("height:54px;border-radius:13px;border:1px solid rgba(43,166,255,.4);background:rgba(43,166,255,.08);color:#5BC0FF;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:15px;cursor:pointer;")}>EDIT PODS</button>
          <button onClick={v.onCancel} style={css("height:54px;border-radius:13px;border:1px solid rgba(255,59,92,.4);background:rgba(255,59,92,.07);color:#FF6B82;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:15px;cursor:pointer;")}>CANCEL SETUP</button>
          <button onClick={v.onHome} style={css("height:54px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:15px;cursor:pointer;")}>BACK TO DASHBOARD</button>
        </div>
      </div>
    </div>
  );
}
