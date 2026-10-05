import React from "react";
import { CharacterCarousel, type CharacterCarouselProps } from "./CharacterCarousel";

export function CharacterFilmstrip(props: Omit<CharacterCarouselProps, "variant">) {
  return <CharacterCarousel variant="filmstrip" {...props} />;
}
