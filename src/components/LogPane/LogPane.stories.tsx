import type { Meta, StoryObj } from "storybook/react";
import { expect, within } from "storybook/test";
import { LogPane } from "./LogPane";

const meta: Meta<typeof LogPane> = {
  title: "Components/LogPane",
  component: LogPane,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    isFixedHeight: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    label: "Log output",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof LogPane>;

const sizes = ["sm", "md", "lg"] as const;

const sampleLines = [
  { message: "\u001b[0;93mJob 2026-0215-1 started\u001b[m" },
  { message: "\u001b[36mcytario.worker\u001b[0m - \u001b[33mpulling image\u001b[0m" },
  { message: "\u001b[36mcytario.worker\u001b[0m - \u001b[32mimage pulled\u001b[0m" },
  { message: "\u001b[36mcytario.worker\u001b[0m - \u001b[33mloading slide 042\u001b[0m" },
  { message: "progress 47% of 2,104 tiles\u001b[2K" },
  { message: "\u001b[36mcytario.worker\u001b[0m - \u001b[31mfailed: tile 1189 unreadable\u001b[0m" },
  { message: "\u001b[1;4mretry 1/3\u001b[22;24m scheduled\u001b[m" },
  { message: "\u001b[38;5;196mexplicit 256-color red diagnostic\u001b[m" },
  { message: "\u001b[38;2;125;184;245mexplicit truecolor blue diagnostic\u001b[m" },
  { message: "\u001b[2mstep 7/9 dimmed\u001b[22m and back\u001b[m" },
  { message: "\u001b[3mworker note in italics\u001b[23m\u001b[m" },
  { message: "\u001b[90mheartbeat\u001b[97m bright white\u001b[m plain tail" },
];

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex flex-col gap-6">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            {size} — max height {size === "sm" ? "12rem" : size === "md" ? "24rem" : "36rem"}
          </span>
          <LogPane size={size} lines={sampleLines} />
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    size: "md",
    isFixedHeight: false,
    label: "Log output",
    lines: sampleLines,
  },
};

// --- Real-world byte patterns the grid cannot express ---

export const ContainerLog: Story = {
  name: "Container log",
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    // A realistic container-log excerpt: a chatty worker that color-codes its
    // logger name and severity on every line, plus an actual failed run —
    // the byte patterns the pane must render, not escape.
    const lines = [
      ...Array.from({ length: 200 }, (_, i) => ({
        message: `\u001b[36mcytario.worker\u001b[0m - \u001b[33mstep ${i + 1}/200 pulling layer ${((i * 37) % 89).toString().padStart(2, "0")}\u001b[0m`,
      })),
      { message: "layer cache warm\u001b[2K continuing" },
      { message: "\u001b[0;93mJob 2026-0215-1 FAILED: provider rejected submission\u001b[m" },
    ];
    return <LogPane label="Container log" lines={lines} />;
  },
};

export const UnrecognizedSequences: Story = {
  name: "Unrecognized sequences are consumed",
  render: () => (
    <LogPane
      label="Log with control bytes"
      lines={[
        { message: "a\u001b[2Kb — erase-line, consumed" },
        { message: "cursor move \u001b[1;32Hconsumed" },
        { message: "hide cursor \u001b[?25l consumed" },
        { message: "title set \u001b]0;worker\u0007 then text" },
        { message: "unterminated OSC \u001b]8;;http://x" },
        { message: "truncated CSI at end\u001b[3" },
        { message: "lone escape\u001b" },
      ]}
    />
  ),
};

export const Empty: Story = {
  name: "No output",
  render: () => (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">
        With no lines the pane renders nothing — pair it with the consumer's
        empty state:
      </span>
      <p className="rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground">
        No log output yet.
      </p>
    </div>
  ),
};

// --- Interaction test ---

export const ColorInteraction: Story = {
  name: "Colors apply to the right span",
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    lines: [
      { message: "\u001b[36mcytario.worker\u001b[0m - \u001b[33mpulling image\u001b[0m" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pane = canvas.getByRole("region", { name: "Log output" });

    // The color lands on the exact span it expresses, not the whole pane.
    const cyanSpan = canvas.getByText("cytario.worker");
    await expect(cyanSpan.style.color).toBe("rgb(111, 201, 212)");
    const yellowSpan = canvas.getByText("pulling image");
    await expect(yellowSpan.style.color).toBe("rgb(232, 205, 138)");

    // No escape byte survives into the rendered text.
    await expect(pane.textContent).not.toContain("\u001b");
  },
};
