import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

/* Providers mount in the hundreds (one per overlay trigger), so they share
 * a single MutationObserver instead of one per provider. It only needs to
 * notice that SOME data-theme attribute flipped — each listener then
 * re-resolves its own nearest themed ancestor. */
const themeChangeListeners = new Set<() => void>();
let themeObserver: MutationObserver | null = null;

function observeThemeChanges() {
  if (themeObserver || typeof MutationObserver === "undefined") return;
  themeObserver = new MutationObserver(() => {
    for (const listener of themeChangeListeners) listener();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
    subtree: true,
  });
}

/**
 * Wraps a trigger (+ its overlay) and captures the themed DOM context. Must
 * wrap BOTH the trigger and the overlay element whose `data-theme` comes
 * from `useTriggerTheme` — the hook only sees providers above its consumer.
 */
export function TriggerThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark" | undefined>(() =>
    rootTheme(),
  );
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const resolveTheme = useCallback(() => {
    const next = themeOf(spanRef.current) ?? rootTheme();
    setTheme((prev) => (prev === next ? prev : next));
  }, []);

  // Callback refs fire synchronously when the element (re)attaches — also on
  // HMR remounts — resolving the nearest data-theme ancestor directly.
  const captureRef = useCallback(
    (el: HTMLSpanElement | null) => {
      spanRef.current = el;
      resolveTheme();
    },
    [resolveTheme],
  );

  // The capture ref only fires on (re)attach — it cannot see a data-theme
  // flip while the span stays attached, e.g. an app-level theme switch
  // restyling the document root with every overlay already mounted. Listen
  // for attribute flips so open overlays follow the theme live.
  useEffect(() => {
    themeChangeListeners.add(resolveTheme);
    observeThemeChanges();
    return () => {
      themeChangeListeners.delete(resolveTheme);
    };
  }, [resolveTheme]);

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
