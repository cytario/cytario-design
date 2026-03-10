# Modal Redesign -- UX Wireframes & Design Specification

## Overview

Wireframes for two redesigned modal dialogs: **ConnectionInfoDialog** and **FileInfoDialog**. These replace the current minimal modals (title + 2 buttons only) with information-rich views that eliminate the need to navigate away from the current context.

## Design Principles Applied

1. **Information density over whitespace** -- These are professional tools for pathologists and lab administrators. Show all relevant metadata at a glance.
2. **Inline edit mode** -- No navigation to a separate edit page. Click "Edit" and fields become editable in place. This saves context switches.
3. **Progressive disclosure** -- AWS-specific fields (Region, Role ARN) only appear when provider is AWS. Custom providers show Endpoint as required instead.
4. **Destructive action confirmation** -- Delete requires an inline confirmation step within the same modal, not a second modal on top of a modal.

## Wireframe Files

| File | State |
|------|-------|
| `connection-info-view.puml` | Connection dialog, view mode |
| `connection-info-edit-aws.puml` | Connection dialog, edit mode, AWS provider selected |
| `connection-info-edit-custom.puml` | Connection dialog, edit mode, custom provider (MinIO) |
| `file-info-default.puml` | File info dialog, default view |
| `file-info-delete-confirm.puml` | File info dialog, delete confirmation state |

---

## ConnectionInfoDialog

### Dialog Size
- **lg** (`max-w-2xl`) -- needs room for form fields with prefixes and long ARN values.

### View Mode Layout

**Header**: Alias as dialog title (e.g., "vericura internal") + close button (X).

**Body**: Stacked label/value pairs using a consistent two-column layout:
- **Provider** -- Shown as a Badge component (purple for AWS, teal for MinIO/custom)
- **Visibility** -- Group name (the ownerScope concept, presented as human-readable "Shared with: {group}")
- **S3 URI** -- Composite of `s3://{name}/{prefix}`, displayed with the `s3://` protocol grayed out
- **Region** -- Only shown for AWS provider
- **Endpoint** -- Shows "(default AWS endpoint)" if empty for AWS; shows the actual URL for custom providers
- **Role ARN** -- Only shown for AWS provider; hidden if empty
- **Created by** -- Read-only, visually de-emphasized with `--color-text-secondary`
- **Connection ID** -- Read-only, visually de-emphasized with `--color-text-secondary`, shown last (least important)

**Footer**: Three action groups, spread with space-between:
- Left: "Open Bucket" (secondary variant)
- Center: "Edit" (ghost variant)
- Right: "Remove Connection" (destructive variant)

### Edit Mode Layout

**Header**: Changes title to "Edit Connection" to signal mode change.

**Body**: Same field order, but editable:
- **Alias** -- Input component
- **Provider** -- Select dropdown (AWS, MinIO, Custom)
- **Visibility** -- Select dropdown listing available groups
- **S3 URI** -- Input with `s3://` prefix (uses the Input prefix prop)
- **Region** -- Input (only visible when provider is AWS)
- **Endpoint** -- Input with description text ("Leave empty for default AWS endpoint" for AWS; "Required for non-AWS providers" for custom)
- **Role ARN** -- Input with description text (only visible when provider is AWS)

**Footer**: Two actions:
- Left: "Cancel" (ghost variant) -- returns to view mode without saving
- Right: "Save Changes" (primary variant)

### Provider-Conditional Fields

| Field | AWS | Custom (MinIO, etc.) |
|-------|-----|---------------------|
| Region | Shown | Hidden |
| Endpoint | Optional (description: "Leave empty for default") | Required |
| Role ARN | Optional | Hidden |

### Interaction Notes

- Clicking "Edit" transitions view mode to edit mode in-place (no navigation, no second modal)
- Clicking "Cancel" discards changes and returns to view mode
- Changing the Provider dropdown immediately shows/hides conditional fields
- "Remove Connection" in view mode should trigger an inline confirmation (similar pattern to file delete), but this is a future state -- for now, the wireframe shows the button placement

---

## FileInfoDialog

### Dialog Size
- **md** (`max-w-lg`) -- compact metadata table, no form fields needed.

### Default View Layout

**Header**: Filename as dialog title (e.g., "case-2024-0193_HE.ome.tif") + close button.

**Body**: Two-column key/value table:
- **Size** -- Human-readable (e.g., "2.4 GB")
- **Last Modified** -- ISO-ish datetime with UTC (e.g., "2026-02-18 14:32 UTC")
- **Content Type** -- MIME type (e.g., "image/tiff")
- **Storage Class** -- S3 storage class (e.g., "STANDARD", "GLACIER")
- **ETag** -- Truncated S3 hash, visually de-emphasized with `--color-text-secondary`
- **Version ID** -- Truncated, de-emphasized with `--color-text-secondary`; hidden entirely if bucket is not versioned

**Footer**: Three actions:
- Left: "Open File" (secondary variant) -- navigates to the file viewer
- Center: "Download" (primary variant)
- Right: "Delete" (destructive variant)

### Delete Confirmation State

When "Delete" is clicked, the footer region transforms into an inline confirmation panel:
- Red warning text: "Are you sure you want to delete this file?"
- Subtext: "This action cannot be undone."
- Separator line
- Two buttons: "Cancel" (ghost, returns to default footer) and "Yes, Delete File" (destructive)

The body metadata remains visible during confirmation -- the user can still see what they are about to delete. This is intentional: showing the filename and size during confirmation reduces accidental deletion errors.

### Interaction Notes

- The confirmation replaces the footer, not the entire dialog body
- "Cancel" in the confirmation returns to the normal 3-button footer
- "Yes, Delete File" triggers the actual deletion and closes the dialog
- No second modal -- everything happens in-place

---

## Component Mapping

| Wireframe Element | Design System Component | Props/Variant |
|-------------------|------------------------|---------------|
| Dialog shell | `Dialog` | size="lg" (connection) / size="md" (file) |
| Action buttons | `Button` | variant: primary/secondary/ghost/destructive |
| Provider badge | `ProviderBadge` (wraps `Pill`) | aws=purple, azure=teal, gcp=slate, minio=rose, unknown=neutral |
| Text inputs | `Input` | with label, prefix for S3 URI |
| Dropdowns | `Select` | for Provider, Visibility |
| Key/value pairs | Custom layout | Tailwind grid or description list |
| Confirmation panel | Inline div | Replaces footer, not a nested dialog |

---

## Accessibility Considerations

- Dialog title changes from alias to "Edit Connection" when entering edit mode -- `aria-label` should update accordingly
- Destructive confirmation uses `role="alert"` for screen reader announcement
- All form fields have visible labels (no placeholder-only fields)
- Tab order follows visual layout: top-to-bottom through fields, then footer buttons left-to-right
- Escape key closes the dialog from any state (view mode, edit mode, or delete confirmation)
- **Contrast**: Read-only / de-emphasized values use `--color-text-secondary` (neutral-600, #4B5563, 7.2:1 ratio) -- NOT `--color-text-tertiary` (neutral-400, #9CA3AF, 2.9:1 ratio) which fails WCAG AA at body text sizes

## Review Notes

- **Graphics Designer review (Task #2)**: Approved. Flagged `--color-text-tertiary` contrast issue (corrected above). Confirmed `ProviderBadge` component (wrapping `Pill`, not `Badge`) should be reused and extracted to a shared location from `StorageConnectionCard.tsx`.
