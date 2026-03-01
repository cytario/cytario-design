import type React from "react";
import { Header } from "react-aria-components";

export interface MenuHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MenuHeader({ children, className }: MenuHeaderProps) {
  return <Header className={className}>{children}</Header>;
}
