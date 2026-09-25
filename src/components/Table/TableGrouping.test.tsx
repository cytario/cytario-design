import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";

import { Table, type CellRenderers, type ColumnConfig, type GroupCellRenderers } from "./Table";

interface Job {
  id: string;
  name: string;
  kind: string;
  batch: string;
}

const columns: ColumnConfig[] = [
  {
    id: "name",
    header: "Name",
    size: 200,
    enableSorting: true,
    anchor: true,
    enableColumnFilter: true,
    filterType: "text",
  },
  {
    id: "kind",
    header: "Kind",
    size: 140,
    enableSorting: true,
    enableColumnFilter: true,
    filterType: "select",
    filterOptions: [
      { label: "Alpha", value: "alpha" },
      { label: "Beta", value: "beta" },
    ],
  },
  { id: "batch", header: "Batch", size: 120, enableSorting: false },
];

// Two multi-row groups (b1, b2) plus a singleton (solo) — a group of one has
// nothing to roll up and must read as a plain row.
const data: Job[] = [
  { id: "1", name: "Ccc", kind: "beta", batch: "b1" },
  { id: "2", name: "Aaa", kind: "alpha", batch: "b1" },
  { id: "3", name: "Bbb", kind: "beta", batch: "b2" },
  { id: "4", name: "Ddd", kind: "alpha", batch: "b2" },
  { id: "5", name: "Eee", kind: "beta", batch: "solo" },
];

const cellRenderers: CellRenderers<Job> = {
  name: (row) => row.name,
  kind: (row) => row.kind,
  batch: (row) => row.batch,
};

/** The group's own cells — a count in the Kind column, nothing elsewhere. */
const groupCellRenderers: GroupCellRenderers<Job> = {
  kind: (group) => <span>{group.count} jobs</span>,
};

function renderGroupedTable(tableId: string, defaultExpandedGroups = true) {
  return render(
    <Table
      columns={columns}
      data={data}
      cellRenderers={cellRenderers}
      tableId={tableId}
      ariaLabel="Grouped test table"
      groupBy="batch"
      groupCellRenderers={groupCellRenderers}
      defaultExpandedGroups={defaultExpandedGroups}
    />,
  );
}

describe("Table grouping", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders a group row per distinct value, with the leaf rows intact", async () => {
    renderGroupedTable("grouped-basic");
    // A toggle per multi-row group, labelled by the group's value.
    expect(await screen.findByRole("button", { name: /group b1$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /group b2$/ })).toBeInTheDocument();
    // The leaves are the table's real rows — their own cells, not a list.
    for (const name of ["Ccc", "Aaa", "Bbb", "Ddd", "Eee"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    // The group's own cells come from the renderer — both groups have two
    // leaves, so "2 jobs" appears once per group.
    expect(screen.getAllByText("2 jobs").length).toBe(2);
  });

  it("renders a group with one leaf as a plain row, with no toggle", async () => {
    renderGroupedTable("grouped-singleton");
    await screen.findByRole("button", { name: /group b1$/ });
    // The singleton's row is present as an ordinary row...
    const soloRow = screen.getByText("Eee").closest("tr")!;
    expect(soloRow.getAttribute("data-group-row")).toBeNull();
    // ...carrying its column's value, and offering no expand toggle.
    expect(within(soloRow).getByText("solo")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^solo$/ })).not.toBeInTheDocument();
  });

  it("keeps the group row in the column grid, aligned with a leaf row", async () => {
    renderGroupedTable("grouped-grid");
    await screen.findByRole("button", { name: /group b1$/ });
    // The group row is a row in the grid with the same cell count as a leaf
    // row — not a single full-width band — so the columns line up.
    const groupRow = screen.getByRole("button", { name: /group b1$/ }).closest("tr")!;
    const leafRow = screen.getByText("Aaa").closest("tr")!;
    expect(groupRow.getAttribute("data-group-row")).not.toBeNull();
    expect(within(groupRow).getAllByRole("cell").length).toBe(
      within(leafRow).getAllByRole("cell").length,
    );
  });

  it("collapses and expands a group via its toggle", async () => {
    const user = userEvent.setup();
    renderGroupedTable("grouped-toggle");

    const toggle = await screen.findByRole("button", { name: /group b1$/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Ccc")).toBeInTheDocument();

    await user.click(toggle);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /group b1$/ }).getAttribute("aria-expanded"),
      ).toBe("false"),
    );
    // b1's leaves are gone; b2's remain.
    expect(screen.queryByText("Ccc")).not.toBeInTheDocument();
    expect(screen.queryByText("Aaa")).not.toBeInTheDocument();
    expect(screen.getByText("Bbb")).toBeInTheDocument();
  });

  it("starts collapsed when defaultExpandedGroups is false", async () => {
    const user = userEvent.setup();
    renderGroupedTable("grouped-collapsed", false);
    const toggle = await screen.findByRole("button", { name: /group b1$/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("Ccc")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(await screen.findByText("Ccc")).toBeInTheDocument();
  });

  it("drops filtered-out leaves, collapsing a group to a plain row when one remains", async () => {
    const user = userEvent.setup();
    renderGroupedTable("grouped-filter");

    // b1 has one alpha leaf of two; b2 has one alpha of two; the solo job is
    // beta. Filter to kind=alpha.
    await user.click(await screen.findByRole("button", { name: "Filter by Kind" }));
    const selectTrigger = await screen.findByRole("button", {
      name: /alpha|all|select/i,
      hidden: true,
    });
    await user.click(selectTrigger);
    const options = await screen.findAllByRole("option", { name: "Alpha", hidden: true });
    await user.click(options[options.length - 1]!);
    // Close the popover — while open it is a modal dialog and hides the table
    // from role queries.
    await user.keyboard("{Escape}");

    // The beta-only rows are gone...
    await waitFor(() => {
      expect(screen.queryByText("Ccc")).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Bbb")).not.toBeInTheDocument();
    expect(screen.queryByText("Eee")).not.toBeInTheDocument();
    // ...leaving each group with a single leaf, which renders as a plain row
    // (nothing to roll up) — so no group toggles remain.
    expect(screen.queryByRole("button", { name: /group b1$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /group b2$/ })).not.toBeInTheDocument();
    expect(screen.getByText("Aaa")).toBeInTheDocument();
    expect(screen.getByText("Ddd")).toBeInTheDocument();
  });

  it("carries keyboard row navigation across a group row, and Enter toggles it", async () => {
    const user = userEvent.setup();
    renderGroupedTable("grouped-keyboard");
    await screen.findByRole("button", { name: /group b1$/ });

    // The group row is focusable — arrow navigation from a leaf reaches it
    // (focus does not drop off the table).
    const leafRow = screen.getByText("Aaa").closest("tr")!;
    leafRow.focus();
    await user.keyboard("{ArrowUp}");
    const groupRow = screen.getByRole("button", { name: /group b1$/ }).closest("tr")!;
    expect(document.activeElement).toBe(groupRow);

    // Enter on the group row collapses it — same as clicking the toggle.
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /group b1$/ }).getAttribute("aria-expanded"),
      ).toBe("false"),
    );
    expect(screen.queryByText("Aaa")).not.toBeInTheDocument();
  });
});
