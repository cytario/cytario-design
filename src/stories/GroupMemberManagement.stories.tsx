import { useState, useMemo } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import type { SelectItem } from "../components/Select";
import { Dialog } from "../components/Dialog";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../components/Table";
import { Menu } from "../components/Menu";
import type { MenuItemData } from "../components/Menu";
import { IconButton } from "../components/IconButton";
import { Breadcrumbs } from "../components/Breadcrumbs";
import type { BreadcrumbItem } from "../components/Breadcrumbs";
import {
  MoreVertical,
  Plus,
  UserPlus,
  Send,
  Trash2,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type MemberStatus = "active" | "invited" | "disabled";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: MemberStatus;
  lastActive: string;
  avatarColor: string;
}

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Maria Lang",
    email: "m.lang@cytario.com",
    role: "Admin",
    status: "active",
    lastActive: "2 hours ago",
    avatarColor: "#5c2483",
  },
  {
    id: "2",
    name: "Thomas Weber",
    email: "t.weber@cytario.com",
    role: "Member",
    status: "active",
    lastActive: "1 day ago",
    avatarColor: "#35b7b8",
  },
  {
    id: "3",
    name: "Sarah Chen",
    email: "s.chen@cytario.com",
    role: "Member",
    status: "active",
    lastActive: "3 hours ago",
    avatarColor: "#217d7e",
  },
  {
    id: "4",
    name: "Jan Müller",
    email: "j.mueller@cytario.com",
    role: "Viewer",
    status: "invited",
    lastActive: "\u2014",
    avatarColor: "#7c3aed",
  },
  {
    id: "5",
    name: "Aisha Patel",
    email: "a.patel@cytario.com",
    role: "Member",
    status: "active",
    lastActive: "5 minutes ago",
    avatarColor: "#059669",
  },
  {
    id: "6",
    name: "Klaus Hoffmann",
    email: "k.hoffmann@cytario.com",
    role: "Member",
    status: "disabled",
    lastActive: "3 months ago",
    avatarColor: "#6b7280",
  },
  {
    id: "7",
    name: "Yuki Tanaka",
    email: "y.tanaka@cytario.com",
    role: "Viewer",
    status: "active",
    lastActive: "1 week ago",
    avatarColor: "#dc2626",
  },
];

const roleItems: SelectItem[] = [
  { id: "Admin", name: "Admin" },
  { id: "Member", name: "Member" },
  { id: "Viewer", name: "Viewer" },
];

const breadcrumbItems: BreadcrumbItem[] = [
  { id: "org", label: "cytario", href: "#" },
  { id: "group", label: "Engineering" },
];

const statusConfig: Record<
  MemberStatus,
  { dotClass: string; label: string }
> = {
  active: {
    dotClass: "bg-teal-500",
    label: "Active",
  },
  invited: {
    dotClass: "bg-amber-400",
    label: "Invited",
  },
  disabled: {
    dotClass: "bg-neutral-400",
    label: "Disabled",
  },
};

/* ------------------------------------------------------------------ */
/*  Avatar helper                                                      */
/* ------------------------------------------------------------------ */

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composition                                                        */
/* ------------------------------------------------------------------ */

function GroupMemberManagement() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  // Add member form state
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("Member");

  const filtered = useMemo(() => {
    if (!search) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    );
  }, [members, search]);

  function handleRoleChange(memberId: string, role: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role } : m)),
    );
  }

  function handleAddMember() {
    if (!newEmail.trim()) return;
    const name = newEmail.split("@")[0].replace(/[._]/g, " ");
    const id = String(Date.now());
    setMembers((prev) => [
      ...prev,
      {
        id,
        name:
          name.charAt(0).toUpperCase() + name.slice(1),
        email: newEmail,
        role: newRole,
        status: "invited" as MemberStatus,
        lastActive: "\u2014",
        avatarColor: "#5c2483",
      },
    ]);
    setNewEmail("");
    setNewRole("Member");
    setAddDialogOpen(false);
  }

  function handleRemoveMember() {
    if (!removeTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
    setRemoveTarget(null);
  }

  function menuItemsFor(member: Member): MenuItemData[] {
    const items: MenuItemData[] = [];
    if (member.status === "invited") {
      items.push({
        id: `resend-${member.id}`,
        label: "Resend invite",
        icon: Send,
        onAction: () => {
          /* no-op in demo */
        },
      });
    }
    items.push({
      id: `remove-${member.id}`,
      label: "Remove member",
      icon: Trash2,
      isDanger: true,
      onAction: () => setRemoveTarget(member),
    });
    return items;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div>
        <Breadcrumbs items={breadcrumbItems} className="mb-2" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-(--color-text-primary)">
              Engineering
            </h1>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              <Users className="mr-1 inline h-4 w-4" />
              {members.length} member{members.length !== 1 && "s"}
            </p>
          </div>
          <Button
            variant="primary"
            iconLeft={Plus}
            onPress={() => setAddDialogOpen(true)}
          >
            Add Member
          </Button>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Filter by name or email..."
        value={search}
        onChange={setSearch}
        aria-label="Filter members"
      />

      {/* Table */}
      <Table size="comfortable" aria-label="Group members">
        <TableHeader>
          <Column isRowHeader>Member</Column>
          <Column>Email</Column>
          <Column>Role</Column>
          <Column>Status</Column>
          <Column>Last active</Column>
          <Column>
            <span className="sr-only">Actions</span>
          </Column>
        </TableHeader>
        <TableBody items={filtered}>
          {(member) => (
            <Row key={member.id} id={member.id}>
              <Cell>
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} color={member.avatarColor} />
                  <span className="font-medium">{member.name}</span>
                </div>
              </Cell>
              <Cell>
                <span className="text-(--color-text-secondary)">
                  {member.email}
                </span>
              </Cell>
              <Cell>
                <Select
                  label="Role"
                  items={roleItems}
                  selectedKey={member.role}
                  onSelectionChange={(key) =>
                    handleRoleChange(member.id, String(key))
                  }
                  className="[&_label]:sr-only min-w-[7rem]"
                />
              </Cell>
              <Cell>
                <span className="inline-flex items-center gap-2 text-sm">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${statusConfig[member.status as MemberStatus].dotClass}`}
                  />
                  {statusConfig[member.status as MemberStatus].label}
                </span>
              </Cell>
              <Cell>
                <span className="text-(--color-text-secondary)">
                  {member.lastActive}
                </span>
              </Cell>
              <Cell>
                <Menu items={menuItemsFor(member)}>
                  <IconButton
                    icon={MoreVertical}
                    aria-label={`Actions for ${member.name}`}
                    variant="ghost"
                    size="sm"
                  />
                </Menu>
              </Cell>
            </Row>
          )}
        </TableBody>
      </Table>

      {/* Add Member Dialog */}
      <Dialog
        isOpen={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        title="Add Member"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="name@example.com"
            value={newEmail}
            onChange={setNewEmail}
            isRequired
          />
          <Select
            label="Role"
            items={roleItems}
            selectedKey={newRole}
            onSelectionChange={(key) => setNewRole(String(key))}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-(--color-border-default)">
            <Button
              variant="secondary"
              onPress={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              iconLeft={UserPlus}
              onPress={handleAddMember}
            >
              Add Member
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog
        isOpen={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title="Remove Member"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-(--color-text-primary)">
            Are you sure you want to remove{" "}
            <strong>{removeTarget?.name}</strong> from this group? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-(--color-border-default)">
            <Button
              variant="secondary"
              onPress={() => setRemoveTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              iconLeft={Trash2}
              onPress={handleRemoveMember}
            >
              Remove
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Group Member Management",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <GroupMemberManagement />,
};
