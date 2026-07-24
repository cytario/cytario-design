import {
  AlertCircle,
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Ban,
  Bookmark,
  BookmarkCheck,
  Braces,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleDot,
  CircleSlash,
  Clock,
  Cloud,
  Columns2,
  Columns3,
  Copy,
  CreditCard,
  Database,
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
  KeyRound,
  Lasso,
  Layers,
  Layers2,
  LayoutDashboard,
  LayoutGrid,
  List,
  ListFilter,
  LogOut,
  Mail,
  MapPin,
  Maximize,
  Menu,
  Microscope,
  Minus,
  MoreVertical,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plug,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ScrollText,
  Search,
  SearchX,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Spline,
  Square,
  SquarePen,
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
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { GithubIcon } from "./icons/GithubIcon";

/** Union of every registered icon name. */
export type IconName =
  | "AlertCircle"
  | "AlertTriangle"
  | "AlignCenter"
  | "AlignLeft"
  | "AlignRight"
  | "Archive"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "ArrowUpRight"
  | "Ban"
  | "Bookmark"
  | "BookmarkCheck"
  | "Braces"
  | "Building2"
  | "Calendar"
  | "Check"
  | "CheckCircle"
  | "CheckCircle2"
  | "ChevronDown"
  | "ChevronRight"
  | "ChevronUp"
  | "Circle"
  | "CircleDot"
  | "CircleSlash"
  | "Clock"
  | "Cloud"
  | "Columns2"
  | "Columns3"
  | "Copy"
  | "CreditCard"
  | "Database"
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
  | "Github"
  | "Grid2x2"
  | "Grid3x3"
  | "Heart"
  | "Image"
  | "ImageOff"
  | "Inbox"
  | "Info"
  | "KeyRound"
  | "Lasso"
  | "Layers"
  | "Layers2"
  | "LayoutDashboard"
  | "LayoutGrid"
  | "Linkedin"
  | "List"
  | "ListFilter"
  | "LogOut"
  | "Mail"
  | "MapPin"
  | "Maximize"
  | "Menu"
  | "Microscope"
  | "Minus"
  | "MoreVertical"
  | "Network"
  | "PanelLeftClose"
  | "PanelLeftOpen"
  | "PanelRightClose"
  | "PanelRightOpen"
  | "Pencil"
  | "Plug"
  | "Plus"
  | "Power"
  | "PowerOff"
  | "RefreshCw"
  | "RotateCcw"
  | "RotateCw"
  | "ScrollText"
  | "Search"
  | "SearchX"
  | "Send"
  | "Settings"
  | "Shield"
  | "ShieldCheck"
  | "Spline"
  | "Square"
  | "SquarePen"
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
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight: ArrowUpRight,
  Ban,
  Bookmark,
  BookmarkCheck,
  Braces,
  Building2: Building2,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleDot,
  CircleSlash: CircleSlash,
  Clock,
  Cloud,
  Columns2,
  Columns3,
  Copy,
  CreditCard: CreditCard,
  Database: Database,
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
  Github: GithubIcon as unknown as LucideIcon,
  Grid2x2,
  Grid3x3,
  Heart,
  Image,
  ImageOff,
  Inbox,
  Info,
  KeyRound: KeyRound,
  Lasso,
  Layers,
  Layers2,
  LayoutDashboard: LayoutDashboard,
  LayoutGrid,
  Linkedin: LinkedinIcon as unknown as LucideIcon,
  List,
  ListFilter,
  LogOut,
  Mail,
  MapPin,
  Maximize,
  Menu,
  Microscope,
  Minus,
  MoreVertical,
  Network: Network,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plug,
  Plus,
  Power: Power,
  PowerOff: PowerOff,
  RefreshCw: RefreshCw,
  RotateCcw,
  RotateCw,
  ScrollText: ScrollText,
  Search,
  SearchX,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Spline,
  Square,
  SquarePen: SquarePen,
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
