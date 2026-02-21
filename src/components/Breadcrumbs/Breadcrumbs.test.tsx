import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  const defaultItems = [
    { id: "home", label: "Home", href: "#" },
    { id: "products", label: "Products", href: "#" },
    { id: "current", label: "Current Page" },
  ];

  it("renders a navigation element", () => {
    render(<Breadcrumbs items={defaultItems} />);
    expect(screen.getByRole("navigation")).toBeDefined();
  });

  it("renders all breadcrumb items", () => {
    render(<Breadcrumbs items={defaultItems} />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Products")).toBeDefined();
    expect(screen.getByText("Current Page")).toBeDefined();
  });

  it("renders non-last items as links", () => {
    render(<Breadcrumbs items={defaultItems} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]?.textContent).toBe("Home");
    expect(links[1]?.textContent).toBe("Products");
  });

  it("renders last item as plain text (not a link)", () => {
    render(<Breadcrumbs items={defaultItems} />);
    const currentPage = screen.getByText("Current Page");
    expect(currentPage.tagName).not.toBe("A");
  });

  it("renders chevron separators between items", () => {
    const { container } = render(<Breadcrumbs items={defaultItems} />);
    const svgs = container.querySelectorAll("svg");
    // 2 separators for 3 items
    expect(svgs).toHaveLength(2);
  });

  it("applies custom className to nav element", () => {
    render(<Breadcrumbs items={defaultItems} className="mt-4" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("mt-4");
  });
});
