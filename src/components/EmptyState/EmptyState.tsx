import type React from "react";
import { Icon, type IconValue } from "../Icon";

export interface EmptyStateProps {
  icon?: IconValue;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center text-center py-12 px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <Icon icon={icon} size="xl" className="text-muted-foreground" />
      )}
      <h3 className="text-lg font-semibold text-foreground mt-4">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
