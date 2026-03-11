import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";

function renderTabs(props: Record<string, unknown> = {}) {
  return render(
    <Tabs {...props}>
      <TabList aria-label="Test tabs">
        <Tab id="one">One</Tab>
        <Tab id="two">Two</Tab>
        <Tab id="three">Three</Tab>
      </TabList>
      <TabPanel id="one">Panel one</TabPanel>
      <TabPanel id="two">Panel two</TabPanel>
      <TabPanel id="three">Panel three</TabPanel>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("renders tabs with correct roles", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeDefined();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel")).toBeDefined();
  });

  it("shows correct panel on tab click", async () => {
    renderTabs();
    const user = userEvent.setup();

    // First tab is selected by default
    expect(screen.getByText("Panel one")).toBeDefined();

    // Click the second tab
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByText("Panel two")).toBeDefined();
  });

  it("navigates tabs with arrow keys", async () => {
    renderTabs();
    const user = userEvent.setup();

    // Focus the first tab
    await user.click(screen.getByRole("tab", { name: "One" }));

    // Arrow right moves to second tab
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    // Automatic activation means the panel also changes
    expect(screen.getByText("Panel two")).toBeDefined();

    // Arrow right moves to third tab
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
    expect(screen.getByText("Panel three")).toBeDefined();
  });

  it("skips disabled tabs during keyboard navigation", async () => {
    render(
      <Tabs>
        <TabList aria-label="With disabled">
          <Tab id="a">A</Tab>
          <Tab id="b" isDisabled>
            B
          </Tab>
          <Tab id="c">C</Tab>
        </TabList>
        <TabPanel id="a">Panel A</TabPanel>
        <TabPanel id="b">Panel B</TabPanel>
        <TabPanel id="c">Panel C</TabPanel>
      </Tabs>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("tab", { name: "A" }));
    await user.keyboard("{ArrowRight}");

    // Should skip B (disabled) and land on C
    expect(screen.getByRole("tab", { name: "C" })).toHaveFocus();
  });

  it("works in controlled mode", async () => {
    const onSelectionChange = vi.fn();

    function ControlledWrapper() {
      return (
        <Tabs
          selectedKey="two"
          onSelectionChange={onSelectionChange}
        >
          <TabList aria-label="Controlled">
            <Tab id="one">One</Tab>
            <Tab id="two">Two</Tab>
          </TabList>
          <TabPanel id="one">Panel one</TabPanel>
          <TabPanel id="two">Panel two</TabPanel>
        </Tabs>
      );
    }

    render(<ControlledWrapper />);
    const user = userEvent.setup();

    // Second tab should be selected initially
    expect(screen.getByText("Panel two")).toBeDefined();

    // Click first tab triggers callback
    await user.click(screen.getByRole("tab", { name: "One" }));
    expect(onSelectionChange).toHaveBeenCalledWith("one");
  });

  it("supports underline variant", () => {
    renderTabs({ variant: "underline" });
    const tab = screen.getByRole("tab", { name: "One" });
    // Underline variant selected tab should have relative positioning for indicator
    expect(tab.className).toContain("relative");
  });

  it("supports pills variant", () => {
    renderTabs({ variant: "pills" });
    const tablist = screen.getByRole("tablist");
    // Pills variant tablist has the muted surface background
    expect(tablist.className).toContain("bg-(--color-surface-muted)");
  });

  it("consumer className overrides internal styles via twMerge", () => {
    render(
      <Tabs>
        <TabList aria-label="Override test">
          <Tab id="a" className="bg-red-500 text-white">
            A
          </Tab>
        </TabList>
        <TabPanel id="a">Panel A</TabPanel>
      </Tabs>,
    );
    const tab = screen.getByRole("tab", { name: "A" });
    // twMerge should let consumer's bg-red-500 win over internal bg-transparent
    expect(tab.className).toContain("bg-red-500");
    expect(tab.className).not.toContain("bg-transparent");
  });

  it("unstyled variant applies no visual styles to Tab", () => {
    render(
      <Tabs variant="unstyled">
        <TabList aria-label="Unstyled test">
          <Tab id="a">A</Tab>
        </TabList>
        <TabPanel id="a">Panel A</TabPanel>
      </Tabs>,
    );
    const tab = screen.getByRole("tab", { name: "A" });
    // Should have accessibility/interaction styles
    expect(tab.className).toContain("cursor-pointer");
    expect(tab.className).toContain("outline-none");
    // Should NOT have design system visual styles
    expect(tab.className).not.toContain("text-(--color-text-secondary)");
    expect(tab.className).not.toContain("bg-transparent");
    expect(tab.className).not.toContain("px-4");
  });

  it("unstyled variant TabList has minimal styles", () => {
    render(
      <Tabs variant="unstyled">
        <TabList aria-label="Unstyled list test">
          <Tab id="a">A</Tab>
        </TabList>
        <TabPanel id="a">Panel A</TabPanel>
      </Tabs>,
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toContain("flex");
    expect(tablist.className).not.toContain("border-b");
    expect(tablist.className).not.toContain("bg-(--color-surface-muted)");
  });

  it("unstyled variant TabPanel has no margin", () => {
    render(
      <Tabs variant="unstyled">
        <TabList aria-label="Unstyled panel test">
          <Tab id="a">A</Tab>
        </TabList>
        <TabPanel id="a">Panel A</TabPanel>
      </Tabs>,
    );
    const panel = screen.getByRole("tabpanel");
    expect(panel.className).toContain("outline-none");
    expect(panel.className).not.toContain("mt-4");
  });

  it("disabled tab cannot be clicked", async () => {
    const onSelectionChange = vi.fn();
    render(
      <Tabs onSelectionChange={onSelectionChange}>
        <TabList aria-label="With disabled">
          <Tab id="a">A</Tab>
          <Tab id="b" isDisabled>
            B
          </Tab>
        </TabList>
        <TabPanel id="a">Panel A</TabPanel>
        <TabPanel id="b">Panel B</TabPanel>
      </Tabs>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("tab", { name: "B" }));
    // Selection should not have changed to B
    expect(onSelectionChange).not.toHaveBeenCalledWith("b");
  });
});
