import type { CSSProperties } from "react";

/**
 * Parse a CSS declaration string (as used verbatim in the prototype's inline
 * `style="..."` attributes) into a React style object. Keeping the original
 * strings preserves pixel-for-pixel fidelity and avoids hand-translating every
 * property to camelCase.
 *
 * Safe for this codebase: no declaration value contains `:` or `;`
 * (gradients/rgba use commas only), so splitting on those is unambiguous.
 */
export function css(input: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of input.split(";")) {
    const idx = decl.indexOf(":");
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop) continue;
    // kebab-case -> camelCase (also turns -webkit-x into WebkitX, which React wants).
    const key = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[key] = val;
  }
  return out as CSSProperties;
}
