import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Table, TableHeader, Column, TableBody, Row, Cell } from "./Table";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface Item {
  id: number;
  name: string;
  value: number;
}

const items: Item[] = [
  { id: 1, name: "Alpha", value: 30 },
  { id: 2, name: "Beta",  value: 10 },
  { id: 3, name: "Gamma", value: 20 },
];

function BasicTable() {
  return (
    <Table aria-label="Test table">
      <TableHeader>
        <Column id="name" isRowHeader>Name</Column>
        <Column id="value">Value</Column>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <Row key={item.id}>
            <Cell>{item.name}</Cell>
            <Cell>{item.value}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

function SortableTable() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sorted = [...items].sort((a, b) => {
    const col = sortDescriptor.column as keyof Item;
    const first = a[col];
    const second = b[col];
    let cmp = first < second ? -1 : first > second ? 1 : 0;
    if (sortDescriptor.direction === "descending") cmp = -cmp;
    return cmp;
  });

  return (
    <Table
      aria-label="Sortable test table"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader>
        <Column id="name" isRowHeader allowsSorting>Name</Column>
        <Column id="value" allowsSorting>Value</Column>
      </TableHeader>
      <TableBody>
        {sorted.map((item) => (
          <Row key={item.id}>
            <Cell>{item.name}</Cell>
            <Cell>{item.value}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("Table", () => {
  it("renders all rows", () => {
    render(<BasicTable />);
    const rows = screen.getAllByRole("row");
    // 1 header row + 3 data rows
    expect(rows.length).toBe(4);
  });

  it("renders correct cell content", () => {
    render(<BasicTable />);
    expect(screen.getByText("Alpha")).toBeDefined();
    expect(screen.getByText("Beta")).toBeDefined();
    expect(screen.getByText("Gamma")).toBeDefined();
  });

  it("renders column headers", () => {
    render(<BasicTable />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Value" })).toBeDefined();
  });

  it("sorts rows when column header is clicked", async () => {
    render(<SortableTable />);

    // Default: ascending by name -> Alpha, Beta, Gamma
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alpha");
    expect(rows[3]).toHaveTextContent("Gamma");

    // Click Name header to toggle to descending
    const nameHeader = screen.getByRole("columnheader", { name: /Name/i });
    await userEvent.click(nameHeader);

    rows = screen.getAllByRole("row");
    // Descending: Gamma, Beta, Alpha
    expect(rows[1]).toHaveTextContent("Gamma");
    expect(rows[3]).toHaveTextContent("Alpha");
  });

  it("sorts by a different column when clicked", async () => {
    render(<SortableTable />);

    // Click Value header to sort ascending by value
    const valueHeader = screen.getByRole("columnheader", { name: /Value/i });
    await userEvent.click(valueHeader);

    const rows = screen.getAllByRole("row");
    // Ascending by value: 10 (Beta), 20 (Gamma), 30 (Alpha)
    expect(rows[1]).toHaveTextContent("Beta");
    expect(rows[2]).toHaveTextContent("Gamma");
    expect(rows[3]).toHaveTextContent("Alpha");
  });

  it("includes selected-state styling on rows", () => {
    render(
      <Table aria-label="Selection table">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell>Only</Cell>
          </Row>
        </TableBody>
      </Table>,
    );
    const row = screen.getAllByRole("row")[1];
    // Selected-state classes are part of the Row's base styles so they
    // survive in the built CSS without relying on consumer Tailwind.
    expect(row.className).toContain("data-[selected]:bg-accent");
    expect(row.className).toContain("data-[selected]:ring-2");
  });

  it("consumer className overrides internal row styles via twMerge", () => {
    render(
      <Table aria-label="Custom table">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          <Row className="hover:bg-red-200">
            <Cell>Only</Cell>
          </Row>
        </TableBody>
      </Table>,
    );
    const row = screen.getAllByRole("row")[1];
    // twMerge should let consumer's hover:bg-red-200 win over internal hover:bg-muted
    expect(row.className).toContain("hover:bg-red-200");
    expect(row.className).not.toContain("hover:bg-muted");
    // Non-conflicting built-in classes survive
    expect(row.className).toContain("border-b");
  });
});
