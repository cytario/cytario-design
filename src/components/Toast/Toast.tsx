import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

const defaultDuration: Record<ToastVariant, number> = {
  success: 5000,
  info: 5000,
  error: 10000,
};

const variantConfig: Record<
  ToastVariant,
  { icon: LucideIcon; containerClass: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle,
    containerClass: "bg-[var(--color-surface-success)] border-[var(--color-border-success)] text-[var(--color-text-success)]",
    iconClass: "text-[var(--color-action-success)]",
  },
  error: {
    icon: XCircle,
    containerClass: "bg-[var(--color-surface-danger)] border-[var(--color-border-danger)] text-[var(--color-text-danger)]",
    iconClass: "text-[var(--color-action-danger)]",
  },
  info: {
    icon: Info,
    containerClass: "bg-[var(--color-surface-info)] border-[var(--color-border-info)] text-[var(--color-text-info)]",
    iconClass: "text-[var(--color-text-info)]",
  },
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = variantConfig[toast.variant];
  const IconComponent = config.icon;

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  }, [onRemove, toast.id]);

  useEffect(() => {
    const duration = toast.duration ?? defaultDuration[toast.variant];
    timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.duration, toast.variant, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md",
        "min-w-[320px] max-w-[420px]",
        "transition-all duration-200",
        isExiting
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100 animate-in slide-in-from-right",
        config.containerClass,
      ].join(" ")}
    >
      <IconComponent size={20} className={["shrink-0 mt-0.5", config.iconClass].join(" ")} aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-current"
        aria-label="Dismiss"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: ToastData[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Toast Bridge — allows code outside the React tree to emit toasts
// ---------------------------------------------------------------------------

export interface ToastBridge {
  /** Call from anywhere (including outside React) to show a toast. */
  emit: (toast: Omit<ToastData, "id">) => void;
  /** Used internally by ToastProvider to subscribe to external emits. */
  subscribe: (fn: (toast: Omit<ToastData, "id">) => void) => () => void;
}

export function createToastBridge(): ToastBridge {
  const listeners = new Set<(toast: Omit<ToastData, "id">) => void>();
  return {
    emit: (toast) => {
      listeners.forEach((fn) => fn(toast));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

// ---------------------------------------------------------------------------
// ToastProvider
// ---------------------------------------------------------------------------

interface ToastProviderProps {
  children: ReactNode;
  /** Optional bridge for receiving toasts from outside the React tree. */
  bridge?: ToastBridge;
}

export function ToastProvider({ children, bridge }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Subscribe to external bridge emits
  useEffect(() => {
    if (!bridge) return;
    return bridge.subscribe(addToast);
  }, [bridge, addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    toast: context.addToast,
    toasts: context.toasts,
    removeToast: context.removeToast,
  };
}
