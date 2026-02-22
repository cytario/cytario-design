import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { Switch } from "../components/Switch";
import { Input } from "../components/Input";
import { Breadcrumbs } from "../components/Breadcrumbs";
import type { BreadcrumbItem } from "../components/Breadcrumbs";
import {
  markers,
  cycles,
  sampleMetadata,
  histogramData,
} from "./pathology-viewer-data";
import type { MarkerChannel } from "./pathology-viewer-data";
import { Search, ZoomIn, ZoomOut, Maximize } from "lucide-react";

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
  const spacing = 240 / (tickCount - 1);

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
/*  Cycle tab button                                                   */
/* ------------------------------------------------------------------ */

function CycleTab({
  cycle,
  isActive,
  onClick,
}: {
  cycle: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={cycles[cycle - 1]?.label}
      className={[
        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
        isActive
          ? "bg-[#35b7b8] text-black"
          : "bg-[#374151] text-[#d1d5db] hover:bg-[#4b5563]",
      ].join(" ")}
    >
      {cycle}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Zoom preset button                                                 */
/* ------------------------------------------------------------------ */

function ZoomPreset({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-7 rounded px-2 text-xs font-medium border transition-colors",
        isActive
          ? "border-[#374151] bg-[#374151] text-[#f3f4f6]"
          : "border-[#374151] bg-transparent text-[#d1d5db] hover:bg-[#1f2937]",
      ].join(" ")}
    >
      {label}
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
/*  Main composition                                                   */
/* ------------------------------------------------------------------ */

function PathologyViewer() {
  const [channelStates, setChannelStates] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(markers.map((m) => [m.id, m.enabled])),
  );
  const [activeCycle, setActiveCycle] = useState(1);
  const [zoomLevel, setZoomLevel] = useState("0.5");

  const activeMarkers = markers.filter((m) => m.cycle === activeCycle);

  function toggleChannel(id: string) {
    setChannelStates((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const zoomPresets = ["5x", "10x", "20x", "40x", "80x"];

  return (
    <div
      style={{
        ...viewerTokenOverrides,
        height: 800,
        fontFamily: "var(--font-sans)",
      }}
      className="flex flex-col overflow-hidden rounded-xl"
    >
      {/* ── Toolbar ─────────────────────────────────────────────── */}
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

          <div className="ml-1 h-5 w-px bg-[#374151]" />

          {zoomPresets.map((preset) => (
            <ZoomPreset
              key={preset}
              label={preset}
              isActive={`${zoomLevel}x` === preset}
              onClick={() =>
                setZoomLevel(preset.replace("x", ""))
              }
            />
          ))}
        </div>

        <div className="ml-1 h-5 w-px bg-[#374151]" />

        {/* Search */}
        <div className="w-44">
          <Input
            placeholder="Search..."
            size="sm"
            aria-label="Search"
          />
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5c2483] text-xs font-semibold text-white">
          ML
        </div>
      </div>

      {/* ── Body: Viewport + Sidebar ────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* ── Viewport area ──────────────────────────────────── */}
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

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <div
          className="flex w-[280px] shrink-0 flex-col border-l border-[#374151]"
          style={{ backgroundColor: "#111827" }}
        >
          {/* Cycle tabs */}
          <div className="flex items-center gap-1 px-3 pt-4 pb-3">
            <span className="mr-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
              Cycle
            </span>
            {[1, 2, 3, 4].map((c) => (
              <CycleTab
                key={c}
                cycle={c}
                isActive={activeCycle === c}
                onClick={() => setActiveCycle(c)}
              />
            ))}
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
              {activeMarkers.filter((m) => channelStates[m.id]).length}/
              {activeMarkers.length}
            </span>
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {activeMarkers.map((marker: MarkerChannel) => (
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

          {/* Slide info footer */}
          <div className="border-t border-[#374151] px-3 py-2">
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
