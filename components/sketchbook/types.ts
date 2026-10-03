export interface SketchbookPage {
  id?: string;
  title: string;
  place: string;
  url: string;
  alt?: string;
  description?: string;
  sanskritTitle?: string;
  year?: string;
  plateNumber?: string;
}

export type SketchbookThemeMode = 'default' | 'botanical' | 'chakra-heritage' | 'chakra-dark';

export interface SketchbookCustomTheme {
  paper?: string;
  ink?: string;
  inkSoft?: string;
  inkFaint?: string;
  hairline?: string;
  accent?: string;
  accentHover?: string;
  gold?: string;
  navy?: string;
  loupeRing?: string;
  loupeGrip?: string;
  fontFamily?: string;
  displayFont?: string;
}

export interface InteractiveSketchbookProps {
  /** Array of 2-page spread images and metadata */
  pages?: SketchbookPage[];
  /** Theme styling preset or custom token map */
  theme?: SketchbookThemeMode | SketchbookCustomTheme;
  /** Initial page index to display (0-based) */
  initialPage?: number;
  /** Whether optical magnifying glass is active */
  enableLoupe?: boolean;
  /** Whether 3D pointer tilt is active */
  enableTilt?: boolean;
  /** Whether zoom controls (+/-) are active */
  enableZoom?: boolean;
  /** Whether the introductory riffle page flip is enabled */
  enableRiffleIntro?: boolean;
  /** Whether to render the plate catalog index underneath */
  showIndex?: boolean;
  /** Whether to show next/prev chevron buttons */
  showNavigationArrows?: boolean;
  /** Whether to show the bottom floating toolbar */
  showToolBar?: boolean;
  /** Whether to show the plate title captions */
  showCaptions?: boolean;
  /** Optional top kicker badge text */
  kicker?: string;
  /** Additional CSS class names for the container */
  className?: string;
  /** Additional inline CSS styles for the container */
  style?: React.CSSProperties;
  /** Callback fired whenever the active page changes */
  onPageChange?: (index: number) => void;
  /** Optional container max-width (e.g. '1000px', '100%') */
  maxWidth?: string | number;
}
