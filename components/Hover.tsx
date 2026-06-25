"use client";

import React, { useState } from "react";

type HoverProps = {
  as?: React.ElementType;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  children?: React.ReactNode;
} & Record<string, unknown>;

/**
 * Renders an element that merges `hoverStyle` over `style` while hovered —
 * the React equivalent of the prototype's `style-hover` attribute.
 */
export function Hover({
  as = "div",
  style,
  hoverStyle,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: HoverProps) {
  const [hover, setHover] = useState(false);
  const Tag = as as React.ElementType;
  const merged =
    hover && hoverStyle ? { ...style, ...hoverStyle } : style;
  return (
    <Tag
      {...rest}
      style={merged}
      onMouseEnter={(e: React.MouseEvent) => {
        setHover(true);
        (onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      }}
      onMouseLeave={(e: React.MouseEvent) => {
        setHover(false);
        (onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      }}
    >
      {children}
    </Tag>
  );
}
