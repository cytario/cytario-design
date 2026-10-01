import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/**
 * Theme propagation for overlays that escape their themed container.
 *
 * React-Aria portals Popovers (and Tooltip portals itself) to document.body,
 * escaping any themed container the trigger sits in — e.g. Storybook's
 * side-by-side story view, where a dark panel's menu would otherwise render
 * with the page-root (light) tokens.
 *
 * `TriggerThemeProvider` wraps the trigger-side output in an invisible
 * `display: contents` span; a callback ref on that span resolves the themed
 * DOM context (nearest `data-theme` ancestor) into state, so the context
 * carries the resolved theme VALUE. Overlay components consume
 * `useTriggerTheme` (as a descendant of the provider) and apply the value as
 * `data-theme` on the overlay element, so its tokens match the context the
 * overlay was opened from.
 */

const TriggerThemeContext = createContext<"light" | "dark" | undefined>(
  undefined,
);

/**
 * Wraps a trigger (+ its overlay) and captures the themed DOM context. Must
 * wrap BOTH the trigger and the overlay element whose `data-theme` comes
 * from `useTriggerTheme` — the hook only sees providers above its consumer.
 */
export function TriggerThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark" | undefined>(() =>
    rootTheme(),
  );

  // Callback refs fire synchronously when the element (re)attaches — also on
  // HMR remounts — resolving the nearest data-theme ancestor directly.
  const captureRef = useCallback((el: HTMLSpanElement | null) => {
    const next = themeOf(el) ?? rootTheme();
    setTheme((prev) => (prev === next ? prev : next));
  }, []);

  return (
    <TriggerThemeContext.Provider value={theme}>
      {/* display:contents — no layout impact, carries the DOM context */}
      <span ref={captureRef} style={{ display: "contents" }}>
        {children}
      </span>
    </TriggerThemeContext.Provider>
  );
}

/**
 * The effective theme of the nearest provider's captured context (undefined
 * outside a provider). Call from a component INSIDE a TriggerThemeProvider.
 */
export function useTriggerTheme(): "light" | "dark" | undefined {
  return useContext(TriggerThemeContext);
}

function themeOf(el: HTMLElement | null): "light" | "dark" | undefined {
  let node: HTMLElement | null = el;
  while (node) {
    const t = node.getAttribute?.("data-theme");
    if (t === "light" || t === "dark") return t;
    node = node.parentElement;
  }
  return undefined;
}

function rootTheme(): "light" | "dark" | undefined {
  if (typeof document === "undefined") return undefined;
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" || t === "dark" ? t : "light";
}
