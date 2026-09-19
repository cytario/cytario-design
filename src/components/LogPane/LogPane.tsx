import type React from "react";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";
import { noStyle, parseAnsiLineCached, type AnsiStyle } from "./ansi";

/** One container-log line as returned by a log endpoint. */
export interface LogPaneLine {
  /**
   * When the line was emitted. Not rendered — the pane is about the message
   * surface; consumers that want timestamps render them outside the pane.
   */
  timestamp?: string;
  /** The raw line text, possibly containing ANSI SGR escape sequences. */
  message: string;
}

export type LogPaneSize = "sm" | "md" | "lg";

export interface LogPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The log lines to render, in output order. */
  lines: readonly LogPaneLine[];
  /** Accessible name for the log region. */
  label?: string;
  /**
   * Upper bound for the pane's height; the surface scrolls internally once
   * the log exceeds it. `"md"` (24rem) is the default.
   */
  size?: LogPaneSize;
  /** When true, the pane keeps its full height even with few lines, so the
   * layout does not jump as output streams in. */
  isFixedHeight?: boolean;
  /** Merged over the default surface classes with tailwind-merge. */
  className?: string;
}

const sizeStyles: Record<LogPaneSize, string> = {
  sm: "max-h-48",
  md: "max-h-96",
  lg: "max-h-[36rem]",
};

const fixedHeightStyles: Record<LogPaneSize, string> = {
  sm: "h-48",
  md: "h-96",
  lg: "h-[36rem]",
};

function segmentStyle(style: AnsiStyle): CSSProperties | undefined {
  const css: CSSProperties = {};
  if (style.fg !== null) css.color = style.fg;
  if (style.bg !== null) css.backgroundColor = style.bg;
  if (style.bold) css.fontWeight = "bold";
  if (style.dim) css.opacity = "0.6";
  if (style.italic) css.fontStyle = "italic";
  if (style.underline) css.textDecoration = "underline";
  return Object.keys(css).length > 0 ? css : undefined;
}

export function LogPane({
  lines,
  label = "Log output",
  size = "md",
  isFixedHeight = false,
  className,
  ...rest
}: LogPaneProps) {
  if (lines.length === 0) return null;

  // Fixed dark surface in both app themes: the ANSI palette is
  // contrast-calibrated for slate-900, so the pane deliberately does not
  // follow the light/dark theme.
  const surfaceCx = twMerge(
    [
      "rounded-md border border-slate-800 bg-slate-900 text-slate-100",
      "font-mono text-xs leading-relaxed p-3",
      "whitespace-pre-wrap break-all",
      "overflow-y-auto",
      isFixedHeight ? fixedHeightStyles[size] : sizeStyles[size],
    ].join(" "),
    className,
  );

  return (
    <div
      className={surfaceCx}
      role="region"
      aria-label={label}
      tabIndex={0}
      {...rest}
    >
      {lines.map((line, i) => {
        const segments = parseAnsiLineCached(line.message);
        return (
          <div key={`${line.timestamp ?? ""}-${i}`}>
            {segments.map((segment, j) => {
              if (noStyle(segment.style)) return segment.text;
              return (
                <span key={j} style={segmentStyle(segment.style)}>
                  {segment.text}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
