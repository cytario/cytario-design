import type { Meta, StoryObj } from "storybook/react";
import { Grid } from "./Grid";

const meta: Meta<typeof Grid> = {
  title: "Components/Grid",
  component: Grid,
  argTypes: {
    columns: { control: "select", options: [1, 2, 3, 4] },
    columnsAt: { control: "select", options: ["sm"] },
    gap: { control: "select", options: [1, 2, 3, 4, 6] },
    gapX: { control: "select", options: [1, 2, 3, 4, 6] },
    gapY: { control: "select", options: [1, 2, 3, 4, 6] },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

function Cell({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4 text-sm">
      {label}
    </div>
  );
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {([2, 3, 4] as const).map((columns) => (
        <div key={columns} className="flex flex-col gap-2">
          <span
            className="text-sm"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            columns={columns}
          </span>
          <Grid columns={columns} gap={2}>
            {Array.from({ length: columns * 2 }, (_, i) => (
              <Cell key={i} label={`Cell ${i + 1}`} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    columns: 2,
    gap: 4,
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from(
        { length: (args.columns ?? 1) * 2 },
        (_, i) => <Cell key={i} label={`Cell ${i + 1}`} />,
      )}
    </Grid>
  ),
};

export const PerAxisGap: Story = {
  render: () => (
    <Grid columns={2} gapX={6} gapY={1}>
      {Array.from({ length: 4 }, (_, i) => (
        <Cell key={i} label={`Cell ${i + 1}`} />
      ))}
    </Grid>
  ),
};

export const GapScale: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {([1, 2, 3, 4, 6] as const).map((gap) => (
        <div key={gap} className="flex flex-col gap-2">
          <span
            className="text-sm"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            gap={gap}
          </span>
          <Grid columns={2} gap={gap}>
            <Cell label="A" />
            <Cell label="B" />
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const Interaction: Story = {
  render: () => (
    <Grid columns={2} gap={4}>
      <button type="button">First action</button>
      <button type="button">Second action</button>
    </Grid>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Second action" }));
    await expect(canvas.getByRole("button", { name: "Second action" })).toHaveFocus();
  },
};
