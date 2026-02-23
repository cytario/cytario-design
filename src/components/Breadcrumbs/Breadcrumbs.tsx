import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
  Link,
} from "react-aria-components";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
    >
    <AriaBreadcrumbs
      className="flex items-center gap-1 text-sm min-w-0"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <AriaBreadcrumb
            key={item.id}
            id={item.id}
            className={[
              "flex items-center gap-1",
              isLast ? "min-w-0" : "shrink-0",
            ].join(" ")}
          >
            {isLast ? (
              <span className="font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)] truncate">
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-[var(--color-text-secondary)] outline-none transition-colors hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:rounded-sm"
                >
                  {item.label}
                </Link>
                <ChevronRight
                  className="shrink-0 text-[var(--color-neutral-400)]"
                  size={16}
                  aria-hidden="true"
                />
              </>
            )}
          </AriaBreadcrumb>
        );
      })}
    </AriaBreadcrumbs>
    </nav>
  );
}
