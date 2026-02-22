/**
 * Mock data for the cytario digital pathology viewer Storybook composition story.
 *
 * Models an Ultivue InSituPlex Immuno-Oncology panel — a multiplexed
 * immunofluorescence (mIF) assay run on an FFPE tissue section. The panel uses
 * DNA-barcoded antibodies with sequential fluorescent-oligo hybridization rounds
 * (4 imaging cycles). DAPI nuclear counterstain is re-applied each cycle.
 *
 * Channel colors follow standard fluorescence microscopy conventions where
 * possible (DAPI = blue, FITC-like = green, Cy3-like = orange/yellow,
 * Cy5-like = red/magenta, Alexa-like = cyan/violet).
 */

// ---------------------------------------------------------------------------
// Marker / channel data
// ---------------------------------------------------------------------------

export interface MarkerChannel {
  /** Stable identifier (kebab-case) */
  id: string;
  /** Display name shown in the channel list */
  name: string;
  /** Hex color for the false-color overlay */
  color: string;
  /** Whether the channel is visible on load */
  enabled: boolean;
  /** One-line biological description */
  description: string;
  /** Imaging cycle this channel belongs to (1-4) */
  cycle: number;
}

export const markers: MarkerChannel[] = [
  // ── Cycle 1 — Adaptive: T-cell subsets ──────────────────────────────
  {
    id: "dapi-1",
    name: "DAPI",
    color: "#4287f5",
    enabled: true,
    description: "Nuclear counterstain (all nuclei)",
    cycle: 1,
  },
  {
    id: "cd8",
    name: "CD8",
    color: "#f54242",
    enabled: false,
    description: "Cytotoxic T cells",
    cycle: 1,
  },
  {
    id: "cd4",
    name: "CD4",
    color: "#42f554",
    enabled: false,
    description: "Helper T cells",
    cycle: 1,
  },
  {
    id: "cd11c",
    name: "CD11c",
    color: "#f5a623",
    enabled: false,
    description: "Dendritic cells",
    cycle: 1,
  },

  // ── Cycle 2 — Innate: Macrophage lineage ────────────────────────────
  {
    id: "cd68",
    name: "CD68",
    color: "#e842f5",
    enabled: false,
    description: "Pan-macrophage marker",
    cycle: 2,
  },
  {
    id: "dapi-2",
    name: "DAPI2",
    color: "#4287f5",
    enabled: false,
    description: "Nuclear counterstain (cycle 2 re-stain)",
    cycle: 2,
  },
  {
    id: "cd11b",
    name: "CD11b",
    color: "#f5e642",
    enabled: false,
    description: "Myeloid cells (monocytes, macrophages, granulocytes)",
    cycle: 2,
  },
  {
    id: "pd1",
    name: "PD-1",
    color: "#42f5e8",
    enabled: false,
    description: "Immune checkpoint receptor (exhausted / activated T cells)",
    cycle: 2,
  },

  // ── Cycle 3 — Innate + Adaptive: NK & B cells ──────────────────────
  {
    id: "cd56",
    name: "CD56",
    color: "#f58442",
    enabled: false,
    description: "Natural killer (NK) cells",
    cycle: 3,
  },
  {
    id: "cd20",
    name: "CD20",
    color: "#8442f5",
    enabled: false,
    description: "B lymphocytes",
    cycle: 3,
  },
  {
    id: "dapi-3",
    name: "DAPI3",
    color: "#4287f5",
    enabled: false,
    description: "Nuclear counterstain (cycle 3 re-stain)",
    cycle: 3,
  },
  {
    id: "cd3",
    name: "CD3",
    color: "#42f5a1",
    enabled: false,
    description: "Pan-T-cell marker (all T lymphocytes)",
    cycle: 3,
  },

  // ── Cycle 4 — Macrophage polarization + Tumor ───────────────────────
  {
    id: "cd14",
    name: "CD14",
    color: "#f5d442",
    enabled: false,
    description: "Monocytes / classical macrophages",
    cycle: 4,
  },
  {
    id: "cd206",
    name: "CD206",
    color: "#42a5f5",
    enabled: false,
    description: "M2-polarized (immunosuppressive) macrophages",
    cycle: 4,
  },
  {
    id: "ck",
    name: "CK",
    color: "#f5f542",
    enabled: false,
    description: "Pan-cytokeratin — epithelial / tumor cells",
    cycle: 4,
  },
] as const satisfies readonly MarkerChannel[];

// ---------------------------------------------------------------------------
// Imaging cycle metadata
// ---------------------------------------------------------------------------

export interface ImagingCycle {
  id: number;
  label: string;
}

export const cycles: ImagingCycle[] = [
  { id: 1, label: "Adaptive immunity — T-cell subsets" },
  { id: 2, label: "Innate immunity — Macrophage lineage" },
  { id: 3, label: "Innate + Adaptive — NK & B cells" },
  { id: 4, label: "Macrophage polarization & Tumor" },
] as const satisfies readonly ImagingCycle[];

// ---------------------------------------------------------------------------
// Sample / slide metadata
// ---------------------------------------------------------------------------

export interface SampleMetadata {
  organization: string;
  project: string;
  filename: string;
  tissueType: string;
  species: string;
  preparation: string;
  /** Physical width of the scanned region in mm */
  widthMm: number;
  /** Physical height of the scanned region in mm */
  heightMm: number;
  /** Pixel dimensions */
  widthPx: number;
  heightPx: number;
  /** Number of z-planes (1 = single focal plane) */
  zPlanes: number;
  /** Objective magnification used for acquisition */
  magnification: string;
  /** Pixel size in micrometers */
  pixelSizeMicrons: number;
  panelName: string;
  scannerModel: string;
}

export const sampleMetadata: SampleMetadata = {
  organization: "cytario",
  project: "IO-Biomarker-Study-2026",
  filename: "NSCLC_TMA_Core12_IO15.ome.tif",
  tissueType: "Non-small cell lung carcinoma (NSCLC)",
  species: "Homo sapiens",
  preparation: "FFPE, 4 \u00B5m section",
  widthMm: 11.2,
  heightMm: 8.4,
  widthPx: 40320,
  heightPx: 30240,
  zPlanes: 1,
  magnification: "20x",
  pixelSizeMicrons: 0.278,
  panelName: "InSituPlex Immuno-Oncology 15-plex",
  scannerModel: "Leica Aperio VERSA",
} as const satisfies SampleMetadata;

// ---------------------------------------------------------------------------
// Histogram mock data
// ---------------------------------------------------------------------------

/**
 * Simulated fluorescence intensity distribution (0-1 normalized).
 * Right-skewed: most pixels are dim background, with a long tail of bright
 * signal from positively-stained cells. This shape is typical for any
 * immunofluorescence channel on a tissue section.
 *
 * 50 bins, values represent the fraction of pixels in each bin.
 */
export const histogramData: readonly number[] = [
  0.92, 0.87, 0.78, 0.65, 0.53, 0.44, 0.37, 0.31, 0.26, 0.22,
  0.19, 0.16, 0.14, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.065,
  0.06, 0.055, 0.05, 0.045, 0.04, 0.037, 0.034, 0.031, 0.028, 0.025,
  0.023, 0.021, 0.019, 0.017, 0.015, 0.013, 0.012, 0.011, 0.010, 0.009,
  0.008, 0.007, 0.006, 0.005, 0.004, 0.003, 0.003, 0.002, 0.001, 0.001,
] as const;

// ---------------------------------------------------------------------------
// Viewer presets
// ---------------------------------------------------------------------------

export interface ViewerPreset {
  id: number;
  label: string;
  /** Channel IDs enabled in this preset */
  enabledChannels: string[];
  /** Display colors for the preset thumbnail (derived from enabled channels) */
  colors: string[];
}

export const presets = [
  {
    id: 1,
    label: "DAPI only",
    enabledChannels: ["dapi-1"],
    colors: ["#4287f5"],
  },
  {
    id: 2,
    label: "T-cell panel",
    enabledChannels: ["dapi-1", "cd3", "cd4", "cd8"],
    colors: ["#4287f5", "#42f5a1", "#42f554", "#f54242"],
  },
  {
    id: 3,
    label: "Myeloid panel",
    enabledChannels: ["dapi-1", "cd68", "cd11b", "cd14", "cd206"],
    colors: ["#4287f5", "#e842f5", "#f5e642", "#f5d442", "#42a5f5"],
  },
  {
    id: 4,
    label: "Tumor microenvironment",
    enabledChannels: ["dapi-1", "ck", "pd1", "cd8"],
    colors: ["#4287f5", "#f5f542", "#42f5e8", "#f54242"],
  },
] as const satisfies readonly ViewerPreset[];

// ---------------------------------------------------------------------------
// Cell segmentation overlay results
// ---------------------------------------------------------------------------

export interface OverlayResult {
  /** Matches a MarkerChannel.id (no DAPI — structural stain, not a phenotype) */
  markerId: string;
  /** Display name (lowercase, as shown in overlay UI) */
  name: string;
  /** Overlay visualization color (large filled circle) */
  color: string;
  /** Total detected cell count (whole slide) */
  cellCount: number;
  /** Whether the overlay is visible */
  enabled: boolean;
}

/**
 * Realistic cell counts for an 11.2 x 8.4 mm NSCLC tissue section.
 *
 * Ordering: highest-count markers first (CD3, CD4, CK dominate in NSCLC).
 * PD-1 and CD56 are sparse. Colors are bright, saturated, and all unique —
 * spanning the red-orange-yellow-green-cyan-blue-purple-magenta spectrum.
 */
export const overlayResults = [
  { markerId: "cd3",   name: "cd3",   color: "#22c55e", cellCount: 48_320, enabled: true },
  { markerId: "cd4",   name: "cd4",   color: "#facc15", cellCount: 31_750, enabled: true },
  { markerId: "ck",    name: "ck",    color: "#f97316", cellCount: 65_210, enabled: true },
  { markerId: "cd8",   name: "cd8",   color: "#ef4444", cellCount: 22_480, enabled: true },
  { markerId: "cd20",  name: "cd20",  color: "#6366f1", cellCount: 18_940, enabled: false },
  { markerId: "cd68",  name: "cd68",  color: "#a855f7", cellCount: 14_890, enabled: false },
  { markerId: "cd11b", name: "cd11b", color: "#06b6d4", cellCount: 11_340, enabled: false },
  { markerId: "cd14",  name: "cd14",  color: "#14b8a6", cellCount: 8_770,  enabled: false },
  { markerId: "cd206", name: "cd206", color: "#3b82f6", cellCount: 6_230,  enabled: false },
  { markerId: "cd11c", name: "cd11c", color: "#ec4899", cellCount: 5_620,  enabled: false },
  { markerId: "pd1",   name: "pd-1",  color: "#f43f5e", cellCount: 3_410,  enabled: false },
  { markerId: "cd56",  name: "cd56",  color: "#d946ef", cellCount: 1_890,  enabled: false },
] as const satisfies readonly OverlayResult[];

// ---------------------------------------------------------------------------
// Overlay file metadata
// ---------------------------------------------------------------------------

export interface OverlayFile {
  filename: string;
  path: string;
  size: string;
  loadedAt: string;
}

export const mockOverlayFile: OverlayFile = {
  filename: "results_total.csv.parquet",
  path: "s3://cytario-results/IO-Biomarker-Study-2026/segmentation/",
  size: "24.3 MB",
  loadedAt: "2 min ago",
} as const satisfies OverlayFile;

// ---------------------------------------------------------------------------
// Mock S3 file browser entries
// ---------------------------------------------------------------------------

export interface S3FileEntry {
  key: string;
  filename: string;
  size: string;
  lastModified: string;
}

export const mockS3Files = [
  {
    key: "segmentation/results_total.csv.parquet",
    filename: "results_total.csv.parquet",
    size: "24.3 MB",
    lastModified: "2026-02-22T09:14:00Z",
  },
  {
    key: "segmentation/results_per_roi.csv.parquet",
    filename: "results_per_roi.csv.parquet",
    size: "18.7 MB",
    lastModified: "2026-02-22T09:14:00Z",
  },
  {
    key: "segmentation/cell_boundaries.geojson.parquet",
    filename: "cell_boundaries.geojson.parquet",
    size: "112.4 MB",
    lastModified: "2026-02-22T08:51:00Z",
  },
  {
    key: "segmentation/phenotype_assignments.csv.parquet",
    filename: "phenotype_assignments.csv.parquet",
    size: "9.1 MB",
    lastModified: "2026-02-21T17:33:00Z",
  },
  {
    key: "segmentation/qc_metrics.csv.parquet",
    filename: "qc_metrics.csv.parquet",
    size: "1.2 MB",
    lastModified: "2026-02-21T17:33:00Z",
  },
] as const satisfies readonly S3FileEntry[];
