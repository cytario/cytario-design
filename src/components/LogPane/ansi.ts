/**
 * Pure ANSI SGR (Select Graphic Rendition) parser for container log lines.
 * Parses one raw log line into styled text segments; never produces markup —
 * the caller renders the segments with React elements.
 */

export interface AnsiStyle {
  /** CSS color for the foreground, or null when the default applies. */
  fg: string | null;
  /** CSS color for the background, or null when the default applies. */
  bg: string | null;
  bold: boolean;
  dim: boolean;
  italic: boolean;
  underline: boolean;
}

export interface AnsiSegment {
  text: string;
  style: AnsiStyle;
}

const DEFAULT_STYLE: AnsiStyle = {
  fg: null,
  bg: null,
  bold: false,
  dim: false,
  italic: false,
  underline: false,
};

const noStyle = (style: AnsiStyle): boolean =>
  style.fg === null &&
  style.bg === null &&
  !style.bold &&
  !style.dim &&
  !style.italic &&
  !style.underline;

export { noStyle };

// Standard and bright halves of the 16-color SGR palette, tuned for a dark
// surface: every entry clears WCAG AA (4.5:1) against slate-900 (#0f172a).
const PALETTE_16 = [
  "#7d8697", "#ff8b93", "#a8d98a", "#e8cd8a",
  "#7db8f5", "#d79ae8", "#6fc9d4", "#e2e5ea",
  "#8a93a4", "#ff9aa2", "#b6e89b", "#ffe0a0",
  "#96c8ff", "#e7b6f5", "#8adde6", "#ffffff",
];

// The xterm 256-color cube: 16 levels on each of the six (red, green, blue)
// axes, preceded by the 16-color palette and followed by a 24-step grayscale ramp.
const PALETTE_256: readonly string[] = buildPalette256();

function buildPalette256(): readonly string[] {
  const colors = [...PALETTE_16];
  const level = (i: number): number => (i === 0 ? 0 : 55 + 40 * i);
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        colors.push(`#${[level(r), level(g), level(b)].map(toHex).join("")}`);
      }
    }
  }
  const gray = (i: number): number => 8 + 10 * i;
  for (let i = 0; i < 24; i++) {
    colors.push(`#${[gray(i), gray(i), gray(i)].map(toHex).join("")}`);
  }
  return colors;
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}

const trueColor = (r: number, g: number, b: number): string =>
  `#${[r, g, b].map((v) => toHex(clampColor(v))).join("")}`;

const clampColor = (value: number): number => Math.max(0, Math.min(255, value));

/**
 * Applies one SGR parameter list to a style, returning the new style.
 * Unsupported parameters are ignored (their effect degrades to nothing).
 */
function applySgr(params: readonly number[], style: AnsiStyle): AnsiStyle {
  const next: AnsiStyle = { ...style };
  let i = 0;
  while (i < params.length) {
    const code = params[i];
    if (code === 38 || code === 48) {
      const isFg = code === 38;
      const kind = params[i + 1];
      if (kind === 5 && i + 2 < params.length) {
        const index = clampColor(params[i + 2]);
        const color = PALETTE_256[index] ?? null;
        if (isFg) next.fg = color;
        else next.bg = color;
        i += 3;
        continue;
      }
      if (kind === 2 && i + 4 < params.length) {
        const color = trueColor(params[i + 2], params[i + 3], params[i + 4]);
        if (isFg) next.fg = color;
        else next.bg = color;
        i += 5;
        continue;
      }
      // Malformed extended color — consume it and leave the style unchanged.
      i += 2;
      continue;
    }
    switch (code) {
      case 0:
        next.fg = null;
        next.bg = null;
        next.bold = false;
        next.dim = false;
        next.italic = false;
        next.underline = false;
        break;
      case 1:
        next.bold = true;
        break;
      case 2:
        next.dim = true;
        break;
      case 3:
        next.italic = true;
        break;
      case 4:
        next.underline = true;
        break;
      case 22:
        next.bold = false;
        next.dim = false;
        break;
      case 23:
        next.italic = false;
        break;
      case 24:
        next.underline = false;
        break;
      case 39:
        next.fg = null;
        break;
      case 49:
        next.bg = null;
        break;
      default:
        if (code >= 30 && code <= 37) {
          next.fg = PALETTE_16[code - 30];
        } else if (code >= 90 && code <= 97) {
          next.fg = PALETTE_16[code - 90 + 8];
        } else if (code >= 40 && code <= 47) {
          next.bg = PALETTE_16[code - 40];
        } else if (code >= 100 && code <= 107) {
          next.bg = PALETTE_16[code - 100 + 8];
        }
        // Anything else is unsupported and silently ignored.
        break;
    }
    i += 1;
  }
  return next;
}

const pushSegment = (segments: AnsiSegment[], text: string, style: AnsiStyle): void => {
  if (text.length > 0) segments.push({ text, style });
};

/**
 * Parses one log line into styled segments. Escape sequences the parser does
 * not support (non-SGR CSI, OSC, C0 controls, truncated sequences) are consumed
 * and dropped; the printable text around them is preserved.
 */
export function parseAnsiLine(line: string): AnsiSegment[] {
  const segments: AnsiSegment[] = [];
  let style: AnsiStyle = DEFAULT_STYLE;
  let plain = "";
  let i = 0;

  const flush = (): void => {
    pushSegment(segments, plain, style);
    plain = "";
  };

  while (i < line.length) {
    const char = line[i];

    if (char === "\u001b") {
      const next = line[i + 1];
      if (next === "[") {
        // CSI: scan parameters (digits and semicolons) up to a final byte.
        let j = i + 2;
        while (j < line.length && /[0-9;:?]/.test(line[j])) j++;
        if (j < line.length && line[j] === "m") {
          flush();
          const paramText = line.slice(i + 2, j);
          const params =
            paramText === "" ? [0] : paramText.split(";").map((p) => (p === "" ? 0 : Number(p)));
          style = applySgr(params, style);
          i = j + 1;
          continue;
        }
        if (j >= line.length) {
          // Truncated CSI at end of line — consume the rest and stop.
          flush();
          return segments;
        }
        // Some other CSI sequence — consume it entirely.
        flush();
        i = j + 1;
        continue;
      }
      if (next === "]") {
        // OSC: consume through a BEL or ST terminator; an unterminated OSC
        // consumes the remainder of the line.
        const bel = line.indexOf("\u0007", i + 2);
        const st = line.indexOf("\u001b\\", i + 2);
        let end = -1;
        if (bel !== -1 && (st === -1 || bel < st)) end = bel + 1;
        else if (st !== -1) end = st + 2;
        flush();
        i = end === -1 ? line.length : end;
        continue;
      }
      if (next !== undefined) {
        // Other escape sequences (two-byte) — consume both bytes.
        flush();
        i += 2;
        continue;
      }
      // Lone ESC at end of line — drop it.
      flush();
      i += 1;
      continue;
    }

    if (char < "\u0020" || char === "\u007f") {
      // Non-printing C0/C1 control characters are consumed.
      flush();
      i += 1;
      continue;
    }

    plain += char;
    i += 1;
  }

  flush();
  return segments;
}

const SEGMENT_CACHE_LIMIT = 500;
const segmentCache = new Map<string, AnsiSegment[]>();

/**
 * Memoized parse keyed by the raw line, so consumer re-renders triggered by
 * status refetches do not re-parse unchanged log lines.
 */
export function parseAnsiLineCached(line: string): AnsiSegment[] {
  const cached = segmentCache.get(line);
  if (cached !== undefined) return cached;
  const parsed = parseAnsiLine(line);
  if (segmentCache.size >= SEGMENT_CACHE_LIMIT) {
    // Map iterates in insertion order; drop the oldest entry.
    const oldest = segmentCache.keys().next().value;
    if (oldest !== undefined) segmentCache.delete(oldest);
  }
  segmentCache.set(line, parsed);
  return parsed;
}
