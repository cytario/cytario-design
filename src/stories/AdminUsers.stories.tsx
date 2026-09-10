import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { UserPlus, Users, UsersRound, ShieldCheck, X } from "lucide-react";

import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import type { CellRenderers, ColumnConfig } from "../components/Table";
import { SelectionFooter } from "../components/Table";
import { Dialog } from "../components/Dialog";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { Fieldset } from "../components/Form/Fieldset";
import { EmptyState } from "../components/EmptyState";
import { PathPill } from "../components/PathPill";
import { SectionHeader } from "../components/SectionHeader";
import { Logo } from "../components/Logo";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UserRow {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
  adminGroups: string[];
  groups: string[];
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockUsers: UserRow[] = [
  {
    id: "u-001",
    name: "Maria Lang",
    email: "m.lang@cytario.com",
    enabled: true,
    adminGroups: ["/cytario/admins"],
    groups: ["/cytario", "/cytario/engineering"],
  },
  {
    id: "u-002",
    name: "Thomas Berger",
    email: "t.berger@cytario.com",
    enabled: true,
    adminGroups: [],
    groups: [
      "/cytario",
      "/cytario/engineering",
      "/cytario/engineering/platform",
    ],
  },
  {
    id: "u-003",
    name: "Sarah Chen",
    email: "s.chen@cytario.com",
    enabled: true,
    adminGroups: ["/cytario/engineering/admins"],
    groups: ["/cytario", "/cytario/engineering", "/cytario/product"],
  },
  {
    id: "u-004",
    name: "James Wilson",
    email: "j.wilson@cytario.com",
    enabled: false,
    adminGroups: [],
    groups: ["/cytario", "/cytario/product"],
  },
  {
    id: "u-005",
    name: "Elena Rossi",
    email: "e.rossi@cytario.com",
    enabled: true,
    adminGroups: [],
    groups: [
      "/cytario",
      "/cytario/engineering",
      "/cytario/engineering/frontend",
    ],
  },
  {
    id: "u-006",
    name: "David Kim",
    email: "d.kim@cytario.com",
    enabled: true,
    adminGroups: ["/cytario/admins", "/cytario/engineering/admins"],
    groups: ["/cytario", "/cytario/engineering"],
  },
  {
    id: "u-007",
    name: "Anika Patel",
    email: "a.patel@cytario.com",
    enabled: true,
    adminGroups: [],
    groups: ["/cytario", "/cytario/product", "/cytario/research"],
  },
  {
    id: "u-008",
    name: "Michael Reiter",
    email: "m.reiter@cytario.com",
    enabled: true,
    adminGroups: [],
    groups: ["/cytario", "/cytario/research"],
  },
];

function StatusPill({ enabled }: { enabled: boolean }) {
  return (
    <Badge color={enabled ? "green" : "slate"} size="sm">
      {enabled ? "Active" : "Disabled"}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Users table                                                        */
/* ------------------------------------------------------------------ */

const usersColumns: ColumnConfig[] = [
  { id: "name", header: "Name", size: 200, anchor: true, enableSorting: true },
  { id: "email", header: "Email", size: 240, enableSorting: true },
  { id: "enabled", header: "Status", size: 140, enableSorting: true },
  { id: "adminGroups", header: "Admin Groups", size: 260 },
  { id: "groups", header: "Groups", size: 300 },
];

const usersRenderers: CellRenderers<UserRow> = {
  name: (user) => (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="font-medium text-teal-700 hover:underline no-underline"
    >
      {user.name}
    </a>
  ),
  email: (user) => <span className="text-muted-foreground">{user.email}</span>,
  enabled: (user) => <StatusPill enabled={user.enabled} />,
  adminGroups: (user) => (
    <div className="flex flex-wrap gap-1">
      {user.adminGroups.map((path) => (
        <PathPill key={path}>{path}</PathPill>
      ))}
    </div>
  ),
  groups: (user) => (
    <div className="flex flex-wrap gap-1">
      {user.groups.map((path) => (
        <PathPill key={path}>{path}</PathPill>
      ))}
    </div>
  ),
};

function UsersTable({
  rowSelection,
  onRowSelectionChange,
  columns = usersColumns,
}: {
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  columns?: ColumnConfig[];
}) {
  return (
    <Table
      columns={columns}
      data={mockUsers}
      cellRenderers={usersRenderers}
      tableId="storybook-admin-users"
      ariaLabel="Users"
      enableRowSelection
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
      getRowId={(user) => user.id}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Invite user dialog                                                 */
/* ------------------------------------------------------------------ */

function InviteUserDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Invite User"
      size="md"
    >
      <Fieldset>
        <Input
          label="Email"
          description="The user will receive an invitation email."
          placeholder="user@example.com"
          size="lg"
        />
        <Select
          label="Groups"
          description="Select which groups the user should be added to."
          items={[
            { id: "/cytario", name: "/cytario" },
            { id: "/cytario/engineering", name: "/cytario/engineering" },
            { id: "/cytario/product", name: "/cytario/product" },
            { id: "/cytario/research", name: "/cytario/research" },
          ]}
        />
      </Fieldset>
      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border">
        <Button variant="secondary" onPress={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="primary" onPress={fn()}>
          Send Invitation
        </Button>
      </div>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Full Admin Users page                                              */
/* ------------------------------------------------------------------ */

function AdminUsersPage() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showInvite, setShowInvite] = useState(false);
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-card">
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <Logo color="#ffffff" scale={0.8} />
          <span className="text-sm text-slate-400">Admin</span>
          <span className="text-sm text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-300">Users</span>
        </div>
      </header>

      <div className="grow bg-background px-4 sm:px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="/cytario">
            <span className="text-sm text-muted-foreground">
              {mockUsers.length} users
            </span>
            <Input
              placeholder="Search users…"
              className="w-64"
              size="sm"
            />
            <Button variant="secondary" size="sm" iconLeft={UsersRound}>
              Bulk Invite
            </Button>
            <Button variant="primary" size="sm" iconLeft={UserPlus} onPress={() => setShowInvite(true)}>
              Invite User
            </Button>
          </SectionHeader>

          <UsersTable
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />

          {selectedCount > 0 && (
            <SelectionFooter
              selectedCount={selectedCount}
              totalCount={mockUsers.length}
              onReset={() => setRowSelection({})}
            >
              <Button variant="secondary" size="sm" iconLeft={ShieldCheck}>
                Add to Group
              </Button>
              <Button variant="destructive" size="sm" iconLeft={X}>
                Remove from Group
              </Button>
            </SelectionFooter>
          )}
        </div>
      </div>

      <InviteUserDialog isOpen={showInvite} onOpenChange={setShowInvite} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function AdminUsersEmpty() {
  return (
    <div className="min-h-screen bg-card">
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <Logo color="#ffffff" scale={0.8} />
          <span className="text-sm text-slate-400">Admin</span>
          <span className="text-sm text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-300">Users</span>
        </div>
      </header>

      <div className="grow bg-background px-4 sm:px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="/cytario" />
          <EmptyState
            icon={Users}
            title="No users yet"
            description="Invite team members to get started."
            action={
              <Button variant="primary" size="lg" iconLeft={UserPlus}>
                Invite User
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  With selection active                                              */
/* ------------------------------------------------------------------ */

function AdminUsersWithSelection() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    "u-002": true,
    "u-004": true,
    "u-005": true,
  });
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-card">
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <Logo color="#ffffff" scale={0.8} />
          <span className="text-sm text-slate-400">Admin</span>
          <span className="text-sm text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-300">Users</span>
        </div>
      </header>

      <div className="grow bg-background px-4 sm:px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="/cytario">
            <span className="text-sm text-muted-foreground">
              {mockUsers.length} users
            </span>
          </SectionHeader>

          <UsersTable
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            columns={usersColumns.filter((c) => c.id !== "adminGroups")}
          />

          <SelectionFooter
            selectedCount={selectedCount}
            totalCount={mockUsers.length}
            onReset={() => setRowSelection({})}
          >
            <Button variant="secondary" size="sm" iconLeft={ShieldCheck}>
              Add to Group
            </Button>
            <Button variant="destructive" size="sm" iconLeft={X}>
              Remove from Group
            </Button>
          </SelectionFooter>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Admin Users",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

/** Full admin users page with user table, group pills, status badges, and action buttons. Mirrors the cytario-web /admin/users route. */
export const Default: Story = {
  render: () => <AdminUsersPage />,
};

/** Empty state shown when no users exist in the scope. */
export const Empty: Story = {
  render: () => <AdminUsersEmpty />,
};

/** Users page with 3 rows selected, showing the bulk action footer. */
export const WithSelection: Story = {
  render: () => <AdminUsersWithSelection />,
};
