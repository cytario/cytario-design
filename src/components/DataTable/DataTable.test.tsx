import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";

import { DataTable, type CellRenderers, type ColumnConfig } from "./DataTable";

interface Row {
  id: string;
  name: string;
  kind: string;
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
];

const data: Row[] = [
  { id: "1", name: "Ccc", kind: "beta" },
  { id: "2", name: "Aaa", kind: "alpha" },
  { id: "3", name: "Bbb", kind: "beta" },
];

const cellRenderers: CellRenderers<Row> = {
  name: (row) => row.name,
  kind: (row) => row.kind,
};

function renderTable(tableId: string) {
  return render(
    <DataTable
      columns={columns}
      data={data}
      cellRenderers={cellRenderers}
      tableId={tableId}
      ariaLabel="Test table"
    />,
  );
}

describe("DataTable", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders one row per data entry with column headers", async () => {
    renderTable("dt-basic");
    expect(await screen.findAllByText(/^(Aaa|Bbb|Ccc)$/)).toHaveLength(3);
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Kind")).toBeTruthy();
  });

  it("sorts rows when a sortable header is clicked", async () => {
    renderTable("dt-sort");
    const head = screen.getByRole("button", { name: "Name" });
    // Anchor column defaults to ascending — the first click flips to descending.
    await userEvent.click(head);
    await waitFor(() => {
      const cells = screen.getAllByText(/^(Aaa|Bbb|Ccc)$/);
      expect(cells.map((c) => c.textContent)).toEqual(["Ccc", "Bbb", "Aaa"]);
    });
    await userEvent.click(head);
    await waitFor(() => {
      const cells = screen.getAllByText(/^(Aaa|Bbb|Ccc)$/);
      expect(cells.map((c) => c.textContent)).toEqual(["Aaa", "Bbb", "Ccc"]);
    });
  });

  it("narrows rows via a text column filter and announces the count", async () => {
    renderTable("dt-filter");
    const input = screen.getByLabelText("Filter by Name");
    await userEvent.type(input, "aa");
    await waitFor(() => expect(screen.getByText("Aaa")).toBeTruthy());
    expect(screen.queryByText("Bbb")).toBeNull();
    expect(screen.queryByText("Ccc")).toBeNull();
    expect(screen.getByText("Showing 1 of 3 rows")).toBeTruthy();
  });

  it("renders the empty state when the data is empty", async () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        cellRenderers={cellRenderers}
        tableId="dt-empty"
        ariaLabel="Empty table"
      />,
    );
    expect(await screen.findByText("No results")).toBeTruthy();
  });
});
