"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  ChartLine,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CirclePlus,
  Clock3,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  Hammer,
  History,
  Info,
  Languages,
  LayoutDashboard,
  Link2,
  Lock,
  LogOut,
  Menu,
  Moon,
  Network,
  Pencil,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  TriangleAlert,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconProps = React.SVGProps<SVGSVGElement> & {
  sx?: Record<string, unknown>;
};

function wrapIcon(Icon: LucideIcon) {
  const Wrapped = React.forwardRef<SVGSVGElement, IconProps>(({ sx, className, style, ...props }, ref) => {
    const fontSize = (sx?.fontSize as number | string | undefined) ?? undefined;
    return <Icon ref={ref} className={cn("h-4 w-4", className)} style={{ fontSize, ...style }} {...props} />;
  });
  Wrapped.displayName = `${Icon.displayName ?? "Icon"}Compat`;
  return Wrapped;
}

export const AccessTimeIcon = wrapIcon(Clock3);
export const AccessTimeRoundedIcon = wrapIcon(Clock3);
export const AddCircleOutlineIcon = wrapIcon(CirclePlus);
export const AddIcon = wrapIcon(Plus);
export const ArticleIcon = wrapIcon(FileText);
export const AssessmentOutlinedIcon = wrapIcon(BarChart3);
export const AutoFixHighIcon = wrapIcon(Sparkles);
export const AutoGraphIcon = wrapIcon(ChartLine);
export const AutoGraphRoundedIcon = wrapIcon(ChartLine);
export const BoltIcon = wrapIcon(Zap);
export const BuildIcon = wrapIcon(Wrench);
export const CalendarMonthIcon = wrapIcon(CalendarDays);
export const CheckCircleIcon = wrapIcon(CircleCheck);
export const CheckCircleOutlineIcon = wrapIcon(CircleCheck);
export const CheckCircleRoundedIcon = wrapIcon(CircleCheck);
export const CloseIcon = wrapIcon(X);
export const ContentCopyIcon = wrapIcon(Copy);
export const DarkModeRoundedIcon = wrapIcon(Moon);
export const DashboardIcon = wrapIcon(LayoutDashboard);
export const DeleteOutlineIcon = wrapIcon(Trash2);
export const DoneAllIcon = wrapIcon(CheckCheck);
export const DownloadIcon = wrapIcon(Download);
export const EditOutlinedIcon = wrapIcon(Pencil);
export const ErrorOutlineIcon = wrapIcon(AlertCircle);
export const ExpandMoreIcon = wrapIcon(ChevronDown);
export const ExpandMoreRoundedIcon = wrapIcon(ChevronDown);
export const HandymanIcon = wrapIcon(Hammer);
export const HandymanRoundedIcon = wrapIcon(Hammer);
export const HealthAndSafetyRoundedIcon = wrapIcon(ShieldCheck);
export const HistoryIcon = wrapIcon(History);
export const HubIcon = wrapIcon(Network);
export const InfoOutlinedIcon = wrapIcon(Info);
export const KeyboardArrowRightRoundedIcon = wrapIcon(ChevronRight);
export const LanguageIcon = wrapIcon(Languages);
export const LaunchIcon = wrapIcon(ExternalLink);
export const LightModeRoundedIcon = wrapIcon(Sun);
export const LinkIcon = wrapIcon(Link2);
export const LockRoundedIcon = wrapIcon(Lock);
export const LogoutIcon = wrapIcon(LogOut);
export const MenuBookRoundedIcon = wrapIcon(BookOpen);
export const MenuIcon = wrapIcon(Menu);
export const OpenInNewIcon = wrapIcon(ExternalLink);
export const PsychologyIcon = wrapIcon(Brain);
export const PublicIcon = wrapIcon(Globe2);
export const QueryStatsRoundedIcon = wrapIcon(ChartLine);
export const RefreshIcon = wrapIcon(RefreshCw);
export const RocketLaunchRoundedIcon = wrapIcon(Rocket);
export const SearchIcon = wrapIcon(Search);
export const SearchRoundedIcon = wrapIcon(Search);
export const SendRoundedIcon = wrapIcon(Send);
export const SettingsIcon = wrapIcon(Settings);
export const ShieldRoundedIcon = wrapIcon(Shield);
export const SpeedIcon = wrapIcon(Gauge);
export const StorageIcon = wrapIcon(Database);
export const TrendingUpIcon = wrapIcon(TrendingUp);
export const VerifiedUserIcon = wrapIcon(BadgeCheck);
export const WarningAmberIcon = wrapIcon(TriangleAlert);
