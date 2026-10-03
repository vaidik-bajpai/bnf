export const NOCTURNE_TITLES: Record<string, string> = {};
export const NOCTURNE_VARIANTS = ["midnight", "aurora", "solstice"] as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];
export function buildNocturneDocument(...args: any[]): string {
  return "";
}
