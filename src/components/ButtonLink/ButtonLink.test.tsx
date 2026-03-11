import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArrowRight, Mail, Settings } from "lucide-react";
import { ButtonLink, IconButtonLink } from "./ButtonLink";

describe("ButtonLink", () => {
  it("renders as a link with correct text", () => {
    render(<ButtonLink href="#">Click here</ButtonLink>);
    expect(screen.getByRole("link", { name: "Click here" })).toBeDefined();
  });

  it("applies primary variant by default", () => {
    render(<ButtonLink href="#">Primary</ButtonLink>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-(--color-action-primary)");
  });

  it("applies secondary variant", () => {
    render(
      <ButtonLink href="#" variant="secondary">
        Secondary
      </ButtonLink>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("border");
  });

  it("renders iconLeft", () => {
    const { container } = render(
      <ButtonLink href="#" iconLeft={Mail}>
        Send
      </ButtonLink>,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(1);
  });

  it("renders iconRight", () => {
    const { container } = render(
      <ButtonLink href="#" iconRight={ArrowRight}>
        Next
      </ButtonLink>,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(1);
  });

  it("applies custom className", () => {
    render(
      <ButtonLink href="#" className="ml-4">
        Styled
      </ButtonLink>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("ml-4");
  });
});

describe("IconButtonLink", () => {
  it("renders as a link with aria-label", () => {
    render(
      <IconButtonLink href="#" icon={Settings} aria-label="Settings" />,
    );
    expect(screen.getByRole("link", { name: "Settings" })).toBeDefined();
  });

  it("renders the icon", () => {
    const { container } = render(
      <IconButtonLink href="#" icon={Settings} aria-label="Settings" />,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("applies ghost variant by default", () => {
    render(
      <IconButtonLink href="#" icon={Settings} aria-label="Settings" />,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-transparent");
  });
});
