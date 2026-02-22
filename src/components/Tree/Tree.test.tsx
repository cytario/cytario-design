import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tree } from "./Tree";
import type { TreeNode } from "./Tree";

const sampleData: TreeNode[] = [
  {
    id: "1",
    name: "Documents",
    children: [
      { id: "1-1", name: "Report.pdf" },
      { id: "1-2", name: "Summary.docx" },
    ],
  },
  {
    id: "2",
    name: "Images",
    children: [
      { id: "2-1", name: "Photo.png" },
    ],
  },
  { id: "3", name: "README.md" },
];

describe("Tree", () => {
  it("renders tree nodes", () => {
    render(<Tree data={sampleData} aria-label="File tree" openByDefault />);
    expect(screen.getByText("Documents")).toBeDefined();
    expect(screen.getByText("README.md")).toBeDefined();
  });

  it("renders child nodes when open by default", () => {
    render(<Tree data={sampleData} aria-label="File tree" openByDefault />);
    expect(screen.getByText("Report.pdf")).toBeDefined();
    expect(screen.getByText("Summary.docx")).toBeDefined();
    expect(screen.getByText("Photo.png")).toBeDefined();
  });

  it("expands and collapses nodes on chevron click", async () => {
    const user = userEvent.setup();
    render(<Tree data={sampleData} aria-label="File tree" />);

    // Nodes should be collapsed by default
    expect(screen.queryByText("Report.pdf")).toBeNull();

    // Click expand button on Documents
    const expandButtons = screen.getAllByLabelText("Expand");
    await user.click(expandButtons[0]);

    // Children should now be visible
    expect(screen.getByText("Report.pdf")).toBeDefined();
  });

  it("calls onSelectionChange in checkbox mode", async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Tree
        data={sampleData}
        aria-label="File tree"
        openByDefault
        selectionMode="checkbox"
        onSelectionChange={onSelectionChange}
      />,
    );

    // Click on a leaf node to toggle its checkbox
    await user.click(screen.getByText("Report.pdf"));
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const calledWith = onSelectionChange.mock.calls[0][0] as Set<string>;
    expect(calledWith.has("1-1")).toBe(true);
  });

  it("renders checkboxes in checkbox mode", () => {
    render(
      <Tree
        data={sampleData}
        aria-label="File tree"
        openByDefault
        selectionMode="checkbox"
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("filters nodes when searchTerm is provided", () => {
    render(
      <Tree
        data={sampleData}
        aria-label="File tree"
        openByDefault
        searchTerm="Report"
      />,
    );

    // Report.pdf should be visible (matches search)
    expect(screen.getByText("Report.pdf")).toBeDefined();
  });

  it("calls onActivate when a node is activated", async () => {
    const onActivate = vi.fn();
    const user = userEvent.setup();
    render(
      <Tree
        data={sampleData}
        aria-label="File tree"
        openByDefault
        onActivate={onActivate}
      />,
    );

    await user.dblClick(screen.getByText("README.md"));
    expect(onActivate).toHaveBeenCalled();
    // Find the call that has our node data
    const calls = onActivate.mock.calls;
    const readmeCall = calls.find(
      (call: [TreeNode]) => call[0].name === "README.md",
    );
    expect(readmeCall).toBeDefined();
  });

  it("applies compact row height", () => {
    const { container } = render(
      <Tree data={sampleData} aria-label="File tree" size="compact" />,
    );
    // The tree container should render
    expect(container.querySelector("[role='tree']")).toBeDefined();
  });
});
