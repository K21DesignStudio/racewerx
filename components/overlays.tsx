"use client";

import React from "react";
import { css } from "./css";
import { Hover } from "./Hover";
import { PerspectiveTrack } from "./SimGraphics";
import {
  Card,
  Check,
  ChevLeft,
  ChevRight,
  Chip,
  Close,
  EyeOff,
  Gamepad,
  LockOpen,
  MenuRules,
  Monitor,
  Printer,
  Reset,
  Target,
} from "./Icons";
import type { Vals } from "@/state/useVals";

/* ============================ PRINT DIALOG ============================ */
export function PrintDialog({ v }: { v: Vals }) {
  if (!v.showPrint) return null;
  return (
    <div onClick={v.onClosePrint} style={css("position:fixed;inset:0;z-index:58;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,6,10,.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:overlayIn .25s ease both;")}>
      <div onClick={v.stop} style={css("width:min(480px,100%);background:#10151D;border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;animation:popIn .3s ease both;")}>
        <div style={css("display:flex;align-items:center;gap:12px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.07);")}>
          <span style={css("display:inline-flex;width:40px;height:40px;border-radius:11px;background:rgba(43,166,255,.16);color:#5BC0FF;align-items:center;justify-content:center;")}>
            <Printer w={22} h={22} />
          </span>
          <div style={css("flex:1;")}>
            <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:21px;letter-spacing:.04em;")}>PRINT</div>
            <div style={css("font-size:12px;color:#8A95A6;")}>Choose what to send to the printer</div>
          </div>
          <button onClick={v.onClosePrint} style={css("display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;cursor:pointer;")}>
            <Close w={18} h={18} />
          </button>
        </div>
        <div style={css("padding:16px 18px 22px;display:flex;flex-direction:column;gap:10px;")}>
          {v.printRows.map((d) => (
            <Hover
              key={d.key}
              as="button"
              onClick={d.onToggle}
              style={css("display:flex;align-items:center;gap:13px;cursor:pointer;text-align:left;padding:14px 16px;border-radius:12px;background:#141A24;border:1px solid rgba(255,255,255,.08);color:#F2F5F9;")}
              hoverStyle={css("border-color:rgba(43,166,255,.4);")}
            >
              {d.on ? (
                <span style={css("display:inline-flex;width:24px;height:24px;border-radius:7px;background:#2BA6FF;color:#04101D;align-items:center;justify-content:center;flex:none;")}>
                  <Check w={15} h={15} />
                </span>
              ) : (
                <span style={css("display:inline-flex;width:24px;height:24px;border-radius:7px;background:transparent;border:1px solid rgba(255,255,255,.2);flex:none;")} />
              )}
              <span style={css("display:flex;flex-direction:column;gap:2px;flex:1;")}>
                <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.04em;font-size:15px;")}>{d.label}</span>
                <span style={css("font-size:12px;color:#8A95A6;")}>{d.sub}</span>
              </span>
            </Hover>
          ))}
          <div style={css("display:grid;grid-template-columns:1fr 1.4fr;gap:12px;margin-top:8px;")}>
            <button onClick={v.onClosePrint} style={css("height:52px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:15px;cursor:pointer;")}>CANCEL</button>
            <button onClick={v.onConfirmPrint} style={css("height:52px;border-radius:13px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.06em;font-size:15px;cursor:pointer;box-shadow:0 8px 22px rgba(43,166,255,.3);display:inline-flex;align-items:center;justify-content:center;gap:8px;")}>
              <Printer w={18} h={18} />PRINT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ UNLOCK MODALS ============================ */
export function UnlockModals({ v }: { v: Vals }) {
  if (!v.showModal) return null;
  return (
    <div onClick={v.onCloseModal} style={css("position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,6,10,.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:overlayIn .25s ease both;")}>
      {v.mUnlockConfirm && (
        <div onClick={v.stop} style={css("width:min(480px,100%);background:#10151D;border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:30px;animation:popIn .3s ease both;")}>
          <div style={css("width:56px;height:56px;border-radius:14px;background:rgba(43,166,255,.14);color:#5BC0FF;display:flex;align-items:center;justify-content:center;margin-bottom:20px;")}>
            <LockOpen w={28} h={28} sw={2} />
          </div>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:28px;line-height:1.05;")}>Unlock all pods?</div>
          <div style={css("color:#9AA6B6;font-size:15px;line-height:1.55;margin-top:12px;")}>This will open all <b style={css("color:#F2F5F9;")}>{v.unlockCount}</b> connected pods for customer use. A till transaction is required before they go live.</div>
          <div style={css("display:grid;grid-template-columns:1fr 1.4fr;gap:12px;margin-top:26px;")}>
            <button onClick={v.onCloseModal} style={css("height:54px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:16px;cursor:pointer;")}>CANCEL</button>
            <button onClick={v.onConfirmUnlock} style={css("height:54px;border-radius:13px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.06em;font-size:16px;cursor:pointer;box-shadow:0 8px 22px rgba(43,166,255,.3);")}>CONTINUE TO TILL</button>
          </div>
        </div>
      )}

      {v.mTill && (
        <div onClick={v.stop} style={css("width:min(520px,100%);background:#10151D;border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;animation:popIn .3s ease both;")}>
          <div style={css("display:flex;align-items:center;gap:12px;padding:20px 26px;background:linear-gradient(90deg,rgba(43,166,255,.14),transparent);border-bottom:1px solid rgba(255,255,255,.08);")}>
            <span style={css("display:inline-flex;width:40px;height:40px;border-radius:11px;background:rgba(43,166,255,.16);color:#5BC0FF;align-items:center;justify-content:center;")}>
              <Card w={22} h={22} />
            </span>
            <div>
              <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:21px;letter-spacing:.04em;")}>TILL TRANSACTION</div>
              <div style={css("font-size:12px;color:#8A95A6;letter-spacing:.04em;")}>Take payment to unlock the pods</div>
            </div>
          </div>
          <div style={css("padding:24px 26px;")}>
            <div style={css("display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07);")}>
              <span style={css("color:#C7D0DC;font-size:15px;")}>{v.unlockCount} × Pod unlock <span style={css("color:#8A95A6;")}>@ {v.perPrice}</span></span>
              <span style={css("font-family:'Saira Condensed';font-weight:700;font-size:17px;")}>{v.total}</span>
            </div>
            <div style={css("display:flex;align-items:center;justify-content:space-between;padding:18px 0 4px;")}>
              <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:14px;color:#8A95A6;")}>TOTAL DUE</span>
              <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:38px;line-height:1;color:#fff;")}>{v.total}</span>
            </div>
            <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:22px;")}>
              <div style={css("height:50px;border-radius:12px;border:1px solid rgba(43,166,255,.5);background:rgba(43,166,255,.1);color:#5BC0FF;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:15px;")}>
                <Card w={18} h={18} sw={2.2} />CARD
              </div>
              <div style={css("height:50px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:#141A24;color:#8A95A6;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:15px;")}>CASH</div>
            </div>
            <div style={css("display:grid;grid-template-columns:1fr 1.5fr;gap:12px;margin-top:22px;")}>
              <button onClick={v.onCloseModal} style={css("height:56px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:16px;cursor:pointer;")}>CANCEL</button>
              <button onClick={v.onConfirmPayment} style={css("height:56px;border-radius:13px;border:0;background:linear-gradient(135deg,#2FD27A,#16A85B);color:#04140B;font-family:'Saira Condensed';font-weight:800;letter-spacing:.06em;font-size:16px;cursor:pointer;box-shadow:0 8px 22px rgba(47,210,122,.3);display:inline-flex;align-items:center;justify-content:center;gap:9px;")}>
                <Check w={20} h={20} sw={2.4} />CONFIRM PAYMENT
              </button>
            </div>
          </div>
        </div>
      )}

      {v.mSuccess && (
        <div onClick={v.stop} style={css("width:min(440px,100%);background:#10151D;border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:36px 30px;text-align:center;animation:popIn .3s ease both;")}>
          <div style={css("width:74px;height:74px;border-radius:50%;background:linear-gradient(160deg,#2FD27A,#16A85B);color:#04140B;display:flex;align-items:center;justify-content:center;margin:0 auto;animation:ringPulse 1.8s infinite;")}>
            <Check w={38} h={38} />
          </div>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:28px;margin-top:22px;")}>All pods unlocked</div>
          <div style={css("color:#9AA6B6;font-size:15px;line-height:1.55;margin-top:10px;")}>All <b style={css("color:#F2F5F9;")}>{v.unlockCount}</b> pods are now open for customer use.</div>
          <button onClick={v.onCloseModal} style={css("width:100%;height:54px;border-radius:13px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.06em;font-size:16px;cursor:pointer;margin-top:26px;box-shadow:0 8px 22px rgba(43,166,255,.3);")}>DONE</button>
        </div>
      )}
    </div>
  );
}

/* ============================ STAT GROUP LIST ============================ */
export function StatModal({ v }: { v: Vals }) {
  if (!v.showStat) return null;
  return (
    <div onClick={v.onStatClose} style={css("position:fixed;inset:0;z-index:52;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,6,10,.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:overlayIn .25s ease both;")}>
      <div onClick={v.stop} style={css("width:min(620px,100%);max-height:88vh;overflow:auto;background:#10151D;border:1px solid rgba(255,255,255,.1);border-radius:20px;animation:popIn .3s ease both;")}>
        <div style={css("display:flex;align-items:center;gap:12px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.07);position:sticky;top:0;background:#10151D;z-index:1;")}>
          <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:22px;letter-spacing:.04em;")}>{v.statTitle}</div>
          <span style={css("font-family:'Saira Condensed';font-weight:700;font-size:14px;color:#5BC0FF;background:rgba(43,166,255,.12);padding:4px 11px;border-radius:999px;")}>{v.statCount}</span>
          <div style={css("flex:1;")} />
          <button onClick={v.onStatClose} style={css("display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;cursor:pointer;")}>
            <Close w={18} h={18} />
          </button>
        </div>
        <div style={css("padding:18px 20px;display:flex;flex-direction:column;gap:10px;")}>
          {v.statEmpty && (
            <div style={css("text-align:center;color:#8A95A6;font-size:14px;padding:30px 0;")}>No pods in this group right now.</div>
          )}
          {v.statList.map((p) => (
            <Hover
              key={p.id}
              as="button"
              onClick={p.onOpen}
              style={css(`text-align:left;cursor:pointer;display:flex;align-items:center;gap:14px;background:#141A24;border:1px solid rgba(255,255,255,.07);border-left:3px solid ${p.color};border-radius:12px;padding:14px 16px;color:#F2F5F9;`)}
              hoverStyle={css("border-color:rgba(255,255,255,.18);background:#171f2b;")}
            >
              <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:26px;line-height:1;min-width:34px;")}>{p.num}</span>
              <span style={css("display:flex;flex-direction:column;gap:4px;min-width:0;flex:1;")}>
                <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:13px;color:${p.color};`)}>{p.label}</span>
                <span style={css("font-size:12px;color:#8A95A6;")}>{p.desc}</span>
              </span>
              <span style={css("display:inline-flex;align-items:center;gap:6px;color:#5A6475;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:12px;flex:none;")}>OPEN<ChevRight w={15} h={15} /></span>
            </Hover>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================ POD EXPAND / SIM VIEW ============================ */
export function ExpandModal({ v }: { v: Vals }) {
  if (!v.showExpand) return null;
  return (
    <div onClick={v.onExpandClose} style={css("position:fixed;inset:0;z-index:56;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,6,10,.8);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);animation:overlayIn .25s ease both;")}>
      <div onClick={v.stop} style={css("width:min(880px,100%);max-height:92vh;overflow:auto;background:#0C1118;border:1px solid rgba(255,255,255,.1);border-radius:22px;animation:popIn .3s ease both;")}>
        <div style={css("display:flex;align-items:center;gap:13px;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07);")}>
          <span style={css("display:inline-flex;align-items:baseline;gap:9px;")}>
            <span style={css("font-size:11px;letter-spacing:.26em;color:#6B7689;font-weight:600;")}>SIM POD</span>
            <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:30px;line-height:1;")}>{v.exNum}</span>
          </span>
          <span style={css(`display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:${v.exSoft};`)}>
            <span style={css(`width:8px;height:8px;border-radius:50%;background:${v.exColor};`)} />
            <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:13px;color:${v.exColor};`)}>{v.exStatus}</span>
          </span>
          <div style={css("flex:1;")} />
          <button onClick={v.onExpandClose} style={css("display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;cursor:pointer;")}>
            <Close w={18} h={18} />
          </button>
        </div>

        {v.exInRace && (
          <div style={css("padding:18px 18px 22px;")}>
            <div style={css("position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.1);")}>
              <PerspectiveTrack variant="screen" />
              {/* HUD top-left */}
              <div style={css("position:absolute;top:12px;left:12px;display:flex;gap:8px;")}>
                <div style={css("background:rgba(8,12,18,.66);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:6px 11px;font-family:'Saira Condensed';font-weight:800;font-size:18px;line-height:1;color:#fff;")}>P{v.telePos}<span style={css("font-size:11px;color:#9FB0C4;font-weight:600;")}>/{v.teleGrid}</span></div>
                <div style={css("background:rgba(8,12,18,.66);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:6px 11px;font-family:'Saira Condensed';font-weight:800;font-size:14px;line-height:1.25;color:#C7D0DC;letter-spacing:.06em;")}>LAP {v.teleLap}/{v.teleLaps}</div>
              </div>
              {/* HUD top-right */}
              <div style={css("position:absolute;top:12px;right:12px;display:flex;flex-direction:column;align-items:flex-end;gap:5px;text-align:right;")}>
                <span style={css("display:inline-flex;align-items:center;gap:6px;background:rgba(225,18,51,.9);border-radius:6px;padding:4px 9px;font-family:'Saira Condensed';font-weight:800;letter-spacing:.14em;font-size:11px;color:#fff;animation:liveBlink 1.4s infinite;")}>
                  <span style={css("width:7px;height:7px;border-radius:50%;background:#fff;")} />LIVE
                </span>
                <span style={css("font-family:'Saira Condensed';font-weight:700;font-size:12px;color:#E7EDF5;")}>{v.exCar}</span>
                <span style={css("font-size:10.5px;color:#9FB0C4;")}>{v.exTrack} · {v.exLoc}</span>
              </div>
              {/* HUD bottom-left lap times */}
              <div style={css("position:absolute;bottom:12px;left:12px;display:flex;flex-direction:column;gap:5px;")}>
                <div style={css("background:rgba(8,12,18,.66);border:1px solid rgba(255,255,255,.12);border-radius:7px;padding:5px 10px;font-family:'Saira Condensed';font-weight:700;font-size:13px;color:#fff;letter-spacing:.04em;")}><span style={css("color:#6B7689;font-size:10px;letter-spacing:.14em;")}>CUR</span> {v.teleLapTime}</div>
                <div style={css("background:rgba(8,12,18,.5);border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:5px 10px;font-family:'Saira Condensed';font-weight:700;font-size:12px;color:#9FB0C4;letter-spacing:.04em;")}><span style={css("color:#6B7689;font-size:10px;letter-spacing:.14em;")}>LAST</span> {v.teleLastLap}</div>
              </div>
              {/* HUD bottom-center speed */}
              <div style={css("position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;")}>
                <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:46px;line-height:.85;color:#fff;font-variant-numeric:tabular-nums;text-shadow:0 2px 12px rgba(0,0,0,.6);")}>{v.teleSpeed}<span style={css("font-size:14px;color:#9FB0C4;font-weight:600;letter-spacing:.06em;")}> KM/H</span></div>
                <div style={css("display:flex;align-items:center;gap:9px;")}>
                  <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:15px;letter-spacing:.06em;color:#FFB020;")}>GEAR {v.teleGear}</span>
                  <span style={css("width:96px;height:6px;border-radius:3px;background:rgba(255,255,255,.16);overflow:hidden;")}>
                    <span style={css(`display:block;height:100%;width:${v.teleRpmPct};background:linear-gradient(90deg,#2FD27A,#FFB020 70%,#FF3B5C);`)} />
                  </span>
                </div>
              </div>
              {/* HUD bottom-right mini map */}
              <div style={css("position:absolute;bottom:12px;right:12px;width:90px;height:56px;background:rgba(8,12,18,.7);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:7px;")}>
                <svg viewBox="0 0 120 70" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  <path d={v.exMap} fill="none" stroke={v.exRaceColor} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
                  <circle cx="50" cy="59" r="5" fill="#fff" style={css("animation:liveBlink 1s infinite;")} />
                </svg>
              </div>
              {/* resetting overlay */}
              {v.resetting && (
                <div style={css("position:absolute;inset:0;background:rgba(6,9,14,.8);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;backdrop-filter:blur(2px);")}>
                  <span style={css("width:42px;height:42px;border-radius:50%;border:3px solid rgba(255,176,32,.25);border-top-color:#FFB020;animation:spin .8s linear infinite;")} />
                  <span style={css("font-family:'Saira Condensed';font-weight:800;letter-spacing:.14em;font-size:19px;color:#FFB020;")}>RESETTING CAR…</span>
                  <span style={css("font-size:12.5px;color:#9FB0C4;")}>Returning Pod {v.exNum} to the track</span>
                </div>
              )}
            </div>

            {/* actions */}
            <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:16px;")}>
              {v.notResetting ? (
                <button onClick={v.onResetCar} style={css("height:56px;border-radius:13px;border:1px solid rgba(255,176,32,.5);background:rgba(255,176,32,.1);color:#FFB020;font-family:'Saira Condensed';font-weight:800;letter-spacing:.07em;font-size:16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:9px;")}>
                  <Reset w={20} h={20} />RESET CAR
                </button>
              ) : (
                <button disabled style={css("height:56px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:#141A24;color:#8A95A6;font-family:'Saira Condensed';font-weight:800;letter-spacing:.07em;font-size:16px;cursor:not-allowed;display:inline-flex;align-items:center;justify-content:center;gap:9px;")}>
                  <span style={css("width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(255,255,255,.18);border-top-color:#8A95A6;animation:spin .8s linear infinite;")} />RESETTING…
                </button>
              )}
              <button onClick={v.onExpandManage} style={css("height:56px;border-radius:13px;border:1px solid rgba(43,166,255,.4);background:rgba(43,166,255,.1);color:#5BC0FF;font-family:'Saira Condensed';font-weight:700;letter-spacing:.07em;font-size:16px;cursor:pointer;")}>MANAGE IN SIM LOCK</button>
              <button onClick={v.onExpandClose} style={css("height:56px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;font-family:'Saira Condensed';font-weight:700;letter-spacing:.07em;font-size:16px;cursor:pointer;")}>CLOSE</button>
            </div>
          </div>
        )}

        {v.exNotRacing && (
          <div style={css("padding:22px 24px;display:flex;flex-direction:column;gap:16px;")}>
            <div style={css("display:flex;align-items:center;gap:15px;padding:20px;border-radius:14px;background:#11161f;border:1px solid rgba(255,255,255,.07);")}>
              <span style={css("display:inline-flex;width:48px;height:48px;border-radius:12px;background:rgba(107,118,137,.14);color:#9FB0C4;align-items:center;justify-content:center;flex:none;")}>
                <EyeOff w={24} h={24} />
              </span>
              <div>
                <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:21px;line-height:1.05;")}>Pod not currently racing</div>
                <div style={css("color:#8A95A6;font-size:13.5px;margin-top:4px;")}>{v.exDesc} · the live sim view appears here once a race is in progress.</div>
              </div>
            </div>
            <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:12px;")}>
              <button onClick={v.onExpandManage} style={css("height:54px;border-radius:13px;border:1px solid rgba(43,166,255,.4);background:rgba(43,166,255,.1);color:#5BC0FF;font-family:'Saira Condensed';font-weight:700;letter-spacing:.07em;font-size:15px;cursor:pointer;")}>MANAGE IN SIM LOCK</button>
              <button onClick={v.onExpandClose} style={css("height:54px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;font-family:'Saira Condensed';font-weight:700;letter-spacing:.07em;font-size:15px;cursor:pointer;")}>CLOSE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ SESSION RULES (expanded) ============================ */
export function RulesModal({ v }: { v: Vals }) {
  if (!v.showRules) return null;
  return (
    <div onClick={v.onCloseRules} style={css("position:fixed;inset:0;z-index:54;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,6,10,.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:overlayIn .25s ease both;")}>
      <div onClick={v.stop} style={css("width:min(620px,100%);max-height:90vh;overflow:auto;background:#10151D;border:1px solid rgba(255,255,255,.1);border-radius:22px;animation:popIn .3s ease both;")}>
        <div style={css("display:flex;align-items:center;gap:13px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.07);")}>
          <span style={css("display:inline-flex;width:40px;height:40px;border-radius:11px;background:rgba(43,166,255,.16);color:#5BC0FF;align-items:center;justify-content:center;")}>
            <MenuRules w={22} h={22} />
          </span>
          <div style={css("flex:1;")}>
            <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:22px;letter-spacing:.04em;")}>SESSION RULES</div>
            <div style={css("font-size:12.5px;color:#8A95A6;")}>Set the driving aids for this session</div>
          </div>
          <button onClick={v.onCloseRules} style={css("display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#141A24;color:#C7D0DC;cursor:pointer;")}>
            <Close w={18} h={18} />
          </button>
        </div>
        <div style={css("padding:18px 22px 24px;display:flex;flex-direction:column;gap:18px;")}>
          {v.rulesRows.map((row) => (
            <div key={row.key} style={css("display:flex;flex-direction:column;gap:10px;")}>
              <div style={css("display:flex;align-items:center;justify-content:space-between;")}>
                <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.12em;font-size:13px;color:#C7D0DC;")}>{row.label}</span>
                <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:13px;color:${row.color};`)}>{row.val}</span>
              </div>
              <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:8px;")}>
                {row.opts.map((o) =>
                  o.active ? (
                    <button key={o.v} onClick={o.onPick} style={css(`height:48px;border-radius:11px;cursor:pointer;border:1px solid ${o.color};background:rgba(43,166,255,.05);color:${o.color};font-family:'Saira Condensed';font-weight:800;letter-spacing:.06em;font-size:15px;box-shadow:inset 0 0 0 1px ${o.color};`)}>{o.v}</button>
                  ) : (
                    <button key={o.v} onClick={o.onPick} style={css("height:48px;border-radius:11px;cursor:pointer;border:1px solid rgba(255,255,255,.1);background:#141A24;color:#9FB0C4;font-family:'Saira Condensed';font-weight:700;letter-spacing:.06em;font-size:15px;")}>{o.v}</button>
                  )
                )}
              </div>
            </div>
          ))}
          <button onClick={v.onCloseRules} style={css("height:54px;border-radius:13px;border:0;background:linear-gradient(135deg,#2BA6FF,#1E7FE0);color:#04101D;font-family:'Saira Condensed';font-weight:800;letter-spacing:.08em;font-size:16px;cursor:pointer;box-shadow:0 8px 22px rgba(43,166,255,.3);margin-top:4px;")}>DONE</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ PC DETAIL VIEW ============================ */
function KvList({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <div style={css("display:flex;flex-direction:column;")}>
      {rows.map((h, i) => (
        <div key={i} style={css("display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.05);")}>
          <span style={css("font-size:13px;color:#8A95A6;")}>{h.k}</span>
          <span style={css("font-family:'Saira Condensed';font-weight:700;font-size:14px;color:#E7EDF5;text-align:right;")}>{h.v}</span>
        </div>
      ))}
    </div>
  );
}

export function DetailView({ v }: { v: Vals }) {
  if (!v.showDetail) return null;
  return (
    <div style={css("position:fixed;inset:0;z-index:62;background:#070A0F;overflow:auto;animation:overlayIn .25s ease both;")}>
      <div style={css("min-height:100%;display:flex;flex-direction:column;")}>
        {/* top bar */}
        <div style={css("position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:16px;padding:18px 26px;background:rgba(8,11,16,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08);")}>
          <Hover
            as="button"
            onClick={v.onCloseDetail}
            style={css("display:inline-flex;align-items:center;gap:9px;height:46px;padding:0 18px;border-radius:11px;border:1px solid rgba(255,255,255,.12);background:#11161f;color:#C7D0DC;cursor:pointer;font-family:'Saira Condensed';font-weight:700;letter-spacing:.08em;font-size:14px;")}
            hoverStyle={css("border-color:rgba(43,166,255,.45);color:#5BC0FF;")}
          >
            <ChevLeft w={18} h={18} sw={2.3} />BACK
          </Hover>
          <div style={css("display:flex;align-items:baseline;gap:11px;")}>
            <span style={css("font-size:11px;letter-spacing:.26em;color:#6B7689;font-weight:600;")}>SIM POD</span>
            <span style={css("font-family:'Saira Condensed';font-weight:800;font-size:34px;line-height:1;")}>{v.dNum}</span>
            <span style={css("font-family:'Saira Condensed';font-weight:700;font-size:15px;color:#8A95A6;letter-spacing:.04em;")}>{v.dHost}</span>
          </div>
          <span style={css(`display:inline-flex;align-items:center;gap:8px;padding:7px 13px;border-radius:999px;background:${v.dStatusSoft};`)}>
            <span style={css(`width:8px;height:8px;border-radius:50%;background:${v.dStatusColor};`)} />
            <span style={css(`font-family:'Saira Condensed';font-weight:700;letter-spacing:.12em;font-size:13px;color:${v.dStatusColor};`)}>{v.dStatusLabel}</span>
          </span>
          <div style={css("flex:1;")} />
          <div style={css("display:flex;align-items:center;gap:18px;")}>
            <div style={css("text-align:right;")}>
              <div style={css("font-size:10px;letter-spacing:.2em;color:#6B7689;font-weight:600;")}>IP ADDRESS</div>
              <div style={css("font-family:'Saira Condensed';font-weight:700;font-size:14px;color:#C7D0DC;font-variant-numeric:tabular-nums;")}>{v.dIp}</div>
            </div>
            <div style={css("text-align:right;")}>
              <div style={css("font-size:10px;letter-spacing:.2em;color:#6B7689;font-weight:600;")}>UPTIME</div>
              <div style={css("font-family:'Saira Condensed';font-weight:700;font-size:14px;color:#C7D0DC;")}>{v.dUptime}</div>
            </div>
          </div>
        </div>

        <div style={css("flex:1;padding:24px 26px 40px;max-width:1320px;width:100%;margin:0 auto;box-sizing:border-box;")}>
          <div style={css("display:grid;grid-template-columns:1.55fr 1fr;gap:20px;align-items:start;")}>
            {/* LEFT COLUMN */}
            <div style={css("display:flex;flex-direction:column;gap:20px;min-width:0;")}>
              {v.dRacing && (
                <div style={css("position:relative;aspect-ratio:16/9;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.1);")}>
                  <PerspectiveTrack variant="screen" />
                  <span style={css("position:absolute;top:12px;left:12px;display:inline-flex;align-items:center;gap:6px;background:rgba(225,18,51,.9);border-radius:6px;padding:4px 10px;font-family:'Saira Condensed';font-weight:800;letter-spacing:.14em;font-size:11px;color:#fff;animation:liveBlink 1.4s infinite;")}>
                    <span style={css("width:7px;height:7px;border-radius:50%;background:#fff;")} />LIVE GAMEPLAY
                  </span>
                  <span style={css("position:absolute;bottom:12px;left:12px;font-family:'Saira Condensed';font-weight:700;font-size:13px;color:#E7EDF5;")}>{v.dCar}</span>
                  <span style={css("position:absolute;bottom:12px;right:12px;font-family:'Saira Condensed';font-weight:600;font-size:11px;color:#9FB0C4;")}>{v.dTrack}</span>
                </div>
              )}
              {v.dIdle && (
                <div style={css("aspect-ratio:16/9;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:radial-gradient(120% 120% at 50% 0%,#11161f,#0a0e14);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;")}>
                  <span style={css("display:inline-flex;width:60px;height:60px;border-radius:15px;background:rgba(107,118,137,.12);color:#9FB0C4;align-items:center;justify-content:center;")}>
                    <Monitor w={30} h={30} />
                  </span>
                  <div style={css("text-align:center;")}>
                    <div style={css("font-family:'Saira Condensed';font-weight:800;font-size:22px;")}>Desktop idle</div>
                    <div style={css("color:#8A95A6;font-size:13px;margin-top:4px;")}>{v.dStatusDesc} · no live session running</div>
                  </div>
                </div>
              )}

              {/* realtime metrics */}
              <div style={css("background:#0E1219;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;")}>
                <div style={css("display:flex;align-items:center;gap:10px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:13px;color:#C7D0DC;margin-bottom:16px;")}>
                  <span style={css("width:8px;height:8px;border-radius:50%;background:#2FD27A;animation:livePulse 1.5s infinite;")} />REAL-TIME PERFORMANCE
                </div>
                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:18px;")}>
                  {v.dStats.map((s, i) => (
                    <div key={i} style={css("background:#141A24;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:13px 15px;")}>
                      <div style={css("font-size:10px;letter-spacing:.18em;color:#6B7689;font-weight:600;")}>{s.k}</div>
                      <div style={css("display:flex;align-items:baseline;gap:5px;margin-top:6px;")}>
                        <span style={css(`font-family:'Saira Condensed';font-weight:800;font-size:28px;line-height:1;color:${s.c};font-variant-numeric:tabular-nums;`)}>{s.v}</span>
                        <span style={css("font-size:11px;font-weight:600;color:#6B7689;letter-spacing:.08em;")}>{s.u}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={css("display:flex;flex-direction:column;gap:13px;")}>
                  {v.perfBars.map((b, i) => (
                    <div key={i}>
                      <div style={css("display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;")}>
                        <span style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.1em;font-size:12px;color:#9FB0C4;")}>{b.label}</span>
                        <span style={css(`font-family:'Saira Condensed';font-weight:700;font-size:13px;color:${b.color};font-variant-numeric:tabular-nums;`)}>{b.txt}</span>
                      </div>
                      <span style={css("display:block;height:7px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden;")}>
                        <span style={css(`display:block;height:100%;width:${b.txt};background:${b.color};transition:width .8s ease;`)} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* function buttons */}
              <div style={css("background:#0E1219;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;")}>
                <div style={css("font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:13px;color:#C7D0DC;margin-bottom:15px;")}>REMOTE ACTIONS</div>
                {v.dShowReset && (
                  <button onClick={v.onDetailReset} style={css("width:100%;height:54px;border-radius:13px;border:1px solid rgba(255,176,32,.5);background:rgba(255,176,32,.1);color:#FFB020;font-family:'Saira Condensed';font-weight:800;letter-spacing:.07em;font-size:16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-bottom:12px;")}>
                    <Reset w={20} h={20} />RESET CAR ON TRACK
                  </button>
                )}
                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;")}>
                  {v.dFuncList.map((fn) => (
                    <button key={fn.key} onClick={fn.onTap} style={fn.style}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={fn.path} />
                      </svg>
                      <span>{fn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={css("display:flex;flex-direction:column;gap:20px;min-width:0;")}>
              <div style={css("background:#0E1219;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;")}>
                <div style={css("display:flex;align-items:center;gap:10px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:13px;color:#C7D0DC;margin-bottom:14px;")}>
                  <Chip w={17} h={17} />HARDWARE
                </div>
                <KvList rows={v.dHw} />
              </div>

              <div style={css("background:#0E1219;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;")}>
                <div style={css("display:flex;align-items:center;gap:10px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:13px;color:#C7D0DC;margin-bottom:14px;")}>
                  <Target w={17} h={17} />SIM RIG
                </div>
                <KvList rows={v.dPeriph} />
              </div>

              <div style={css("background:#0E1219;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;")}>
                <div style={css("display:flex;align-items:center;gap:10px;font-family:'Saira Condensed';font-weight:700;letter-spacing:.14em;font-size:13px;color:#C7D0DC;margin-bottom:14px;")}>
                  <Gamepad w={17} h={17} />GAME SETTINGS
                </div>
                <KvList rows={v.dGame} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ TOAST ============================ */
export function Toast({ v }: { v: Vals }) {
  if (!v.hasToast) return null;
  return (
    <div style={css("position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:60;display:flex;align-items:center;gap:11px;padding:14px 22px;background:#11151C;border:1px solid rgba(43,166,255,.3);border-radius:14px;box-shadow:0 14px 44px rgba(0,0,0,.55);animation:toastIn .3s ease both;")}>
      <span style={css("width:9px;height:9px;border-radius:50%;background:#2BA6FF;")} />
      <span style={css("font-size:14.5px;color:#F2F5F9;font-weight:500;")}>{v.toast}</span>
    </div>
  );
}
