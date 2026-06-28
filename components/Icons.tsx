import React from "react";

interface IcoProps {
  w?: number;
  h?: number;
  sw?: number;
  stroke?: string;
  style?: React.CSSProperties;
}

function Base({
  w = 24,
  h = 24,
  sw = 2,
  stroke = "currentColor",
  style,
  children,
}: IcoProps & { children: React.ReactNode }) {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {children}
    </svg>
  );
}

export const LockClosed = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </Base>
);

export const LockOpen = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 7.7-1.6" />
  </Base>
);

export const ChevRight = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M9 18l6-6-6-6" />
  </Base>
);

export const ChevLeft = (p: IcoProps) => (
  <Base sw={2} {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Base>
);

export const ArrowRight = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Base>
);

export const Plus = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Base>
);

export const Check = (p: IcoProps) => (
  <Base sw={3} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Base>
);

export const Printer = (p: IcoProps) => (
  <Base sw={2} {...p}>
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
  </Base>
);

export const Flag = (p: IcoProps) => (
  <Base sw={2} {...p}>
    <path d="M5 21V4" />
    <path d="M5 5h12l-2.2 3.6L17 12H5" />
  </Base>
);

export const Cycle = (p: IcoProps) => (
  <Base sw={2.4} stroke="#5A6475" {...p}>
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Base>
);

export const ExpandCorners = (p: IcoProps) => (
  <Base sw={2.4} {...p}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v3" />
    <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
  </Base>
);

export const ExpandArrows = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </Base>
);

export const Reset = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Base>
);

export const Volume = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
    <path d="M16 9a4 4 0 0 1 0 6" />
    <path d="M19 6a8 8 0 0 1 0 12" />
  </Base>
);

export const Close = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Base>
);

export const Card = (p: IcoProps) => (
  <Base sw={2} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 10h18" />
  </Base>
);

export const Voucher = (p: IcoProps) => (
  <Base sw={2.2} {...p}>
    <path d="M3 9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4Z" />
    <path d="M12 8v8" strokeDasharray="2 2" />
  </Base>
);

export const ListLines = (p: IcoProps) => (
  <Base sw={2} {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h10" />
  </Base>
);

export const EyeOff = (p: IcoProps) => (
  <Base sw={2} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <path d="M4 4l16 16" />
  </Base>
);

export const Monitor = (p: IcoProps) => (
  <Base sw={1.8} {...p}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </Base>
);

export const Chip = (p: IcoProps) => (
  <Base sw={2} stroke="#5BC0FF" {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
  </Base>
);

export const Target = (p: IcoProps) => (
  <Base sw={2} stroke="#5BC0FF" {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
  </Base>
);

export const Gamepad = (p: IcoProps) => (
  <Base sw={2} stroke="#FFB020" {...p}>
    <path d="M6 11h4M8 9v4" />
    <circle cx="16" cy="10" r="1" />
    <circle cx="18.5" cy="13" r="1" />
    <path d="M3.5 16l1.6-7.2A3 3 0 0 1 8 6.5h8a3 3 0 0 1 2.9 2.3L20.5 16a2 2 0 0 1-3.7 1.3L15 15H9l-1.8 2.3A2 2 0 0 1 3.5 16Z" />
  </Base>
);

export const MenuRules = (p: IcoProps) => (
  <Base sw={2} stroke="#5BC0FF" {...p}>
    <path d="M4 6h16" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </Base>
);
