import { useState, useMemo } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Dialog } from "../components/Dialog";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../components/Table";
import { EmptyState } from "../components/EmptyState";
import { IconButton } from "../components/IconButton";
import { Tree } from "../components/Tree";
import type { TreeNode } from "../components/Tree";
import {
  Users,
  Pencil,
  X,
  Building2,
  FolderTree,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Org tree mock data                                                 */
/* ------------------------------------------------------------------ */

const orgTree: TreeNode[] = [
  {
    id: "cytario",
    name: "cytario",
    icon: Building2,
    children: [
      {
        id: "engineering",
        name: "Engineering",
        children: [
          { id: "eng-platform", name: "Platform Team" },
          { id: "eng-frontend", name: "Frontend Team" },
          { id: "eng-backend", name: "Backend Team" },
          { id: "eng-infra", name: "Infrastructure" },
        ],
      },
      {
        id: "product",
        name: "Product",
        children: [
          { id: "prod-design", name: "Design" },
          { id: "prod-research", name: "User Research" },
          { id: "prod-management", name: "Product Management" },
        ],
      },
      {
        id: "regulatory",
        name: "Regulatory Affairs",
        children: [
          { id: "reg-quality", name: "Quality Management" },
          { id: "reg-clinical", name: "Clinical Affairs" },
          { id: "reg-compliance", name: "Compliance" },
        ],
      },
      {
        id: "commercial",
        name: "Commercial",
        children: [
          { id: "com-sales", name: "Sales" },
          { id: "com-marketing", name: "Marketing" },
          { id: "com-partnerships", name: "Partnerships" },
        ],
      },
      {
        id: "operations",
        name: "Operations",
        children: [
          { id: "ops-hr", name: "Human Resources" },
          { id: "ops-finance", name: "Finance" },
          { id: "ops-it", name: "IT Operations" },
        ],
      },
    ],
  },
];

/** Flatten the tree for lookups */
function flattenTree(nodes: TreeNode[], parentPath = ""): Map<string, { name: string; path: string }> {
  const map = new Map<string, { name: string; path: string }>();
  for (const node of nodes) {
    const path = parentPath ? `${parentPath} > ${node.name}` : node.name;
    map.set(node.id, { name: node.name, path });
    if (node.children) {
      for (const [k, v] of flattenTree(node.children, path)) {
        map.set(k, v);
      }
    }
  }
  return map;
}

const nodeMap = flattenTree(orgTree);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GroupMembership {
  groupId: string;
  role: string;
}

/* ------------------------------------------------------------------ */
/*  Initial state                                                      */
/* ------------------------------------------------------------------ */

const initialMemberships: GroupMembership[] = [
  { groupId: "eng-frontend", role: "Member" },
  { groupId: "engineering", role: "Member" },
  { groupId: "prod-design", role: "Viewer" },
];

/* ------------------------------------------------------------------ */
/*  Composition                                                        */
/* ------------------------------------------------------------------ */

function UserGroupManagement() {
  const [memberships, setMemberships] = useState<GroupMembership[]>(initialMemberships);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSelection, setPendingSelection] = useState<Set<string>>(new Set());

  function openDialog() {
    setPendingSelection(new Set(memberships.map((m) => m.groupId)));
    setSearchTerm("");
    setDialogOpen(true);
  }

  function handleSave() {
    const currentIds = new Set(memberships.map((m) => m.groupId));
    const next: GroupMembership[] = [];
    // Keep existing memberships that are still selected (preserve role)
    for (const m of memberships) {
      if (pendingSelection.has(m.groupId)) {
        next.push(m);
      }
    }
    // Add new selections
    for (const id of pendingSelection) {
      if (!currentIds.has(id)) {
        next.push({ groupId: id, role: "Member" });
      }
    }
    setMemberships(next);
    setDialogOpen(false);
  }

  function handleRemove(groupId: string) {
    setMemberships((prev) => prev.filter((m) => m.groupId !== groupId));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text-primary)">
            Sarah Chen
          </h1>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            s.chen@cytario.com
          </p>
        </div>
        <Button variant="secondary" iconLeft={Pencil} onPress={openDialog}>
          Edit Groups
        </Button>
      </div>

      {/* Current memberships */}
      {memberships.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No group memberships"
          description="This user is not a member of any groups yet. Click Edit Groups to add them."
          action={
            <Button variant="primary" onPress={openDialog}>
              Edit Groups
            </Button>
          }
        />
      ) : (
        <Table size="comfortable" aria-label="Group memberships">
          <TableHeader>
            <Column isRowHeader>Group</Column>
            <Column>Path</Column>
            <Column>Role</Column>
            <Column>
              <span className="sr-only">Actions</span>
            </Column>
          </TableHeader>
          <TableBody items={memberships.map((m) => ({ ...m, id: m.groupId }))}>
            {(membership) => {
              const info = nodeMap.get(membership.groupId);
              return (
                <Row key={membership.groupId} id={membership.groupId}>
                  <Cell>
                    <span className="font-medium">
                      {info?.name ?? membership.groupId}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="text-(--color-text-secondary) text-sm">
                      {info?.path ?? ""}
                    </span>
                  </Cell>
                  <Cell>
                    <Badge variant="neutral">{membership.role}</Badge>
                  </Cell>
                  <Cell>
                    <IconButton
                      icon={X}
                      aria-label={`Remove from ${info?.name}`}
                      variant="ghost"
                      size="sm"
                      onPress={() => handleRemove(membership.groupId)}
                    />
                  </Cell>
                </Row>
              );
            }}
          </TableBody>
        </Table>
      )}

      {/* Edit Groups Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Edit Group Memberships"
        size="xl"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={setSearchTerm}
            aria-label="Search groups"
          />
          <div className="border border-(--color-border-default) rounded-md overflow-hidden">
            <Tree
              data={orgTree}
              aria-label="Organization groups"
              selectionMode="checkbox"
              selectedIds={pendingSelection}
              onSelectionChange={setPendingSelection}
              openByDefault
              searchTerm={searchTerm || undefined}
              searchMatch={(node, term) =>
                node.name.toLowerCase().includes(term.toLowerCase())
              }
              height={360}
            />
          </div>
          <p className="text-sm text-(--color-text-secondary)">
            {pendingSelection.size} group{pendingSelection.size !== 1 && "s"} selected
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-(--color-border-default)">
            <Button variant="secondary" onPress={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={handleSave}>
              Save Changes
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
  title: "Compositions/User Group Management",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <UserGroupManagement />,
};
