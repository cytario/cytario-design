import "@testing-library/jest-dom/vitest";

// jsdom has no ResizeObserver; TruncatedText (and any layout-measuring
// component) needs one to mount in tests.
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverStub implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}
