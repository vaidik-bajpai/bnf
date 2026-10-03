export { InteractiveSketchbook } from './InteractiveSketchbook';
export {
  DEFAULT_BOTANICAL_PAGES,
  CHAKRA_HERITAGE_PAGES,
  CHAKRA_DARK_PAGES,
} from './platesData';
export type {
  SketchbookPage,
  InteractiveSketchbookProps,
  SketchbookThemeMode,
  SketchbookCustomTheme,
} from './types';

// Also re-export the registered ThreeUI full landing page frame for convenience
export { MengToSketchbookLandingPage } from '@/src/shaders/landing-pages/LandingPages';
