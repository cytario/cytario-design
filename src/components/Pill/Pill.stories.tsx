import type { Meta, StoryObj } from "storybook/react";
import { Pill } from "./Pill";
import { GroupPill } from "./GroupPill";

/* ------------------------------------------------------------------ */
/*  Pill meta                                                          */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Pill> = {
  title: "Components/Pill",
  component: Pill,
  argTypes: {
    color: {
      control: "select",
      options: [
        "auto",
        "neutral",
        "purple",
        "teal",
        "rose",
        "slate",
        "green",
        "amber",
      ],
    },
  },
  args: {
    children: "Label",
  },
};

export default meta;
type Story = StoryObj<typeof Pill>;

/* ------------------------------------------------------------------ */
/*  Default                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    children: "Tag",
    name: "Tag",
  },
};

/* ------------------------------------------------------------------ */
/*  Hash Colors -- grid showing deterministic color for various names  */
/* ------------------------------------------------------------------ */

const sampleNames = [
  "Admins",
  "Viewers",
  "Editors",
  "Pathology",
  "Research",
  "Engineering",
  "QA",
  "Regulatory",
  "Clinical",
  "Marketing",
  "Sales",
  "Support",
  "DevOps",
  "Data Science",
  "Product",
  "Design",
];

export const HashColors: Story = {
  name: "Hash Colors",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {sampleNames.map((name) => (
        <Pill key={name} name={name}>
          {name}
        </Pill>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Explicit color overrides                                           */
/* ------------------------------------------------------------------ */

const colorVariants = [
  "neutral",
  "purple",
  "teal",
  "rose",
  "slate",
  "green",
  "amber",
] as const;

export const AllColors: Story = {
  name: "All Colors",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {colorVariants.map((color) => (
        <Pill key={color} color={color}>
          {color}
        </Pill>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  GroupPill -- default (3 visible segments)                          */
/* ------------------------------------------------------------------ */

export const GroupPillDefault: Story = {
  name: "GroupPill",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <GroupPill path="/cytario/engineering/frontend" />
      <GroupPill path="/cytario/pathology/research" />
      <GroupPill path="/cytario/clinical/regulatory" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  GroupPill -- collapsed (long paths with hidden leading segments)   */
/* ------------------------------------------------------------------ */

export const GroupPillCollapsed: Story = {
  name: "GroupPill Collapsed",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <GroupPill
        path="/cytario/engineering/platform/infrastructure/frontend"
        visibleCount={2}
      />
      <GroupPill
        path="/cytario/pathology/spatial-biology/analysis/QA"
        visibleCount={3}
      />
      <GroupPill
        path="/org/division/department/team/sub-team/role"
        visibleCount={2}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Status Pills -- Active / Disabled like in the users table          */
/* ------------------------------------------------------------------ */

export const StatusPills: Story = {
  name: "Status Pills",
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Pill color="green">Active</Pill>
      <Pill color="slate">Disabled</Pill>
      <Pill color="amber">Pending</Pill>
      <Pill color="rose">Suspended</Pill>
    </div>
  ),
};
