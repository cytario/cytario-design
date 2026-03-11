import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { Switch } from "../components/Switch";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Dialog } from "../components/Dialog";
import { EmptyState } from "../components/EmptyState";
import { Breadcrumbs } from "../components/Breadcrumbs";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../components/SegmentedControl";
import type { BreadcrumbItem } from "../components/Breadcrumbs";
import {
  markers,
  sampleMetadata,
  histogramData,
  presets,
  overlayResults,
  mockOverlayFile,
  mockS3Files,
} from "./pathology-viewer-data";
import type { MarkerChannel, ViewerPreset } from "./pathology-viewer-data";
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Layers,
  Columns2,
  ExternalLink,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Dark theme token overrides                                         */
/* ------------------------------------------------------------------ */

const viewerTokenOverrides: React.CSSProperties = {
  "--color-surface-default": "#1f2937",
  "--color-surface-subtle": "#374151",
  "--color-surface-muted": "#4b5563",
  "--color-text-primary": "#f3f4f6",
  "--color-text-secondary": "#9ca3af",
  "--color-text-tertiary": "#6b7280",
  "--color-border-default": "#374151",
  "--color-border-strong": "#4b5563",
  "--color-border-focus": "#35b7b8",
} as React.CSSProperties;

/* ------------------------------------------------------------------ */
/*  Breadcrumb data                                                    */
/* ------------------------------------------------------------------ */

const breadcrumbItems: BreadcrumbItem[] = [
  { id: "org", label: sampleMetadata.organization, href: "#" },
  { id: "project", label: sampleMetadata.project, href: "#" },
  { id: "file", label: sampleMetadata.filename },
];

/* ------------------------------------------------------------------ */
/*  Histogram SVG                                                      */
/* ------------------------------------------------------------------ */

function HistogramChart() {
  const width = 240;
  const height = 64;
  const maxVal = Math.max(...histogramData);

  const points = histogramData.map((val, i) => {
    const x = (i / (histogramData.length - 1)) * width;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  });

  const pathD = `M0,${height} L${points.join(" L")} L${width},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ height: 64 }}
    >
      <defs>
        <linearGradient id="histGrad" x1="0" y1={height} x2="0" y2="0">
          <stop offset="0%" stopColor="#217d7e" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#44c4c5" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <path d={pathD} fill="url(#histGrad)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Scale ruler SVG                                                    */
/* ------------------------------------------------------------------ */

function ScaleRuler() {
  const tickCount = 26;
  const majorEvery = 5;

  return (
    <svg
      className="w-full"
      style={{ height: 24 }}
      viewBox="0 0 600 24"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: tickCount }, (_, i) => {
        const x = i * (600 / (tickCount - 1));
        const isMajor = i % majorEvery === 0;
        return (
          <g key={i}>
            <line
              x1={x}
              y1={0}
              x2={x}
              y2={isMajor ? 10 : 5}
              stroke={isMajor ? "#9ca3af" : "#4b5563"}
              strokeWidth={1}
            />
            {isMajor && (
              <text
                x={x}
                y={20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={9}
                fontFamily="var(--font-sans)"
              >
                {i === tickCount - 1
                  ? `${(i / majorEvery) * 100} \u00B5m`
                  : `${(i / majorEvery) * 100}`}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Preset thumbnail button                                            */
/* ------------------------------------------------------------------ */

function PresetTab({
  preset,
  isActive,
  onClick,
}: {
  preset: ViewerPreset;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={preset.label}
      className={[
        "relative flex flex-col justify-between overflow-hidden rounded transition-colors",
        isActive
          ? "ring-2 ring-[#35b7b8] ring-offset-1 ring-offset-[#111827]"
          : "ring-1 ring-[#374151] hover:ring-[#4b5563]",
      ].join(" ")}
      style={{ width: 36, height: 28, backgroundColor: "#1f2937" }}
    >
      {/* Number label */}
      <span className="absolute top-0.5 left-1 text-[9px] font-bold text-[#9ca3af]">
        {preset.id}
      </span>

      {/* Color bars at bottom */}
      <div className="mt-auto flex">
        {preset.colors.map((color, i) => (
          <div
            key={i}
            className="h-1 flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Toolbar zoom button (icon)                                         */
/* ------------------------------------------------------------------ */

function ZoomButton({
  icon: IconComponent,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#374151] bg-[#1f2937] text-[#d1d5db] transition-colors hover:bg-[#374151]"
    >
      <IconComponent size={16} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  S3 date formatter                                                  */
/* ------------------------------------------------------------------ */

function formatS3Date(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Main composition                                                   */
/* ------------------------------------------------------------------ */

function PathologyViewer() {
  const [channelStates, setChannelStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries(markers.map((m) => [m.id, m.enabled])),
  );
  const [activePreset, setActivePreset] = useState(1);
  const [zoomLevel, setZoomLevel] = useState("0.5");

  // Overlay state
  const [overlayLoaded, setOverlayLoaded] = useState(false);
  const [overlayStates, setOverlayStates] = useState<Record<string, boolean>>(
    {},
  );
  const [overlaysCollapsed, setOverlaysCollapsed] = useState(false);
  const [overlayDialogOpen, setOverlayDialogOpen] = useState(false);
  const [selectedS3File, setSelectedS3File] = useState<string | null>(null);

  function toggleChannel(id: string) {
    setChannelStates((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function applyPreset(preset: ViewerPreset) {
    setActivePreset(preset.id);
    const enabledSet = new Set(preset.enabledChannels);
    setChannelStates(
      Object.fromEntries(markers.map((m) => [m.id, enabledSet.has(m.id)])),
    );
  }

  function loadOverlay() {
    setOverlayLoaded(true);
    setOverlayDialogOpen(false);
    setSelectedS3File(null);
    setOverlayStates(
      Object.fromEntries(overlayResults.map((r) => [r.markerId, r.enabled])),
    );
  }

  function removeOverlay() {
    setOverlayLoaded(false);
    setOverlayStates({});
  }

  function toggleOverlay(markerId: string) {
    setOverlayStates((prev) => ({ ...prev, [markerId]: !prev[markerId] }));
  }

  const zoomPresets = ["5x", "10x", "20x", "40x"];

  return (
    <div
      style={{
        ...viewerTokenOverrides,
        height: 800,
        fontFamily: "var(--font-sans)",
      }}
      className="flex flex-col overflow-hidden rounded-xl"
    >
      {/* -- Toolbar -------------------------------------------------- */}
      <div
        className="flex h-12 shrink-0 items-center gap-4 border-b border-[#374151] px-4"
        style={{ backgroundColor: "#1f2937" }}
      >
        {/* Logo */}
        <span className="text-sm font-bold tracking-wide text-[#35b7b8]">
          cytario
        </span>

        {/* Separator */}
        <div className="h-5 w-px bg-[#374151]" />

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="shrink min-w-0" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5">
          <ZoomButton
            icon={ZoomOut}
            label="Zoom out"
            onClick={() => {
              const val = Math.max(0.1, Number.parseFloat(zoomLevel) - 0.1);
              setZoomLevel(val.toFixed(1));
            }}
          />
          <input
            type="text"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(e.target.value)}
            className="h-8 w-12 rounded-lg border border-[#374151] bg-[#1f2937] text-center text-sm font-medium text-[#f3f4f6] outline-none focus:border-[#35b7b8]"
            aria-label="Zoom level"
          />
          <ZoomButton
            icon={ZoomIn}
            label="Zoom in"
            onClick={() => {
              const val = Number.parseFloat(zoomLevel) + 0.1;
              setZoomLevel(val.toFixed(1));
            }}
          />
          <ZoomButton
            icon={Maximize}
            label="Fit to view"
            onClick={() => setZoomLevel("0.5")}
          />

          <SegmentedControl
            selectionMode="none"
            size="sm"
            aria-label="Zoom presets"
            className="ml-1"
          >
            {zoomPresets.map((preset) => (
              <SegmentedControlItem
                key={preset}
                id={preset}
                onPress={() => setZoomLevel(preset.replace("x", ""))}
              >
                {preset}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>

        <div className="ml-1 h-5 w-px bg-[#374151]" />

        {/* Search */}
        <div className="w-44">
          <Input placeholder="Search..." size="sm" aria-label="Search" />
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5c2483] text-xs font-semibold text-white">
          ML
        </div>
      </div>

      {/* -- Body: Viewport + Sidebar --------------------------------- */}
      <div className="flex flex-1 min-h-0">
        {/* -- Viewport area ---------------------------------------- */}
        <div className="relative flex-1 flex flex-col min-w-0">
          {/* Horizontal ruler */}
          <div
            className="shrink-0"
            style={{ height: 24, backgroundColor: "rgba(3, 7, 18, 0.8)" }}
          >
            <ScaleRuler />
          </div>

          {/* Main viewport with tissue mockup */}
          <div className="flex flex-1 min-h-0">
            {/* Vertical ruler */}
            <div
              className="shrink-0 flex flex-col"
              style={{
                width: 24,
                backgroundColor: "rgba(3, 7, 18, 0.8)",
              }}
            >
              <svg
                style={{ width: 24, height: "100%" }}
                viewBox="0 0 24 400"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {Array.from({ length: 21 }, (_, i) => {
                  const y = i * 20;
                  const isMajor = i % 5 === 0;
                  return (
                    <g key={i}>
                      <line
                        x1={24}
                        y1={y}
                        x2={isMajor ? 14 : 19}
                        y2={y}
                        stroke={isMajor ? "#9ca3af" : "#4b5563"}
                        strokeWidth={1}
                      />
                      {isMajor && (
                        <text
                          x={12}
                          y={y + 3}
                          textAnchor="middle"
                          fill="#9ca3af"
                          fontSize={7}
                          fontFamily="var(--font-sans)"
                        >
                          {(i / 5) * 100}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Tissue mockup */}
            <div
              className="flex-1"
              style={{
                backgroundColor: "#000000",
                backgroundImage: [
                  "radial-gradient(ellipse 120px 90px at 35% 40%, rgba(70, 130, 230, 0.4) 0%, transparent 70%)",
                  "radial-gradient(ellipse 80px 100px at 55% 60%, rgba(70, 130, 230, 0.3) 0%, transparent 65%)",
                  "radial-gradient(ellipse 150px 70px at 70% 30%, rgba(70, 130, 230, 0.25) 0%, transparent 60%)",
                  "radial-gradient(ellipse 60px 80px at 20% 70%, rgba(70, 130, 230, 0.35) 0%, transparent 70%)",
                  "radial-gradient(ellipse 100px 60px at 40% 45%, rgba(230, 130, 50, 0.3) 0%, transparent 70%)",
                  "radial-gradient(ellipse 70px 90px at 60% 55%, rgba(230, 130, 50, 0.2) 0%, transparent 65%)",
                  "radial-gradient(ellipse 90px 110px at 45% 50%, rgba(80, 200, 80, 0.2) 0%, transparent 65%)",
                  "radial-gradient(ellipse 60px 70px at 25% 35%, rgba(80, 200, 80, 0.15) 0%, transparent 60%)",
                  "radial-gradient(circle 30px at 50% 40%, rgba(200, 60, 60, 0.35) 0%, transparent 80%)",
                  "radial-gradient(circle 20px at 35% 55%, rgba(200, 60, 60, 0.25) 0%, transparent 80%)",
                  "radial-gradient(circle 25px at 65% 65%, rgba(200, 60, 60, 0.3) 0%, transparent 80%)",
                ].join(", "),
              }}
            />
          </div>
        </div>

        {/* -- Sidebar ------------------------------------------------ */}
        <div
          className="flex w-[280px] shrink-0 flex-col border-l border-[#374151]"
          style={{ backgroundColor: "#111827" }}
        >
          {/* Preset tabs */}
          <div className="flex items-center gap-1.5 px-3 pt-4 pb-3">
            {presets.map((p) => (
              <PresetTab
                key={p.id}
                preset={p}
                isActive={activePreset === p.id}
                onClick={() => applyPreset(p)}
              />
            ))}
            <button
              type="button"
              title="Split screen"
              className="ml-auto flex h-7 w-7 items-center justify-center rounded border border-[#374151] bg-[#1f2937] text-[#9ca3af] transition-colors hover:bg-[#374151] hover:text-[#d1d5db]"
            >
              <Columns2 size={14} />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-3 h-px bg-[#374151]" />

          {/* Histogram */}
          <div className="px-3 pt-3">
            <div
              className="overflow-hidden rounded"
              style={{ backgroundColor: "#1f2937", padding: 8 }}
            >
              <HistogramChart />
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-[#9ca3af]">
              <span>
                Min <span className="font-medium text-[#f3f4f6]">3544</span>
              </span>
              <span>
                Max <span className="font-medium text-[#f3f4f6]">30940</span>
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 mt-3 h-px bg-[#374151]" />

          {/* Channel list header */}
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
              Channels
            </span>
            <span className="text-xs text-[#6b7280]">
              {markers.filter((m) => channelStates[m.id]).length}/
              {markers.length}
            </span>
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto px-3">
            {markers.map((marker: MarkerChannel) => (
              <div
                key={marker.id}
                className="flex items-center gap-2 border-b border-[#1f2937] py-2"
              >
                {/* Color dot */}
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: marker.color }}
                />

                {/* Channel name */}
                <span className="flex-1 text-sm text-[#f3f4f6]">
                  {marker.name}
                </span>

                {/* Switch toggle */}
                <Switch
                  color={marker.color}
                  isSelected={channelStates[marker.id]}
                  onChange={() => toggleChannel(marker.id)}
                  aria-label={`Toggle ${marker.name}`}
                />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-3 h-px bg-[#374151]" />

          {/* -- Overlays section ------------------------------------ */}
          <div className="flex flex-col">
            {/* Overlays header */}
            <button
              type="button"
              onClick={() => setOverlaysCollapsed(!overlaysCollapsed)}
              className="flex items-center gap-2 px-3 pt-3 pb-2 text-left"
            >
              {overlaysCollapsed ? (
                <ChevronRight size={14} className="text-[#9ca3af]" />
              ) : (
                <ChevronDown size={14} className="text-[#9ca3af]" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Overlays
              </span>
            </button>

            {!overlaysCollapsed && (
              <div className="px-3 pb-3">
                {!overlayLoaded ? (
                  /* State A: Empty -- no overlay loaded */
                  <EmptyState
                    icon={Layers}
                    title="Add Overlay"
                    description="Add parquet cell detection files"
                    className="py-6"
                    action={
                      <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => setOverlayDialogOpen(true)}
                      >
                        Add Overlay
                      </Button>
                    }
                  />
                ) : (
                  /* State B: Overlay loaded */
                  <div className="flex flex-col gap-2">
                    {/* File info row */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 truncate rounded border border-[#374151] bg-[#1f2937] px-2 py-1 text-xs text-[#d1d5db]">
                        {mockOverlayFile.filename}
                      </div>
                      <button
                        type="button"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#9ca3af] hover:bg-[#374151] hover:text-[#d1d5db] transition-colors"
                        aria-label="Open file externally"
                      >
                        <ExternalLink size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={removeOverlay}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#9ca3af] hover:bg-[#374151] hover:text-[#d1d5db] transition-colors"
                        aria-label="Remove overlay"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Overlay marker list */}
                    <div className="flex flex-col">
                      {overlayResults.map((result) => (
                        <div
                          key={result.markerId}
                          className="flex items-center gap-2 border-b border-[#1f2937] py-1.5"
                        >
                          {/* Large colored circle */}
                          <span
                            className="h-4 w-4 shrink-0 rounded-full"
                            style={{ backgroundColor: result.color }}
                          />

                          {/* Marker name */}
                          <span className="flex-1 text-sm text-[#f3f4f6]">
                            {result.name}
                          </span>

                          {/* Cell count */}
                          <span className="text-xs tabular-nums text-[#9ca3af]">
                            {result.cellCount.toLocaleString()}
                          </span>

                          {/* Switch toggle */}
                          <Switch
                            color={result.color}
                            isSelected={overlayStates[result.markerId] ?? false}
                            onChange={() => toggleOverlay(result.markerId)}
                            aria-label={`Toggle ${result.name} overlay`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slide info footer */}
          <div className="mt-auto border-t border-[#374151] px-3 py-2">
            <div className="text-xs text-[#6b7280]">
              {sampleMetadata.widthMm} x {sampleMetadata.heightMm} mm
              <span className="mx-1.5">&middot;</span>
              {sampleMetadata.widthPx} x {sampleMetadata.heightPx} px
              <span className="mx-1.5">&middot;</span>
              {sampleMetadata.pixelSizeMicrons} {"\u00B5m/px"}
            </div>
          </div>
        </div>
      </div>

      {/* -- Add Overlay Dialog -------------------------------------- */}
      <Dialog
        isOpen={overlayDialogOpen}
        onOpenChange={setOverlayDialogOpen}
        title="Select Overlay File"
        size="lg"
      >
        <div className="flex flex-col gap-4">
          {/* S3 file browser table */}
          <div className="overflow-hidden rounded-lg border border-(--color-border-default)">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--color-border-default) bg-(--color-surface-subtle)">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-(--color-text-secondary)">
                    Filename
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-(--color-text-secondary)">
                    Size
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-(--color-text-secondary)">
                    Last Modified
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockS3Files.map((file) => (
                  <tr
                    key={file.key}
                    onClick={() => setSelectedS3File(file.key)}
                    className={[
                      "cursor-pointer border-b border-(--color-border-default) last:border-b-0 transition-colors",
                      selectedS3File === file.key
                        ? "bg-[color-mix(in_srgb,var(--color-brand-accent)_15%,transparent)]"
                        : "hover:bg-(--color-surface-subtle)",
                    ].join(" ")}
                  >
                    <td className="px-4 py-2.5 text-(--color-text-primary)">
                      {file.filename}
                    </td>
                    <td className="px-4 py-2.5 text-right text-(--color-text-secondary)">
                      {file.size}
                    </td>
                    <td className="px-4 py-2.5 text-right text-(--color-text-secondary)">
                      {formatS3Date(file.lastModified)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onPress={() => {
                setOverlayDialogOpen(false);
                setSelectedS3File(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              isDisabled={!selectedS3File}
              onPress={() => {
                if (selectedS3File) {
                  loadOverlay();
                }
              }}
            >
              Load
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
  title: "Compositions/Pathology Viewer",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <PathologyViewer />,
};
