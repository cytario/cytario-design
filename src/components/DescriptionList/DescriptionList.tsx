import { createContext, useContext } from "react";
import type React from "react";
import { Button as AriaButton } from "react-aria-components";
import { Tooltip } from "../Tooltip";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DescriptionListLayout = "stacked" | "horizontal";

export interface DescriptionListProps {
  children: React.ReactNode;
  /** Layout for all items: "stacked" (label above value) or "horizontal" (side by side) */
  layout?: DescriptionListLayout;
  className?: string;
}

export interface DescriptionListItemProps {
  label: string;
  children: React.ReactNode;
  /** De-emphasize the value text */
  muted?: boolean;
  /** When set, wraps value in a Tooltip showing the full text (useful for truncated ETags etc.) */
  fullValue?: string;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const LayoutContext = createContext<DescriptionListLayout>("stacked");

/* ------------------------------------------------------------------ */
/*  DescriptionList                                                    */
/* ------------------------------------------------------------------ */

const listGapStyles: Record<DescriptionListLayout, string> = {
  stacked: "gap-4",
  horizontal: "gap-3",
};

export function DescriptionList({
  children,
  layout = "stacked",
  className,
}: DescriptionListProps) {
  return (
    <LayoutContext.Provider value={layout}>
      <dl
        className={["flex flex-col", listGapStyles[layout], className]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </dl>
    </LayoutContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  DescriptionList.Item                                               */
/* ------------------------------------------------------------------ */

const itemLayoutStyles: Record<DescriptionListLayout, string> = {
  stacked: "flex flex-col gap-1",
  horizontal:
    "grid grid-cols-[140px_1fr] gap-x-(--spacing-4) items-baseline",
};

const labelClasses =
  "text-sm font-medium text-(--color-text-primary)";

function DescriptionListItem({
  label,
  children,
  muted = false,
  fullValue,
}: DescriptionListItemProps) {
  const layout = useContext(LayoutContext);

  const valueClasses = [
    "text-sm m-0",
    muted
      ? "text-(--color-text-secondary)"
      : "text-(--color-text-primary)",
  ].join(" ");

  const valueContent = <dd className={valueClasses}>{children}</dd>;

  return (
    <div className={itemLayoutStyles[layout]}>
      <dt className={labelClasses}>{label}</dt>
      {fullValue ? (
        <Tooltip content={fullValue}>
          <AriaButton className="text-left outline-none cursor-default">
            {valueContent}
          </AriaButton>
        </Tooltip>
      ) : (
        valueContent
      )}
    </div>
  );
}

DescriptionList.Item = DescriptionListItem;
