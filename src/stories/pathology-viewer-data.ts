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
