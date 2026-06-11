import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// Use useLayoutEffect on client, useEffect on server to avoid SSR warning
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface TooltipProps {
  /** Tooltip content; `null`/`undefined` disables the tooltip entirely */
  content: ReactNode;
  /** Trigger element(s) */
  children: ReactNode;
}

interface Coords {
  x: number;
  y: number;
}

const offsetThreshold = 5;
const tooltipDelay = 500; // ms of cursor rest before showing
const tooltipOffset = 12;
const viewportMargin = 4; // minimum gap to the viewport edge

const tooltipCx = [
  "fixed z-50 px-2 py-1 rounded shadow-lg",
  // Natural content width (capped at max-w-xs): being positioned near the
  // right viewport edge must shift the tooltip left, not squeeze its layout.
  "w-max max-w-xs",
  "bg-(--color-surface-overlay) backdrop-blur-sm",
  "text-(--color-text-inverse) text-sm",
  "pointer-events-none",
].join(" ");

/**
 * Cursor-following tooltip. Shows after the cursor rests on the trigger for
 * 500ms (movement beyond 5px restarts the wait), positioned at a 12px offset
 * from the cursor and flipped at viewport edges.
 *
 * Keyboard: when an already-focusable child (button, switch, link) receives
 * visible focus, the tooltip shows immediately, anchored to the element's
 * center. It never makes anything focusable itself. Escape dismisses.
 *
 * Known limitation (WCAG 1.4.13 "hoverable"): the tooltip is
 * pointer-events-none and follows the cursor, so it cannot itself be hovered.
 * Keep tooltip content short — it is a glance affordance, not a reading
 * surface; the underlying value must stay accessible on the trigger itself.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 });
  const [adjustedCoords, setAdjustedCoords] = useState<Coords>({ x: 0, y: 0 });
  const timerRef = useRef<number | null>(null);
  // Cursor-rest anchor. A ref, not state: the move-cancel comparison must see
  // the value set earlier in the SAME event stream, not a previous render's.
  const restAnchorRef = useRef<Coords | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isVisible = visible && content != null;

  const calculateAdjustedPosition = (anchorX: number, anchorY: number) => {
    if (!tooltipRef.current) {
      return { x: anchorX + tooltipOffset, y: anchorY + tooltipOffset };
    }

    const { width, height } = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = anchorX + tooltipOffset;
    let y = anchorY + tooltipOffset;

    // Flip to the other side of the anchor at right/bottom edges
    if (anchorX + width > viewportWidth) {
      x = anchorX - width - tooltipOffset;
    }
    if (anchorY + height > viewportHeight) {
      y = anchorY - height - tooltipOffset;
    }

    // Hard-clamp into the viewport — flipping alone can still overshoot
    // (e.g. anchor near a corner, or tooltip wider than the remaining space)
    x = Math.max(
      viewportMargin,
      Math.min(x, viewportWidth - width - viewportMargin),
    );
    y = Math.max(
      viewportMargin,
      Math.min(y, viewportHeight - height - viewportMargin),
    );

    return { x, y };
  };

  // Recalculate position after tooltip is rendered/resized
  useIsomorphicLayoutEffect(() => {
    if (!isVisible || !tooltipRef.current) return;
    setAdjustedCoords(calculateAdjustedPosition(coords.x, coords.y));
  }, [isVisible, coords, content]);

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    restAnchorRef.current = null;
    setVisible(false);
  };

  // Cursor-rest model: any move beyond the threshold (measured against the
  // incoming event coordinates, not stale state) hides the tooltip, re-anchors
  // and restarts the dwell; staying within it lets the pending timer fire.
  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    setCoords({ x: clientX, y: clientY });

    const anchor = restAnchorRef.current;
    const moved =
      anchor == null ||
      Math.abs(clientX - anchor.x) > offsetThreshold ||
      Math.abs(clientY - anchor.y) > offsetThreshold;

    if (!moved) return;

    hideTooltip();
    restAnchorRef.current = { x: clientX, y: clientY };
    timerRef.current = window.setTimeout(() => {
      setVisible(true);
    }, tooltipDelay);
  };

  // Keyboard path: a focusable child received focus. Only react to visible
  // (keyboard-driven) focus and anchor at the element's center — no dwell,
  // deliberate focus is intent enough.
  const handleFocus = (e: FocusEvent) => {
    const target = e.target as Element;
    let focusVisible = true;
    try {
      focusVisible = target.matches(":focus-visible");
    } catch {
      // Older engines without :focus-visible — fall back to showing.
    }
    if (!focusVisible) return;

    const rect = target.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    // Anchor at the element center so incidental mouse movement over the
    // focused trigger doesn't immediately cancel the keyboard-shown tooltip.
    restAnchorRef.current = center;
    setCoords(center);
    setVisible(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") hideTooltip();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const tooltipContent =
    isVisible && content != null ? (
      <div
        ref={tooltipRef}
        role="tooltip"
        className={tooltipCx}
        style={{ left: adjustedCoords.x, top: adjustedCoords.y }}
      >
        {content}
      </div>
    ) : null;

  return (
    <span
      style={{ display: "contents" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={hideTooltip}
      onFocus={handleFocus}
      onBlur={hideTooltip}
      onKeyDown={handleKeyDown}
    >
      {children}
      {typeof window !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </span>
  );
}
