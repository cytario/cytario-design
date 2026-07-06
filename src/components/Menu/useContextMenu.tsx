import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Menu as AriaMenu,
  MenuTrigger,
  Popover,
  Pressable,
  type PressEvent,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { popoverStyles } from "./menuStyles";

export interface UseContextMenuProps {
  /** Menu body — compose `MenuItem` / `MenuSeparator` / `MenuSection`. */
  content: ReactNode;
  /** Called with the activated item key (fires alongside each item's own `onAction`). */
  onAction?: (key: string) => void;
  /** Extra classes for the menu popover. */
  className?: string;
}

export interface UseContextMenuResult {
  /** Spread on the right-clickable element: opens the menu at the cursor. */
  targetProps: { onContextMenu: (event: React.MouseEvent) => void };
  /**
   * Spread on a keyboard/click trigger (e.g. an `IconButton`): opens the menu
   * anchored to that element. Uses the press event's target — no ref wiring.
   */
  triggerProps: { onPress: (event: PressEvent) => void };
  /** Render this wherever — it portals itself. */
  menu: ReactNode;
  isOpen: boolean;
  close: () => void;
}

/**
 * Cursor-anchored context menu. Unlike {@link Menu} (a click-triggered dropdown
 * anchored to its trigger), this opens at the pointer on right-click and stays
 * open across other right-clicks.
 *
 * Built on a controlled, **non-modal** `Popover` — non-modal so a right-click
 * on another element reaches its own handler (a modal popover's underlay would
 * swallow it and leak the native menu). Because non-modal drops React-Aria's
 * built-in outside dismiss (`isDismissable: !isNonModal`), this hook owns
 * dismissal: a right-click elsewhere closes this menu (and its target opens a
 * fresh one), any outside press closes it, and the native menu is suppressed
 * while open.
 *
 * The popover anchors to a real hidden 0×0 element moved to the cursor (or to
 * the trigger's rect for keyboard opens) — React-Aria's positioning observes
 * the trigger with a `ResizeObserver`, so a plain virtual object won't do.
 */
export function useContextMenu({
  content,
  onAction,
  className,
}: UseContextMenuProps): UseContextMenuResult {
  // The anchor point in viewport coords; null when closed.
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isOpen = anchor !== null;

  const close = useCallback(() => setAnchor(null), []);

  const onContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setAnchor({ x: event.clientX, y: event.clientY });
  }, []);

  const onPress = useCallback((event: PressEvent) => {
    // Anchor to the trigger's bottom-left for keyboard/click opens.
    const rect = event.target.getBoundingClientRect();
    setAnchor({ x: rect.left, y: rect.bottom });
  }, []);

  // Dismissal (non-modal has none of its own). Capture phase so it runs before
  // the menu's own item handlers and before other open menus.
  useEffect(() => {
    if (!isOpen) return;

    const isInside = (target: EventTarget | null) =>
      popoverRef.current?.contains(target as Node) ?? false;

    const onPointerDown = (event: PointerEvent) => {
      if (!isInside(event.target)) close();
    };
    const onOutsideContextMenu = (event: MouseEvent) => {
      if (isInside(event.target)) return;
      // Suppress the native menu; the right-clicked element's own onContextMenu
      // (if any) opens a fresh menu on this same interaction.
      event.preventDefault();
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("contextmenu", onOutsideContextMenu, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("contextmenu", onOutsideContextMenu, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [isOpen, close]);

  const menu = (
    <MenuTrigger
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      {/* Hidden anchor: MenuTrigger positions the popover at this element, which
          we move to the cursor. We open programmatically (controlled isOpen),
          never by pressing it. Pressable satisfies MenuTrigger's trigger slot. */}
      <Pressable>
        <span
          ref={anchorRef}
          aria-hidden
          className="pointer-events-none fixed h-0 w-0"
          style={{ left: anchor?.x ?? 0, top: anchor?.y ?? 0 }}
        />
      </Pressable>
      <Popover
        isNonModal
        placement="bottom start"
        ref={popoverRef}
        className={twMerge(popoverStyles, className)}
      >
        <AriaMenu
          autoFocus="first"
          onAction={(key) => {
            onAction?.(String(key));
            close();
          }}
          className="outline-none"
        >
          {content}
        </AriaMenu>
      </Popover>
    </MenuTrigger>
  );

  return {
    targetProps: { onContextMenu },
    triggerProps: { onPress },
    menu,
    isOpen,
    close,
  };
}
