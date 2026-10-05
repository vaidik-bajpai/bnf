import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import DitherVeilPage from '@/components/home/DitherVeilPage';
import { DitherVeilGatewayComposition } from '@/components/home/DitherVeilGatewayComposition';

const meta: Meta<typeof DitherVeilPage> = {
  title: 'Compositions/DitherVeilPage',
  component: DitherVeilPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full Page Composition featuring the High Density DitherVeil WebGL shader component with Chromatic Harmonic Tinting. The classical sculpted head is fixed in the exact center of the page against a seamless pitch-black (#000000) obsidian void. Features harmonic split-toning using incandescent sunset orange highlights, rich emerald green contours, deep complementary midnight teal shadows, and an electric turquoise rim.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    tintStyle: {
      control: 'select',
      options: ['chromatic', 'single'],
      description: 'Tinting mode: chromatic multi-stop harmonic ramp (orange & green) or uniform single color',
      table: {
        defaultValue: { summary: 'chromatic' },
      },
    },
    tintHighlight: {
      control: 'color',
      description: 'Luminous highlight tone for the chromatic ramp (e.g. #ff7a00 for Sunset Orange)',
      table: {
        defaultValue: { summary: '#ff7a00' },
      },
    },
    tintMidtone: {
      control: 'color',
      description: 'Sculptural midtone tone for the chromatic ramp (e.g. #10b981 for Emerald Green / Jade)',
      table: {
        defaultValue: { summary: '#10b981' },
      },
    },
    tintShadow: {
      control: 'color',
      description: 'Complementary deep shadow tone (e.g. #041e24 for Midnight Abyssal Teal / Navy)',
      table: {
        defaultValue: { summary: '#041e24' },
      },
    },
    tintPeak: {
      control: 'color',
      description: 'Specular peak highlight tone (e.g. #fff2a3 for Sunfire Champagne Gold)',
      table: {
        defaultValue: { summary: '#fff2a3' },
      },
    },
    underlyingTint: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description:
        'Blend factor of the underlying chromatic face tint (0.0 = raw photo, 1.0 = fully metallized harmonic face).',
      table: {
        defaultValue: { summary: '0.95' },
      },
    },
    scale: {
      control: { type: 'range', min: 0.3, max: 1.3, step: 0.05 },
      description:
        'Scale multiplier of the head. Regardless of scale, the head remains mathematically fixed in the exact center (0.5, 0.5) of the page.',
      table: {
        defaultValue: { summary: '0.65' },
      },
    },
    pattern: {
      control: 'select',
      options: ['lines', 'floyd', 'atkinson', 'bayer', 'noise'],
      description: 'Dithering algorithm kernel (lines for high-density banknote engraving)',
      table: {
        defaultValue: { summary: 'lines' },
      },
    },
    pixelSize: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Size of each discrete dither pixel block in screen pixels (1 for high-density micro detail)',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    paperColor: {
      control: 'color',
      description: 'Surface highlight color of the dithered face (e.g. #e2e8f0 for Silver Head)',
      table: {
        defaultValue: { summary: '#e2e8f0' },
      },
    },
    inkColor: {
      control: 'color',
      description: 'Primary dark substrate color (calibrated to #000000 for pitch black)',
      table: {
        defaultValue: { summary: '#000000' },
      },
    },
    rimColor: {
      control: 'color',
      description: 'Highlight rim color accent along the reveal wavefront (e.g. #00f5d4 for Electric Turquoise)',
      table: {
        defaultValue: { summary: '#00f5d4' },
      },
    },
    rim: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.02 },
      description: 'Width of the optical rim highlight along the mask boundary',
      table: {
        defaultValue: { summary: '0.1' },
      },
    },
    contrast: {
      control: { type: 'range', min: 0.5, max: 2.5, step: 0.05 },
      description: 'Luminance contrast multiplier applied before dithering',
      table: {
        defaultValue: { summary: '1.35' },
      },
    },
    clickBurst: {
      control: 'boolean',
      description: 'Emit radial shockwave ripple rings across the bust on pointer click',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    washEnabled: {
      control: 'boolean',
      description: 'Periodic tint wash sweeping vertically across the head from bottom to top',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    washPeriod: {
      control: { type: 'range', min: 1.0, max: 10.0, step: 0.5 },
      description: 'Cycle duration of the bottom-to-top periodic tint wash in seconds',
      table: {
        defaultValue: { summary: '4.5' },
      },
    },
    washWidth: {
      control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 },
      description: 'Spatial thickness of the sweeping wash band',
      table: {
        defaultValue: { summary: '0.35' },
      },
    },
    smoothReveal: {
      control: 'boolean',
      description: 'Use silky smooth continuous Hermite edge dissolve instead of pixelated Bayer "x" matrix artifacts',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    cursorEnabled: {
      control: 'boolean',
      description: 'Whether moving/hovering the cursor unmasks the head (default: false, so only the periodic wash wave animates)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showNavbar: {
      control: 'boolean',
      description: 'Show/hide top navigation header bar',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showHeroText: {
      control: 'boolean',
      description: 'Show/hide hero typography, badges, and CTA action buttons',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showSpecs: {
      control: 'boolean',
      description: 'Show/hide algorithmic specification strip cards',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showControlDeck: {
      control: 'boolean',
      description: 'Show/hide on-page interactive matrix parameter control deck',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showFeatures: {
      control: 'boolean',
      description: 'Show/hide theoretical architecture feature cards',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showFooter: {
      control: 'boolean',
      description: 'Show/hide pitch black footer',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    title: {
      control: 'text',
      description: 'Main hero headline text',
      table: {
        defaultValue: { summary: 'EMERALD // SOL' },
      },
    },
    subtitle: {
      control: 'text',
      description: 'Hero subtitle or mission statement',
      table: {
        defaultValue: {
          summary:
            'High-density 1px micro-engraving with harmonic orange & emerald split-toning and complementary midnight teal depths.',
        },
      },
    },
  },
  args: {
    src: '/dither-head.jpg',
    fit: 'contain',
    scale: 0.65,
    tintStyle: 'chromatic',
    tintHighlight: '#ff7a00',
    tintMidtone: '#10b981',
    tintShadow: '#041e24',
    tintPeak: '#fff2a3',
    underlyingTint: 0.95,
    washEnabled: true,
    washPeriod: 4.5,
    washWidth: 0.35,
    washIntensity: 0.95,
    smoothReveal: true,
    cursorEnabled: false,
    pattern: 'lines',
    pixelSize: 1,
    levels: 2,
    palette: 'duotone',
    inkColor: '#000000',
    paperColor: '#e2e8f0',
    contrast: 1.35,
    brightness: 0,
    revealRadius: 220,
    softness: 0.6,
    linger: 1.2,
    rimColor: '#00f5d4',
    rim: 0.1,
    reverse: false,
    wander: false,
    clickBurst: true,
    showNavbar: true,
    showHeroText: true,
    showSpecs: true,
    showControlDeck: true,
    showFeatures: true,
    showFooter: true,
    title: 'EMERALD // SOL',
    subtitle:
      'High-density 1px micro-engraving on silver head with harmonic orange & emerald chromatic unmasking in pitch-black void.',
    badgeText: 'CHROMATIC HARMONIC // ORANGE & GREEN',
  },
};

export default meta;
type Story = StoryObj<typeof DitherVeilPage>;

/**
 * Orange & Emerald Harmonic Tint (Flagship Composition):
 * Features the Silver Head at reduced 65% scale, fixed in the exact center of the pitch-black void.
 * When cursor hovers or shockwaves expand, the underlying face unmasks a breathtaking chromatic harmonic ramp:
 * - Incandescent Sunset Orange (#ff7a00) on brow, nose bridge, cheek crests & curls
 * - Translucent Emerald Jade (#10b981) across cheek slopes, jawline & neck planes
 * - Abyssal Midnight Teal (#041e24) in deep ocular recesses and drapery shadows
 * - Sunfire Champagne Gold (#fff2a3) on specular apexes
 * - Electric Turquoise (#00f5d4) boundary rim framing the reveal wavefront
 */
export const OrangeAndEmeraldHarmonic: Story = {
  name: 'Orange & Emerald Harmonic Tint (Flagship)',
  args: {
    scale: 0.65,
    tintStyle: 'chromatic',
    tintHighlight: '#ff7a00',
    tintMidtone: '#10b981',
    tintShadow: '#041e24',
    tintPeak: '#fff2a3',
    rimColor: '#00f5d4',
    rim: 0.1,
    underlyingTint: 0.95,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
    contrast: 1.35,
    title: 'EMERALD // SOL',
    subtitle:
      'Harmonic chromatic unmasking: radiant sunset orange highlights, rich emerald green contours, deep midnight teal shadows, and electric turquoise rim.',
    badgeText: 'CHROMATIC TRIAD // ORANGE & GREEN',
  },
};

/**
 * Sunset Jade Triad:
 * Rich blood-orange highlight (#ea580c) paired with deep jade green (#059669) and obsidian navy shadows (#08131f).
 */
export const SunsetJadeTriad: Story = {
  name: 'Sunset Jade Triad (Blood Orange & Deep Jade)',
  args: {
    scale: 0.65,
    tintStyle: 'chromatic',
    tintHighlight: '#ea580c',
    tintMidtone: '#059669',
    tintShadow: '#08131f',
    tintPeak: '#fef08a',
    rimColor: '#38bdf8',
    rim: 0.12,
    underlyingTint: 0.9,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
    contrast: 1.3,
    title: 'SUNSET // JADE',
    subtitle:
      'Deep blood orange crests and translucent jade green facial planes grounded in obsidian navy shadows.',
    badgeText: 'HARMONIC VARIANT // SUNSET JADE',
  },
};

/**
 * Cyberpunk Acid Fire:
 * High-voltage electric tangerine orange (#ff5500) with acid lime-green (#22c55e) and dark plum shadows (#1a0526).
 */
export const CyberpunkAcidFire: Story = {
  name: 'Cyberpunk Acid Fire (Neon Orange & Acid Green)',
  args: {
    scale: 0.65,
    tintStyle: 'chromatic',
    tintHighlight: '#ff5500',
    tintMidtone: '#22c55e',
    tintShadow: '#1a0526',
    tintPeak: '#fef9c3',
    rimColor: '#00f0ff',
    rim: 0.16,
    underlyingTint: 0.95,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
    contrast: 1.4,
    title: 'ACID // FIRE',
    subtitle:
      'High-voltage neon orange and acid lime-green chromatic dispersion with glowing hyper-cyan shockwave rim.',
    badgeText: 'CYBER CHROMATIC // ACID FIRE',
  },
};

/**
 * Centered Void with Orange & Emerald Reveal (Zen Mode):
 * Reduced 50% scale silver head in pure pitch black void with all navigation and text hidden.
 * Pure sculptural focus: move cursor across the face to reveal the orange, emerald, and teal harmonics.
 */
export const CenteredVoidOrangeEmerald: Story = {
  name: 'Centered Void (50% Scale - Zen Mode)',
  args: {
    scale: 0.5,
    tintStyle: 'chromatic',
    tintHighlight: '#ff7a00',
    tintMidtone: '#10b981',
    tintShadow: '#041e24',
    tintPeak: '#fff2a3',
    rimColor: '#00f5d4',
    rim: 0.1,
    underlyingTint: 0.95,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
    contrast: 1.35,
    clickBurst: true,
    wander: true,
    showNavbar: false,
    showHeroText: false,
    showSpecs: false,
    showControlDeck: false,
    showFeatures: false,
    showFooter: false,
  },
};

/**
 * Polished Silver Monochrome (Comparison):
 * Single uniform silver metallic unmasking for side-by-side aesthetic comparison with the chromatic orange & green palette.
 */
export const PolishedSilverChrome: Story = {
  name: 'Polished Silver Chrome (Monochrome Comparison)',
  args: {
    scale: 0.65,
    tintStyle: 'single',
    underlyingColor: '#e2e8f0',
    underlyingTint: 0.95,
    rimColor: '#38bdf8',
    rim: 0.08,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
    contrast: 1.35,
    title: 'SILVER // CHROME',
    subtitle:
      'Uniform polished silver chrome metallization for monochrome lovers.',
    badgeText: 'MONOCHROME // SILVER EDITION',
  },
};

/**
 * Periodic Wash & Silky Fluid Cursor:
 * Directly showcases the periodic chromatic wash wave sweeping from bottom to top across the centered sculpture,
 * combined with the fluid, silky-smooth Hermite cursor unmasking (no Bayer "x" matrix or pixelated dithering artifacts).
 */
export const PeriodicWashAndFluidCursor: Story = {
  name: 'Periodic Wash (Bottom→Top) & Fluid Cursor',
  args: {
    scale: 0.65,
    tintStyle: 'chromatic',
    tintHighlight: '#ff7a00',
    tintMidtone: '#10b981',
    tintShadow: '#041e24',
    tintPeak: '#fff2a3',
    rimColor: '#00f5d4',
    rim: 0.1,
    underlyingTint: 0.95,
    washEnabled: true,
    washPeriod: 4.0,
    washWidth: 0.38,
    washIntensity: 0.95,
    smoothReveal: true,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
    contrast: 1.35,
    title: 'PERIODIC // WASH',
    subtitle:
      'Continuous upward harmonic wash from base to crown with liquid Hermite cursor unmasking, replacing crunchy pixel matrix and "x" characters.',
    badgeText: 'PERIODIC SWEEP // SILKY SMOOTH',
  },
};

/**
 * DitherVeil + Gateway Flow Constellation Field Composition:
 * Pure pitch-black void (#000000) with zero text.
 * ThreeUI Gateway Flow ConstellationField streams trajectories with canonical default animation
 * passing BEHIND the centered 3D DitherVeil head.
 * Saffron beads on the left (#FFB866 Light, #FF9933 Base, #D96B00 Deep)
 * and green beads on the right (#5BBF72 Light, #138808 Base, #075E2E Deep).
 * Pure HTML/Canvas 2D, zero iframes, complete codebase ownership.
 */
export const DitherVeilWithGatewayFlow = {
  name: 'DitherVeil + Gateway Flow (Merged Behind Head - Zero Text)',
  render: () => (
    <DitherVeilGatewayComposition
      headScale={0.65}
      gatewaySpeed={1.0}
      gatewayDensity={1.0}
      washEnabled={true}
      washPeriod={4.5}
    />
  ),
};

/**
 * Dedicated Gateway Flow Scene Composition:
 * Self-contained composition component rendering ConstellationField (gateway-flow)
 * natively merged behind DitherVeil in pitch-black void with zero text.
 */
export const GatewayFlowCompositionScene = {
  name: 'Gateway Flow Composition Scene (Dedicated - Zero Text)',
  render: () => (
    <DitherVeilGatewayComposition
      headScale={0.65}
      gatewaySpeed={1.0}
      gatewayDensity={1.0}
      washEnabled={true}
      washPeriod={4.5}
    />
  ),
};

/**
 * Pure Pitch Black Page: Gateway Constellation + Dither Veil:
 * A clean, pitch-black (#000000) canvas with zero text.
 * Streaming Gateway Constellation trajectories with canonical default animation:
 * - Saffron beads on the left (#FFB866 Light, #FF9933 Base, #D96B00 Deep)
 * - Green beads on the right (#5BBF72 Light, #138808 Base, #075E2E Deep)
 * - Interactive click shockwave explosions
 * The trajectories merge seamlessly behind the centered Dither Veil head,
 * with its harmonic bottom-to-top chromatic wash animation fully intact.
 */
export const PitchBlackGatewayConstellation = {
  name: 'Pitch Black: Gateway Constellation & Dither Veil (Zero Text)',
  render: () => (
    <DitherVeilGatewayComposition
      headScale={0.65}
      gatewaySpeed={1.0}
      gatewayDensity={1.0}
      washEnabled={true}
      washPeriod={4.5}
    />
  ),
};

