export function alpha(color: string, opacity: number) {
  if (!color) return color;
  if (color.startsWith("rgba(")) return color;
  if (color.startsWith("rgb(")) return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  if (!color.startsWith("#")) return color;

  const hex = color.replace("#", "");
  const normalized = hex.length === 3 ? hex.split("").map((x) => `${x}${x}`).join("") : hex;
  if (normalized.length !== 6) return color;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
