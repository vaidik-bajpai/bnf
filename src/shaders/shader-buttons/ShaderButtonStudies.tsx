import type { ReactNode } from "react";
import type { NeuformIsolatedEffectProps } from "../neuform-isolated/NeuformIsolatedEffects";

export type ShaderButtonStudyVariant =
  | "liquid-glass"
  | "intelligence"
  | "holo-foil"
  | "particles"
  | "voice-orb"
  | "water"
  | "dither-hold"
  | "lava-lamp"
  | "gold"
  | "ink";

export function ShaderButtonStudy(
  props: NeuformIsolatedEffectProps & { variant: ShaderButtonStudyVariant },
): ReactNode {
  return null;
}
