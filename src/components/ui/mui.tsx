"use client";
// @ts-nocheck

import * as React from "react";
import { cn } from "@/lib/utils";
import { useColorMode } from "@/components/ThemeRegistry";

function buildTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return {
    palette: {
      mode,
      primary: { main: isDark ? "#FFFFFF" : "#111111" },
      secondary: { main: isDark ? "#38BDF8" : "#2563EB" },
      background: { default: isDark ? "#020617" : "#FFFFFF", paper: isDark ? "#0F172A" : "#FFFFFF" },
      text: { primary: isDark ? "#F8FAFC" : "#0F172A", secondary: isDark ? "#94A3B8" : "#475569" },
      divider: isDark ? "rgba(255,255,255,0.16)" : "#E5E7EB",
      error: { main: "#ef4444" },
      success: { main: "#10b981" },
    },
    zIndex: { drawer: 1200, appBar: 1100 },
  };
}

export function useTheme() {
  const { mode } = useColorMode();
  return React.useMemo(() => buildTheme(mode), [mode]);
}

function alphaHex(color: string, opacity: number) {
  const hex = color.replace("#", "");
  const safe = hex.length === 3 ? hex.split("").map((x) => `${x}${x}`).join("") : hex;
  if (safe.length !== 6) return color;
  const r = Number.parseInt(safe.slice(0, 2), 16);
  const g = Number.parseInt(safe.slice(2, 4), 16);
  const b = Number.parseInt(safe.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function alpha(color: string, opacity: number) {
  if (!color) return color;
  if (color.startsWith("rgba(")) return color;
  if (color.startsWith("rgb(")) return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  if (color.startsWith("#")) return alphaHex(color, opacity);
  return color;
}

function responsive(value: any) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  if ("lg" in value) return value.lg;
  if ("md" in value) return value.md;
  if ("sm" in value) return value.sm;
  if ("xs" in value) return value.xs;
  return Object.values(value)[0];
}

function sxToStyle(sx: any, theme: any) {
  if (!sx) return {};
  const src = typeof sx === "function" ? sx(theme) : sx;
  const out: Record<string, any> = {};
  Object.entries(src || {}).forEach(([k, v]) => {
    if (k.startsWith("&") || k.includes(":")) return;
    const resolved = responsive(v);
    out[k] = typeof resolved === "function" ? resolved(theme) : resolved;
  });
  return out;
}

function withStyle(props: any, theme: any) {
  const { sx, style } = props;
  return { ...sxToStyle(sx, theme), ...(style || {}) };
}

function polymorphic(props: any, fallback: any) {
  return props.component || fallback;
}

type CompatProps = {
  sx?: Record<string, string | number | boolean | undefined | Record<string, any> | ((theme: any) => any)>;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

export function Box(props: CompatProps) {
  const theme = useTheme();
  const { component, className, children, ...rest } = props;
  const Comp = polymorphic(props, "div");
  return <Comp className={className} style={withStyle(props, theme)} {...rest}>{children}</Comp>;
}

export function Container(props: CompatProps) {
  const theme = useTheme();
  const { className, children, ...rest } = props;
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", className)} style={withStyle(props, theme)} {...rest}>{children}</div>;
}

export function Stack(props: CompatProps & { direction?: any; spacing?: any }) {
  const theme = useTheme();
  const { direction = "column", spacing = 0, className, children, ...rest } = props;
  const gap = typeof spacing === "number" ? `${spacing * 0.5}rem` : spacing;
  return (
    <div
      className={cn("flex", className)}
      style={{ display: "flex", flexDirection: responsive(direction), gap, ...withStyle(props, theme) }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Typography(props: CompatProps & { variant?: string }) {
  const theme = useTheme();
  const { variant = "body1", component, className, children, noWrap, ...rest } = props;
  const Comp = component || (String(variant).startsWith("h") ? variant : "p");
  const byVariant: Record<string, string> = {
    h1: "text-4xl font-extrabold tracking-tight",
    h2: "text-3xl font-bold tracking-tight",
    h3: "text-2xl font-bold",
    h4: "text-xl font-semibold",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
    subtitle1: "text-base font-medium",
    subtitle2: "text-sm font-semibold",
    body1: "text-base",
    body2: "text-sm",
    caption: "text-xs",
    overline: "text-[10px] uppercase tracking-[0.12em]",
  };
  return <Comp className={cn(byVariant[variant] || byVariant.body1, noWrap && "truncate", className)} style={withStyle(props, theme)} {...rest}>{children}</Comp>;
}

export function Button(props: CompatProps) {
  const theme = useTheme();
  const { component, startIcon, endIcon, fullWidth, className, children, ...rest } = props;
  const Comp = component || "button";
  return (
    <Comp className={cn("inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent", fullWidth && "w-full", className)} style={withStyle(props, theme)} {...rest}>
      {startIcon}
      <span className="truncate">{children}</span>
      {endIcon}
    </Comp>
  );
}

export function IconButton(props: CompatProps & { size?: "small" | "medium" | "large" }) {
  const theme = useTheme();
  const { className, children, size = "medium", ...rest } = props;
  const dim = size === "small" ? "h-8 w-8" : size === "large" ? "h-11 w-11" : "h-10 w-10";
  return <button type="button" className={cn("inline-flex items-center justify-center rounded-md hover:bg-accent", dim, className)} style={withStyle(props, theme)} {...rest}>{children}</button>;
}

export function AppBar(props: CompatProps) {
  return <header {...props} style={withStyle(props, useTheme())} />;
}

export function Toolbar(props: CompatProps) {
  const theme = useTheme();
  const { className, children, ...rest } = props;
  return <div className={cn("flex items-center", className)} style={withStyle(props, theme)} {...rest}>{children}</div>;
}

export function Card(props: CompatProps) {
  const theme = useTheme();
  const { className, children, ...rest } = props;
  return <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} style={withStyle(props, theme)} {...rest}>{children}</div>;
}

export function CardContent(props: CompatProps) {
  const theme = useTheme();
  const { className, children, ...rest } = props;
  return <div className={cn("p-6", className)} style={withStyle(props, theme)} {...rest}>{children}</div>;
}

export function Chip(props: CompatProps) {
  const theme = useTheme();
  const { className, label, children, ...rest } = props;
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", className)} style={withStyle(props, theme)} {...rest}>{label ?? children}</span>;
}

export function Alert(props: CompatProps & { severity?: "error" | "warning" | "info" | "success" }) {
  const theme = useTheme();
  const { className, severity = "info", children, ...rest } = props;
  const tone = severity === "error" ? "border-red-300 bg-red-50 text-red-700" : severity === "warning" ? "border-amber-300 bg-amber-50 text-amber-700" : severity === "success" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-sky-300 bg-sky-50 text-sky-700";
  return <div className={cn("rounded-md border px-3 py-2 text-sm", tone, className)} style={withStyle(props, theme)} {...rest}>{children}</div>;
}

export function TextField(props: CompatProps & { onChange?: (event: any) => void }) {
  const theme = useTheme();
  const { label, helperText, error, multiline, rows, minRows, select, fullWidth, className, children, InputProps, ...rest } = props;
  const content = select ? (
    <select className={cn("h-10 rounded-md border border-input bg-background px-3 text-sm", fullWidth && "w-full", error && "border-red-400")} {...rest}>
      {children}
    </select>
  ) : multiline ? (
    <textarea className={cn("w-full rounded-md border border-input bg-background px-3 py-2 text-sm", error && "border-red-400")} rows={rows ?? minRows ?? 4} {...rest} />
  ) : (
    <div className={cn("relative", fullWidth && "w-full")}>
      {InputProps?.startAdornment ? <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">{InputProps.startAdornment}</span> : null}
      <input className={cn("h-10 w-full rounded-md border border-input bg-background px-3 text-sm", InputProps?.startAdornment && "pl-8", error && "border-red-400", className)} {...rest} />
      {InputProps?.endAdornment ? <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">{InputProps.endAdornment}</span> : null}
    </div>
  );

  return (
    <label className={cn("grid gap-1.5", fullWidth && "w-full")} style={withStyle(props, theme)}>
      {label ? <span className="text-sm font-medium">{label}</span> : null}
      {content}
      {helperText ? <span className={cn("text-xs", error ? "text-red-600" : "text-muted-foreground")}>{helperText}</span> : null}
    </label>
  );
}

export function Avatar(props: CompatProps) {
  const theme = useTheme();
  const { className, children, ...rest } = props;
  return <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold", className)} style={withStyle(props, theme)} {...rest}>{children}</div>;
}

export function Drawer(props: CompatProps & { open?: boolean; variant?: "temporary" | "permanent" }) {
  const theme = useTheme();
  const { variant = "temporary", open, className, children, ...rest } = props;
  if (variant === "temporary" && !open) return null;
  return <aside className={className} style={withStyle(props, theme)} {...rest}>{children}</aside>;
}

export function Collapse(props: CompatProps & { in?: boolean }) {
  if (!props.in) return null;
  return <>{props.children}</>;
}

export function CircularProgress(props: CompatProps) {
  const theme = useTheme();
  const { className, ...rest } = props;
  return <div className={cn("h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground", className)} style={withStyle(props, theme)} {...rest} />;
}

export function Grid(props: CompatProps & { container?: boolean; spacing?: number }) {
  const theme = useTheme();
  const { container, spacing = 0, className, children, ...rest } = props;
  return <div className={cn(container ? "grid" : "", className)} style={{ ...(container ? { gap: `${spacing * 0.5}rem` } : {}), ...withStyle(props, theme) }} {...rest}>{children}</div>;
}

export const Grid2 = Grid;

export function Divider(props: CompatProps) {
  const theme = useTheme();
  return <hr className={cn("border-border", props.className)} style={withStyle(props, theme)} />;
}

export function Badge(props: CompatProps) {
  return <Chip {...props} />;
}

export function Tooltip(props: CompatProps) {
  return <>{props.children}</>;
}

export function LinearProgress(props: CompatProps & { value?: number }) {
  const value = Number(props.value ?? 0);
  return (
    <div className="h-2 w-full rounded bg-muted" style={withStyle(props, useTheme())}>
      <div className="h-2 rounded bg-primary" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Accordion(props: CompatProps & { onChange?: (event: any, expanded: boolean) => void }) {
  return <details className={props.className} style={withStyle(props, useTheme())}><summary>{props.summary ?? "Details"}</summary>{props.children}</details>;
}

export function AccordionSummary(props: CompatProps) {
  return <div {...props}>{props.children}</div>;
}

export function AccordionDetails(props: CompatProps) {
  return <div {...props}>{props.children}</div>;
}

export function Checkbox(props: CompatProps & { onChange?: (event: any) => void }) {
  return <input type="checkbox" {...props} />;
}

export function FormControlLabel(props: CompatProps) {
  const { control, label } = props;
  return <label className="inline-flex items-center gap-2">{control}{label}</label>;
}

export function Switch(props: CompatProps) {
  return <input type="checkbox" {...props} />;
}

export function Dialog(props: CompatProps & { open?: boolean }) {
  if (!props.open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">{props.children}</div>;
}

export function DialogTitle(props: CompatProps) {
  return <h3 className="text-lg font-semibold" {...props}>{props.children}</h3>;
}

export function DialogContent(props: CompatProps) {
  return <div className={cn("rounded-lg border bg-background p-4", props.className)}>{props.children}</div>;
}

export function DialogActions(props: CompatProps) {
  return <div className={cn("mt-3 flex items-center justify-end gap-2", props.className)}>{props.children}</div>;
}

export function Tabs(props: CompatProps & { onChange?: (event: any, value: any) => void }) {
  return <div className={props.className}>{props.children}</div>;
}

export function Tab(props: CompatProps) {
  return <button type="button" className={cn("rounded-md px-3 py-1.5 text-sm", props.className)}>{props.label ?? props.children}</button>;
}

export function MenuItem(props: CompatProps) {
  return <option {...props}>{props.children}</option>;
}

export function Pagination(props: CompatProps & { count?: number; page?: number; onChange?: (event: any, page: number) => void }) {
  const { count = 1, page = 1, onChange } = props;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" className={cn("h-7 min-w-7 rounded border px-2 text-xs", p === page && "bg-accent")} onClick={(e) => onChange?.(e, p)}>
          {p}
        </button>
      ))}
    </div>
  );
}

export function InputAdornment(props: CompatProps) {
  return <span className={cn("inline-flex items-center", props.className)}>{props.children}</span>;
}

export function Link(props: CompatProps) {
  const { children, ...rest } = props;
  return <a {...rest}>{children}</a>;
}

export function List(props: CompatProps) {
  return <ul className={props.className} style={withStyle(props, useTheme())}>{props.children}</ul>;
}

export function ListItemButton(props: CompatProps) {
  return <button type="button" className={cn("w-full text-left", props.className)} style={withStyle(props, useTheme())} {...props}>{props.children}</button>;
}

export function ListItemText(props: CompatProps & { primary?: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <div className={props.className} style={withStyle(props, useTheme())}>
      {props.primary ? <div>{props.primary}</div> : null}
      {props.secondary ? <div className="text-xs text-muted-foreground">{props.secondary}</div> : null}
      {props.children}
    </div>
  );
}
