import type React from "react";
import {
  MenuSection as AriaMenuSection,
  Header,
} from "react-aria-components";

export interface MenuSectionProps {
  /** Optional section header — string renders as styled text, ReactNode for custom */
  header?: React.ReactNode;
  /** MenuItems within this section */
  children: React.ReactNode;
  /** Accessible label for the section group (useful when header is absent or non-textual) */
  "aria-label"?: string;
  className?: string;
}

export function MenuSection({
  header,
  children,
  "aria-label": ariaLabel,
  className,
}: MenuSectionProps) {
  return (
    <AriaMenuSection className={className} aria-label={ariaLabel}>
      {header && (
        <Header
          className={[
            "px-3 py-1.5",
            "text-xs font-semibold",
            "text-(--color-text-secondary)",
            "uppercase tracking-wider",
            "select-none",
          ].join(" ")}
        >
          {header}
        </Header>
      )}
      {children}
    </AriaMenuSection>
  );
}
