import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Settings } from "lucide-react";
import { IconButtonLink } from "./IconButton";

describe("IconButtonLink", () => {
  it("renders as a link with label", () => {
    render(<IconButtonLink href="#" icon={Settings} label="Settings" />);
    expect(screen.getByRole("link", { name: "Settings" })).toBeDefined();
  });

  it("renders the icon", () => {
    const { container } = render(
      <IconButtonLink href="#" icon={Settings} label="Settings" />,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("applies ghost variant by default", () => {
    render(<IconButtonLink href="#" icon={Settings} label="Settings" />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-transparent");
  });
});
