import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Table, TableHeader, Column, TableBody, Row, Cell } from "./Table";

/* ------------------------------------------------------------------ */
/*  Sample data — pathology cases                                      */
/* ------------------------------------------------------------------ */

interface PathologyCase {
  id: number;
  caseId: string;
  patient: string;
  status: string;
  priority: string;
}

const cases: PathologyCase[] = [
  { id: 1, caseId: "CYT-2024-0012", patient: "M. Schmidt",  status: "In Review",  priority: "High" },
  { id: 2, caseId: "CYT-2024-0034", patient: "A. Mueller",  status: "Completed",  priority: "Normal" },
  { id: 3, caseId: "CYT-2024-0056", patient: "K. Fischer",  status: "Pending",    priority: "Urgent" },
  { id: 4, caseId: "CYT-2024-0078", patient: "L. Weber",    status: "In Review",  priority: "Normal" },
  { id: 5, caseId: "CYT-2024-0091", patient: "S. Braun",    status: "Completed",  priority: "Low" },
  { id: 6, caseId: "CYT-2024-0103", patient: "T. Wagner",   status: "Pending",    priority: "High" },
];

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  argTypes: {
    size: {
      control: "select",
      options: ["compact", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: { size: "comfortable" },
  render: (args) => (
    <Table aria-label="Pathology cases" size={args.size}>
      <TableHeader>
        <Column id="caseId" isRowHeader>Case ID</Column>
        <Column id="patient">Patient</Column>
        <Column id="status">Status</Column>
        <Column id="priority">Priority</Column>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <Row key={c.id}>
            <Cell>{c.caseId}</Cell>
            <Cell>{c.patient}</Cell>
            <Cell>{c.status}</Cell>
            <Cell>{c.priority}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Compact: Story = {
  args: { size: "compact" },
  render: (args) => (
    <Table aria-label="Pathology cases" size={args.size}>
      <TableHeader>
        <Column id="caseId" isRowHeader>Case ID</Column>
        <Column id="patient">Patient</Column>
        <Column id="status">Status</Column>
        <Column id="priority">Priority</Column>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <Row key={c.id}>
            <Cell>{c.caseId}</Cell>
            <Cell>{c.patient}</Cell>
            <Cell>{c.status}</Cell>
            <Cell>{c.priority}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Sortable                                                           */
/* ------------------------------------------------------------------ */

function SortableTable({ size }: { size?: "compact" | "comfortable" }) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "caseId",
    direction: "ascending",
  });

  const sorted = [...cases].sort((a, b) => {
    const col = sortDescriptor.column as keyof PathologyCase;
    const first = a[col];
    const second = b[col];
    let cmp = first < second ? -1 : first > second ? 1 : 0;
    if (sortDescriptor.direction === "descending") cmp = -cmp;
    return cmp;
  });

  return (
    <Table
      aria-label="Sortable pathology cases"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      size={size}
    >
      <TableHeader>
        <Column id="caseId" isRowHeader allowsSorting>Case ID</Column>
        <Column id="patient" allowsSorting>Patient</Column>
        <Column id="status" allowsSorting>Status</Column>
        <Column id="priority" allowsSorting>Priority</Column>
      </TableHeader>
      <TableBody>
        {sorted.map((c) => (
          <Row key={c.id}>
            <Cell>{c.caseId}</Cell>
            <Cell>{c.patient}</Cell>
            <Cell>{c.status}</Cell>
            <Cell>{c.priority}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

export const Sortable: Story = {
  render: (args) => <SortableTable size={args.size} />,
  args: { size: "comfortable" },
};

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

export const Empty: Story = {
  render: (args) => (
    <Table aria-label="Empty table" size={args.size}>
      <TableHeader>
        <Column id="caseId" isRowHeader>Case ID</Column>
        <Column id="patient">Patient</Column>
        <Column id="status">Status</Column>
        <Column id="priority">Priority</Column>
      </TableHeader>
      <TableBody renderEmptyState={() => (
        <div className="px-3 py-8 text-center text-[var(--color-text-tertiary)]">
          No cases found.
        </div>
      )}>
        {[]}
      </TableBody>
    </Table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction test — sorting changes row order                       */
/* ------------------------------------------------------------------ */

export const SortInteraction: Story = {
  render: () => <SortableTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Default sort is caseId ascending — first row should be CYT-2024-0012
    const rows = canvas.getAllByRole("row");
    // rows[0] is the header row, rows[1] is the first data row
    expect(rows[1]).toHaveTextContent("CYT-2024-0012");

    // Click Patient column to sort by patient ascending
    const patientHeader = canvas.getByRole("columnheader", { name: /Patient/i });
    await userEvent.click(patientHeader);

    const rowsAfter = canvas.getAllByRole("row");
    // A. Mueller should be first after ascending sort on patient
    expect(rowsAfter[1]).toHaveTextContent("A. Mueller");
  },
};
