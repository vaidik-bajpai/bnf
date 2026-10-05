import React from "react";
import { CharacterCarousel, type CharacterCarouselProps } from "./CharacterCarousel";

export function CharacterWave(props: Omit<CharacterCarouselProps, "variant">) {
  return <CharacterCarousel variant="wave" {...props} />;
}
