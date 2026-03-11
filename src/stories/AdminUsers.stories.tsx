import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import {
  UserPlus,
  Users,
  UsersRound,
  ShieldCheck,
  X,
} from "lucide-react";

import { Button } from "../components/Button";
import { Dialog } from "../components/Dialog";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Field } from "../components/Field";
import { Fieldset } from "../components/Fieldset";
import { Checkbox } from "../components/Checkbox";
import { Badge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { GroupPill } from "../components/Pill";
import { SectionHeader } from "../components/SectionHeader";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../components/Table";

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
    groups: ["/cytario", "/cytario/engineering", "/cytario/engineering/platform"],
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
    groups: ["/cytario", "/cytario/engineering", "/cytario/engineering/frontend"],
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
    <Badge
      variant={enabled ? "green" : "neutral"}
      size="sm"
    >
      {enabled ? "Active" : "Disabled"}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Selection footer                                                   */
/* ------------------------------------------------------------------ */

function SelectionFooter({
  selectedCount,
  totalCount,
  onReset,
  children,
}: {
  selectedCount: number;
  totalCount: number;
  onReset: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-0 flex items-center gap-4 border-t border-(--color-border-default) bg-(--color-surface-default) px-4 py-3 shadow-lg">
      <span className="text-sm font-medium text-(--color-text-primary)">
        {selectedCount} of {totalCount} selected
      </span>
      <Button variant="ghost" size="sm" onPress={onReset}>
        Clear selection
      </Button>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
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
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} title="Invite User" size="md">
      <Fieldset>
        <Field label="Email" description="The user will receive an invitation email.">
          <Input aria-label="Email" placeholder="user@example.com" size="lg" />
        </Field>
        <Field label="Groups" description="Select which groups the user should be added to.">
          <Select
            label="Groups"
            items={[
              { id: "/cytario", name: "/cytario" },
              { id: "/cytario/engineering", name: "/cytario/engineering" },
              { id: "/cytario/product", name: "/cytario/product" },
              { id: "/cytario/research", name: "/cytario/research" },
            ]}
          />
        </Field>
      </Fieldset>
      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-(--color-border-default)">
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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showInvite, setShowInvite] = useState(false);
  const selectedCount = selectedRows.size;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedCount === mockUsers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(mockUsers.map((u) => u.id)));
    }
  };

  return (
    <div className="min-h-screen bg-(--color-surface-subtle)">
      {/* App Header */}
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <img src="logos/cytario-logo-purple.svg" alt="cytario" className="h-6" />
          <span className="text-sm text-slate-400">Admin</span>
          <span className="text-sm text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-300">Users</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-(--color-brand-primary) flex items-center justify-center text-xs font-bold">
          ML
        </div>
      </header>

      <div className="flex-grow bg-(--color-surface-default) px-4 sm:px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="/cytario">
            <span className="text-sm text-(--color-text-tertiary)">
              {mockUsers.length} users
            </span>
            <Button variant="secondary" size="sm" iconLeft={UserPlus} onPress={() => setShowInvite(true)}>
              Invite User
            </Button>
            <Button variant="secondary" size="sm" iconLeft={UsersRound}>
              Bulk Invite
            </Button>
          </SectionHeader>

          {/* Users table */}
          <div className="overflow-x-auto">
            <Table size="comfortable" aria-label="Users">
              <TableHeader>
                <Column>
                  <Checkbox
                    slot="selection"
                    isSelected={selectedCount === mockUsers.length && mockUsers.length > 0}
                    isIndeterminate={selectedCount > 0 && selectedCount < mockUsers.length}
                    onChange={toggleAll}
                    aria-label="Select all users"
                  />
                </Column>
                <Column isRowHeader>Name</Column>
                <Column>Email</Column>
                <Column>Status</Column>
                <Column>Admin Groups</Column>
                <Column>Groups</Column>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <Row key={user.id}>
                    <Cell>
                      <Checkbox
                        slot="selection"
                        isSelected={selectedRows.has(user.id)}
                        onChange={() => toggleRow(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </Cell>
                    <Cell>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="font-medium text-teal-700 hover:underline no-underline"
                      >
                        {user.name}
                      </a>
                    </Cell>
                    <Cell>
                      <span className="text-(--color-text-secondary)">
                        {user.email}
                      </span>
                    </Cell>
                    <Cell>
                      <StatusPill enabled={user.enabled} />
                    </Cell>
                    <Cell>
                      <div className="flex flex-wrap gap-1">
                        {user.adminGroups.map((path) => (
                          <GroupPill key={path} path={path} />
                        ))}
                      </div>
                    </Cell>
                    <Cell>
                      <div className="flex flex-wrap gap-1">
                        {user.groups.map((path) => (
                          <GroupPill key={path} path={path} />
                        ))}
                      </div>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Selection footer */}
          {selectedCount > 0 && (
            <SelectionFooter
              selectedCount={selectedCount}
              totalCount={mockUsers.length}
              onReset={() => setSelectedRows(new Set())}
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
    <div className="min-h-screen bg-(--color-surface-subtle)">
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <img src="logos/cytario-logo-purple.svg" alt="cytario" className="h-6" />
          <span className="text-sm text-slate-400">Admin</span>
          <span className="text-sm text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-300">Users</span>
        </div>
      </header>

      <div className="flex-grow bg-(--color-surface-default) px-4 sm:px-6 lg:px-8 py-4">
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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(
    new Set(["u-002", "u-004", "u-005"]),
  );
  const selectedCount = selectedRows.size;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-(--color-surface-subtle)">
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <img src="logos/cytario-logo-purple.svg" alt="cytario" className="h-6" />
          <span className="text-sm text-slate-400">Admin</span>
          <span className="text-sm text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-300">Users</span>
        </div>
      </header>

      <div className="flex-grow bg-(--color-surface-default) px-4 sm:px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="/cytario">
            <span className="text-sm text-(--color-text-tertiary)">
              {mockUsers.length} users
            </span>
          </SectionHeader>

          <div className="overflow-x-auto">
            <Table size="comfortable" aria-label="Users">
              <TableHeader>
                <Column>
                  <Checkbox
                    slot="selection"
                    isSelected={selectedCount === mockUsers.length}
                    isIndeterminate={selectedCount > 0 && selectedCount < mockUsers.length}
                    onChange={() =>
                      setSelectedRows(
                        selectedCount === mockUsers.length
                          ? new Set()
                          : new Set(mockUsers.map((u) => u.id)),
                      )
                    }
                    aria-label="Select all users"
                  />
                </Column>
                <Column isRowHeader>Name</Column>
                <Column>Email</Column>
                <Column>Status</Column>
                <Column>Groups</Column>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <Row key={user.id}>
                    <Cell>
                      <Checkbox
                        slot="selection"
                        isSelected={selectedRows.has(user.id)}
                        onChange={() => toggleRow(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </Cell>
                    <Cell>
                      <span className="font-medium text-(--color-text-primary)">
                        {user.name}
                      </span>
                    </Cell>
                    <Cell>
                      <span className="text-(--color-text-secondary)">{user.email}</span>
                    </Cell>
                    <Cell>
                      <StatusPill enabled={user.enabled} />
                    </Cell>
                    <Cell>
                      <div className="flex flex-wrap gap-1">
                        {user.groups.map((path) => (
                          <GroupPill key={path} path={path} />
                        ))}
                      </div>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </div>

          <SelectionFooter
            selectedCount={selectedCount}
            totalCount={mockUsers.length}
            onReset={() => setSelectedRows(new Set())}
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
