import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";

describe("Link", () => {
  it("renders as a link with correct text", () => {
    render(<Link href="#">Click here</Link>);
    expect(screen.getByRole("link", { name: "Click here" })).toBeDefined();
  });

  it("applies default variant styles", () => {
    render(<Link href="#">Default</Link>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("underline");
  });

  it("applies subtle variant styles", () => {
    render(
      <Link href="#" variant="subtle">
        Subtle
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("no-underline");
  });

  it("applies custom className", () => {
    render(
      <Link href="#" className="ml-2">
        Styled
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("ml-2");
  });

  it("has focus-visible ring styles", () => {
    render(<Link href="#">Focus</Link>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("focus-visible:ring-2");
  });
});
