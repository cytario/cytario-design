import {
  CSSProperties,
  KeyboardEvent,
  ReactNode,
  UIEvent,
  useRef,
} from "react";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { useMiddleEllipsis } from "./useMiddleEllipsis";
import { useOverflowDetection } from "./useOverflowDetection";

type EllipsisMode = "left" | "middle" | "right";

export interface TruncatedTextProps {
  /** Text to display. `middle` ellipsis requires a string child. */
  children: ReactNode;
  /** Where the ellipsis is placed when the text overflows (default `right`). */
  ellipsis?: EllipsisMode;
  /** When set, the text becomes click-to-copy and copies this value. */
  copyValue?: string;
}

const spanCx = "truncate overflow-hidden whitespace-nowrap block min-w-0 w-full";
// Web's original used -mx-1 px-1 to widen the hover highlight beyond the
// text; on a w-full element the negative margin overflows the container and
// clips on the right — keep the highlight within the text box instead.
const copyCx =
  "hover:bg-accent transition-colors rounded cursor-pointer group/copy";

// Hover/focus-revealed copy affordance — a small icon at the trailing edge
// that makes the click-to-copy behavior discoverable. The whole glyph
// (backdrop included) fades as one; when hidden, nothing is painted over the
// text. pointer-events-none so the whole span remains the click target.
const CopyGlyph = () => (
  <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 opacity-0 transition-opacity group-hover/copy:opacity-100 group-focus-within/copy:opacity-100">
    <Icon icon="Copy" size="xs" />
  </span>
);

const leftStyle: CSSProperties = { direction: "rtl", textAlign: "left" };

// An overflow-hidden + ellipsis element is still a horizontal scroll
// container: a click-drag text selection (or focus) scrolls it, sliding the
// text and hiding the ellipsis. Pin it so the truncation always shows.
const pinScroll = (e: UIEvent<HTMLElement>) => {
  if (e.currentTarget.scrollLeft !== 0) e.currentTarget.scrollLeft = 0;
};

const handleCopyKeyDown = (handleClick: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleClick();
  }
};

const CopiedOverlay = () => (
  <span
    // Announce the successful copy to screen readers; as a live region the
    // text is not glued onto the button's accessible name.
    role="status"
    aria-live="polite"
    className="absolute inset-0 flex items-center text-muted-foreground pointer-events-none"
  >
    Copied
  </span>
);

// ─── Right (default): pure CSS truncation ───────────────────────────

const RightEllipsis = ({ children, copyValue }: { children: ReactNode; copyValue?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isTruncated = useOverflowDetection(ref);
  const { handleClick, isCopied } = useCopyToClipboard(copyValue);
  const isCopyable = copyValue != null;

  const baseCx = isCopyable ? `${spanCx} ${copyCx} relative` : spanCx;
  const cx = isCopied ? `${baseCx} text-transparent` : baseCx;

  return (
    <Tooltip content={isTruncated ? children : null}>
      <span
        ref={ref}
        className={cx}
        onScroll={pinScroll}
        onClick={isCopyable ? handleClick : undefined}
        onKeyDown={isCopyable ? handleCopyKeyDown(handleClick) : undefined}
        role={isCopyable ? "button" : undefined}
        tabIndex={isCopyable ? 0 : undefined}
      >
        {children}
        {isCopyable && !isCopied && <CopyGlyph />}
        {isCopied && <CopiedOverlay />}
      </span>
    </Tooltip>
  );
};

// ─── Left: CSS direction trick ──────────────────────────────────────

const LeftEllipsis = ({ children, copyValue }: { children: ReactNode; copyValue?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isTruncated = useOverflowDetection(ref);
  const { handleClick, isCopied } = useCopyToClipboard(copyValue);
  const isCopyable = copyValue != null;

  const baseCx = isCopyable ? `${spanCx} ${copyCx} relative` : spanCx;
  const cx = isCopied ? `${baseCx} text-transparent` : baseCx;

  return (
    <Tooltip content={isTruncated ? children : null}>
      <span
        ref={ref}
        className={cx}
        style={leftStyle}
        onScroll={pinScroll}
        onClick={isCopyable ? handleClick : undefined}
        onKeyDown={isCopyable ? handleCopyKeyDown(handleClick) : undefined}
        role={isCopyable ? "button" : undefined}
        tabIndex={isCopyable ? 0 : undefined}
      >
        <bdi>{children}</bdi>
        {isCopyable && !isCopied && <CopyGlyph />}
        {isCopied && <CopiedOverlay />}
      </span>
    </Tooltip>
  );
};

// ─── Middle: JS-based truncation ────────────────────────────────────

const middleCx = "overflow-hidden whitespace-nowrap block min-w-0 w-full";

const MiddleEllipsisString = ({ text, copyValue }: { text: string; copyValue?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const displayed = useMiddleEllipsis(ref, text);
  const isTruncated = displayed !== text;
  const { handleClick, isCopied } = useCopyToClipboard(copyValue);
  const isCopyable = copyValue != null;

  const baseCx = isCopyable ? `${middleCx} ${copyCx} relative` : middleCx;
  const cx = isCopied ? `${baseCx} text-transparent` : baseCx;

  return (
    <Tooltip content={isTruncated ? text : null}>
      <span
        ref={ref}
        className={cx}
        // Middle truncation replaces the DOM text, so screen readers would
        // otherwise announce the mutilated string — expose the full value.
        aria-label={isTruncated ? text : undefined}
        onScroll={pinScroll}
        onClick={isCopyable ? handleClick : undefined}
        onKeyDown={isCopyable ? handleCopyKeyDown(handleClick) : undefined}
        role={isCopyable ? "button" : undefined}
        tabIndex={isCopyable ? 0 : undefined}
      >
        {displayed}
        {isCopyable && !isCopied && <CopyGlyph />}
        {isCopied && <CopiedOverlay />}
      </span>
    </Tooltip>
  );
};

// ─── Public component ───────────────────────────────────────────────

/**
 * Truncating text span (ported from cytario-web's TooltipSpan). Reveals the
 * full value via the cursor tooltip only while actually truncated. Plain text
 * stays non-focusable; passing `copyValue` turns it into a click-to-copy
 * button (focusable, keyboard operable).
 */
export const TruncatedText = ({ children, ellipsis = "right", copyValue }: TruncatedTextProps) => {
  if (ellipsis === "left") return <LeftEllipsis copyValue={copyValue}>{children}</LeftEllipsis>;
  if (ellipsis === "middle" && typeof children === "string")
    return <MiddleEllipsisString text={children} copyValue={copyValue} />;
  return <RightEllipsis copyValue={copyValue}>{children}</RightEllipsis>;
};
