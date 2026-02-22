import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";
import { FileText, Image, Settings, Database, Globe } from "lucide-react";
import { Tree } from "./Tree";
import type { TreeNode } from "./Tree";

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

const fileTree: TreeNode[] = [
  {
    id: "docs",
    name: "Documents",
    children: [
      { id: "docs-report", name: "Annual Report.pdf" },
      { id: "docs-summary", name: "Executive Summary.docx" },
      {
        id: "docs-legal",
        name: "Legal",
        children: [
          { id: "docs-legal-nda", name: "NDA Template.pdf" },
          { id: "docs-legal-terms", name: "Terms of Service.md" },
        ],
      },
    ],
  },
  {
    id: "images",
    name: "Images",
    children: [
      { id: "img-logo", name: "logo.svg" },
      { id: "img-banner", name: "banner.png" },
    ],
  },
  {
    id: "data",
    name: "Data",
    children: [
      { id: "data-patients", name: "patients.csv" },
      { id: "data-results", name: "results.json" },
    ],
  },
  { id: "readme", name: "README.md" },
  { id: "config", name: ".eslintrc.json" },
];

const iconTree: TreeNode[] = [
  {
    id: "project",
    name: "cytario-web",
    children: [
      {
        id: "src",
        name: "src",
        children: [
          { id: "src-pages", name: "pages", icon: Globe, children: [
            { id: "src-pages-home", name: "Home.tsx", icon: FileText },
            { id: "src-pages-dashboard", name: "Dashboard.tsx", icon: FileText },
          ]},
          { id: "src-components", name: "components", icon: Settings, children: [
            { id: "src-comp-button", name: "Button.tsx", icon: FileText },
            { id: "src-comp-table", name: "Table.tsx", icon: FileText },
          ]},
        ],
      },
      { id: "assets", name: "assets", icon: Image, children: [
        { id: "assets-logo", name: "logo.svg", icon: Image },
      ]},
      { id: "db", name: "database.sql", icon: Database },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Tree> = {
  title: "Components/Tree",
  component: Tree,
  argTypes: {
    size: {
      control: "select",
      options: ["compact", "comfortable"],
    },
    selectionMode: {
      control: "select",
      options: ["none", "single", "multi", "checkbox"],
    },
  },
  args: {
    onSelectionChange: fn(),
    onActivate: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    data: fileTree,
    "aria-label": "File explorer",
    openByDefault: true,
  },
};

export const Checkbox: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<Set<string>>(new Set(["docs-report"]));
    return (
      <Tree
        {...args}
        selectedIds={selected}
        onSelectionChange={setSelected}
      />
    );
  },
  args: {
    data: fileTree,
    "aria-label": "File selection",
    selectionMode: "checkbox",
    openByDefault: true,
  },
};

export const Search: Story = {
  render: (args) => {
    const [term, setTerm] = useState("");
    return (
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search files..."
          className={[
            "px-3 py-2 border rounded-[var(--border-radius-md)]",
            "border-[var(--color-border-default)]",
            "text-[length:var(--font-size-sm)]",
            "outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]",
          ].join(" ")}
        />
        <Tree
          {...args}
          searchTerm={term}
          searchMatch={(node, t) =>
            node.name.toLowerCase().includes(t.toLowerCase())
          }
        />
      </div>
    );
  },
  args: {
    data: fileTree,
    "aria-label": "Searchable file tree",
    openByDefault: true,
  },
};

export const CustomIcons: Story = {
  args: {
    data: iconTree,
    "aria-label": "Project structure",
    openByDefault: true,
  },
};

export const Compact: Story = {
  args: {
    data: fileTree,
    "aria-label": "Compact file tree",
    size: "compact",
    openByDefault: true,
  },
};
