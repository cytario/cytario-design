import { useCallback, useImperativeHandle, useRef, useState } from "react";
import { Tree as ArboristTree } from "react-arborist";
import type { TreeApi, NodeApi, NodeRendererProps } from "react-arborist";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, Folder, File } from "lucide-react";
import { Check } from "lucide-react";

export type { TreeApi } from "react-arborist";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TreeNode {
  id: string;
  name: string;
  icon?: LucideIcon;
  children?: TreeNode[];
}

export interface TreeProps<T extends TreeNode = TreeNode> {
  data: readonly T[];
  "aria-label": string;
  size?: "compact" | "comfortable";
  selectionMode?: "none" | "single" | "multi" | "checkbox";
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onActivate?: (node: T) => void;
  /** Called when the pointer enters a tree node row. */
  onHover?: (node: T) => void;
  /** Called when the pointer leaves a tree node row. */
  onHoverEnd?: (node: T) => void;
  onToggle?: (node: T) => void;
  openByDefault?: boolean;
  searchTerm?: string;
  searchMatch?: (node: T, term: string) => boolean;
  height?: number;
  indent?: number;
  disableDrag?: boolean;
  disableDrop?: boolean;
  treeRef?: React.Ref<TreeApi<T>>;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Row heights                                                        */
/* ------------------------------------------------------------------ */

const rowHeightMap = {
  compact: 32,
  comfortable: 40,
} as const;

/* ------------------------------------------------------------------ */
/*  Node renderer                                                      */
/* ------------------------------------------------------------------ */

function NodeRenderer<T extends TreeNode>({
  node,
  style,
  tree,
  dragHandle,
  checkedIds,
  onCheckToggle,
  selectionMode,
  size,
  onHover,
  onHoverEnd,
  onToggle,
}: NodeRendererProps<T> & {
  checkedIds: Set<string>;
  onCheckToggle: (id: string) => void;
  selectionMode: string;
  size: "compact" | "comfortable";
  onHover?: (node: T) => void;
  onHoverEnd?: (node: T) => void;
  onToggle?: (node: T) => void;
}) {
  const data = node.data;
  const isCheckbox = selectionMode === "checkbox";
  const isChecked = isCheckbox && checkedIds.has(node.id);
  const isSelected = node.isSelected && !isCheckbox;
  const isCompact = size === "compact";

  const IconComponent: LucideIcon = data.icon
    ? data.icon
    : node.isInternal
      ? Folder
      : File;

  return (
    <div
      ref={dragHandle}
      style={style}
      className={[
        "relative flex items-center cursor-default select-none",
        isCompact ? "gap-0.5 px-2" : "gap-1 px-3",
        "text-sm text-(--color-text-primary)",
        "outline-none",
        // Full-width background via pseudo-element
        "before:absolute before:inset-y-0 before:left-[-100vw] before:right-0 before:-z-10 before:transition-colors",
        isSelected
          ? "before:bg-(--color-surface-selected) hover:before:bg-(--color-surface-selected-hover) border-l-2 border-l-(--color-brand-accent)"
          : "hover:before:bg-(--color-surface-hover)",
        node.isFocused
          ? "outline-2 outline-(--color-border-focus) outline-offset-[-2px]"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="treeitem"
      aria-selected={isCheckbox ? isChecked : node.isSelected}
      aria-expanded={node.isInternal ? node.isOpen : undefined}
      aria-level={node.level + 1}
      onPointerEnter={() => onHover?.(node.data)}
      onPointerLeave={() => onHoverEnd?.(node.data)}
      onClick={(e) => {
        if (isCheckbox) {
          onCheckToggle(node.id);
        } else {
          node.handleClick(e);
        }
      }}
      onKeyDown={(e) => {
        if (isCheckbox && (e.key === " " || e.key === "Enter")) {
          e.preventDefault();
          onCheckToggle(node.id);
        }
      }}
    >
      {/* Chevron toggle */}
      <button
        type="button"
        className={[
          "flex items-center justify-center w-6 h-6 shrink-0",
          "rounded-sm",
          "text-(--color-text-secondary)",
          "hover:text-(--color-text-primary)",
          "transition-transform",
          node.isInternal ? "visible" : "invisible",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
          onToggle?.(node.data);
        }}
        tabIndex={-1}
        aria-label={node.isOpen ? "Collapse" : "Expand"}
      >
        <ChevronRight
          size={14}
          className={[
            "transition-transform",
            node.isOpen ? "rotate-90" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {/* Checkbox (only in checkbox mode) */}
      {isCheckbox && (
        <div
          className={[
            "flex items-center justify-center w-5 h-5 shrink-0",
            "rounded-sm border transition-colors",
            isChecked
              ? "bg-(--color-action-primary) border-(--color-action-primary)"
              : "bg-(--color-surface-default) border-(--color-border-default) hover:border-(--color-border-strong)",
          ].join(" ")}
          role="checkbox"
          aria-checked={isChecked}
          aria-label={`Select ${data.name}`}
        >
          {isChecked && (
            <Check
              className="w-3 h-3 text-(--color-text-inverse)"
              strokeWidth={3}
            />
          )}
        </div>
      )}

      {/* Icon */}
      <IconComponent
        size={16}
        className="shrink-0 text-(--color-text-secondary)"
        aria-hidden="true"
      />

      {/* Name */}
      <span className="truncate">{data.name}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tree component                                                     */
/* ------------------------------------------------------------------ */

export function Tree<T extends TreeNode = TreeNode>({
  data,
  "aria-label": ariaLabel,
  size = "comfortable",
  selectionMode = "single",
  selectedIds,
  onSelectionChange,
  onActivate,
  onToggle,
  onHover,
  onHoverEnd,
  openByDefault = false,
  searchTerm,
  searchMatch,
  height = 400,
  indent = 24,
  disableDrag = true,
  disableDrop = true,
  treeRef,
  className,
}: TreeProps<T>) {
  const internalRef = useRef<TreeApi<T>>(null);

  // Expose tree API via treeRef
  useImperativeHandle(treeRef, () => internalRef.current!, []);

  // Checkbox state (managed separately from react-arborist selection)
  const [internalChecked, setInternalChecked] = useState<Set<string>>(
    () => new Set(),
  );
  const checkedIds = selectedIds ?? internalChecked;

  const handleCheckToggle = useCallback(
    (id: string) => {
      const next = new Set(checkedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (onSelectionChange) {
        onSelectionChange(next);
      } else {
        setInternalChecked(next);
      }
    },
    [checkedIds, onSelectionChange],
  );

  // Selection handling for non-checkbox modes
  const handleSelect = useCallback(
    (nodes: NodeApi<T>[]) => {
      if (selectionMode === "checkbox" || selectionMode === "none") return;
      if (onSelectionChange) {
        onSelectionChange(new Set(nodes.map((n) => n.id)));
      }
    },
    [selectionMode, onSelectionChange],
  );

  // Activation handling
  const handleActivate = useCallback(
    (node: NodeApi<T>) => {
      if (onActivate) {
        onActivate(node.data);
      }
    },
    [onActivate],
  );

  // Search match adapter: react-arborist passes NodeApi, our prop passes T
  const arboristSearchMatch = searchMatch
    ? (node: NodeApi<T>, term: string) => searchMatch(node.data, term)
    : undefined;

  // Selection prop for react-arborist (controls selected node by id)
  // In single mode, pass the first selectedId. In multi, arborist handles it via onSelect.
  const selectionProp =
    selectionMode === "single" && selectedIds && selectedIds.size > 0
      ? [...selectedIds][0]
      : undefined;

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      className={["outline-none overflow-hidden", className].filter(Boolean).join(" ")}
    >
      <ArboristTree<T>
        ref={internalRef}
        data={data as T[]}
        width="100%"
        height={height}
        rowHeight={rowHeightMap[size]}
        indent={indent}
        openByDefault={openByDefault}
        searchTerm={searchTerm}
        searchMatch={arboristSearchMatch}
        disableDrag={disableDrag}
        disableDrop={disableDrop}
        disableMultiSelection={selectionMode === "single" || selectionMode === "none"}
        selection={selectionProp}
        onSelect={handleSelect}
        onActivate={handleActivate}
        disableEdit={true}
      >
        {(props) => (
          <NodeRenderer<T>
            {...props}
            checkedIds={checkedIds}
            onCheckToggle={handleCheckToggle}
            selectionMode={selectionMode}
            size={size}
            onHover={onHover}
            onHoverEnd={onHoverEnd}
            onToggle={onToggle}
          />
        )}
      </ArboristTree>
    </div>
  );
}
