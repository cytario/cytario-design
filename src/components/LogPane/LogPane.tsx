import type React from "react";
import type { CSSProperties } from "react";
import { useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "../IconButton";
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

// Controls sit on the dark surface, where the shared button variants' semantic
// colors (text-foreground, hover:bg-muted) are unreadable or invert the pane.
// The chip keeps the icons legible where they land over log text.
const controlCx = [
  "text-slate-300 bg-slate-900/85 hover:bg-slate-600 hover:text-white",
  "pressed:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-1",
  "focus-visible:outline-slate-300",
].join(" ");

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, []);

  const copy = useCallback(() => {
    const text = lines.map((line) => line.message).join("\n");
    // The clipboard API is absent in insecure contexts and can reject on denied
    // permission — fail silently rather than throw.
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (copiedTimerRef.current != null) clearTimeout(copiedTimerRef.current);
        setIsCopied(true);
        copiedTimerRef.current = window.setTimeout(() => {
          setIsCopied(false);
          copiedTimerRef.current = null;
        }, 1500);
      })
      .catch(() => {});
  }, [lines]);

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
    <div className="group relative">
      <div
        ref={scrollerRef}
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
      <div
        className={[
          "absolute top-2 right-2 flex gap-1",
          // Revealed while the cursor is over the pane, and while focus is
          // inside it, so the controls stay reachable by keyboard. Hidden also
          // from the pointer, so an invisible control cannot be clicked.
          "opacity-0 pointer-events-none transition-opacity",
          "group-hover:opacity-100 group-hover:pointer-events-auto",
          "group-focus-within:opacity-100 group-focus-within:pointer-events-auto",
        ].join(" ")}
      >
        <IconButton
          icon="Copy"
          label="Copy log"
          variant="ghost"
          size="sm"
          onClick={copy}
          className={controlCx}
        />
        <IconButton
          icon="ArrowDown"
          label="Scroll to bottom"
          variant="ghost"
          size="sm"
          onClick={scrollToBottom}
          className={controlCx}
        />
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {isCopied ? "Log copied" : ""}
      </div>
    </div>
  );
}
