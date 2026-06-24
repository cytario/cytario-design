import {
  AlertCircle,
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Ban,
  Bookmark,
  BookmarkCheck,
  Braces,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleDot,
  Clock,
  Cloud,
  Columns2,
  Columns3,
  Copy,
  Download,
  Edit,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileSearch,
  FileSpreadsheet,
  FilterX,
  Folder,
  FolderPlus,
  FolderTree,
  Fullscreen,
  Grid2x2,
  Grid3x3,
  Heart,
  Image,
  ImageOff,
  Inbox,
  Info,
  Lasso,
  Layers,
  Layers2,
  LayoutGrid,
  List,
  ListFilter,
  LogOut,
  Mail,
  MapPin,
  Maximize,
  Microscope,
  Minus,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plug,
  Plus,
  RotateCcw,
  Search,
  SearchX,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Spline,
  Square,
  Star,
  Table,
  Tag,
  Trash2,
  Unplug,
  User,
  UserMinus,
  UserPlus,
  Users,
  UsersRound,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";

/** Union of every registered icon name. */
export type IconName =
  | "AlertCircle"
  | "AlertTriangle"
  | "AlignCenter"
  | "AlignLeft"
  | "AlignRight"
  | "Archive"
  | "ArrowDown"
  | "ArrowRight"
  | "ArrowUp"
  | "Ban"
  | "Bookmark"
  | "BookmarkCheck"
  | "Braces"
  | "Check"
  | "CheckCircle"
  | "CheckCircle2"
  | "ChevronDown"
  | "ChevronRight"
  | "ChevronUp"
  | "Circle"
  | "CircleDot"
  | "Clock"
  | "Cloud"
  | "Columns2"
  | "Columns3"
  | "Copy"
  | "Download"
  | "Edit"
  | "EllipsisVertical"
  | "ExternalLink"
  | "Eye"
  | "EyeOff"
  | "File"
  | "FileSearch"
  | "FileSpreadsheet"
  | "FilterX"
  | "Folder"
  | "FolderPlus"
  | "FolderTree"
  | "Fullscreen"
  | "Grid2x2"
  | "Grid3x3"
  | "Heart"
  | "Image"
  | "ImageOff"
  | "Inbox"
  | "Info"
  | "Lasso"
  | "Layers"
  | "Layers2"
  | "LayoutGrid"
  | "List"
  | "ListFilter"
  | "LogOut"
  | "Mail"
  | "MapPin"
  | "Maximize"
  | "Microscope"
  | "Minus"
  | "MoreVertical"
  | "PanelLeftClose"
  | "PanelLeftOpen"
  | "PanelRightClose"
  | "PanelRightOpen"
  | "Pencil"
  | "Plug"
  | "Plus"
  | "RotateCcw"
  | "Search"
  | "SearchX"
  | "Send"
  | "Settings"
  | "Shield"
  | "ShieldCheck"
  | "Spline"
  | "Square"
  | "Star"
  | "Table"
  | "Tag"
  | "Trash2"
  | "Unplug"
  | "User"
  | "UserMinus"
  | "UserPlus"
  | "Users"
  | "UsersRound"
  | "X"
  | "XCircle"
  | "ZoomIn"
  | "ZoomOut";

/**
 * Allowlist of icons available by name. Keys mirror the Lucide export name so
 * call sites read `<Icon icon="Search" />`. Add an entry here (and to IconName
 * above) before using a new icon — the explicit map keeps the bundle
 * tree-shakeable (no wildcard import of the full Lucide set).
 */
export const iconRegistry: Record<IconName, LucideIcon> = {
  AlertCircle,
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Ban,
  Bookmark,
  BookmarkCheck,
  Braces,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleDot,
  Clock,
  Cloud,
  Columns2,
  Columns3,
  Copy,
  Download,
  Edit,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileSearch,
  FileSpreadsheet,
  FilterX,
  Folder,
  FolderPlus,
  FolderTree,
  Fullscreen,
  Grid2x2,
  Grid3x3,
  Heart,
  Image,
  ImageOff,
  Inbox,
  Info,
  Lasso,
  Layers,
  Layers2,
  LayoutGrid,
  List,
  ListFilter,
  LogOut,
  Mail,
  MapPin,
  Maximize,
  Microscope,
  Minus,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plug,
  Plus,
  RotateCcw,
  Search,
  SearchX,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Spline,
  Square,
  Star,
  Table,
  Tag,
  Trash2,
  Unplug,
  User,
  UserMinus,
  UserPlus,
  Users,
  UsersRound,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
};
