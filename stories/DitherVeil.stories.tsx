import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import DitherVeil from '@/components/DitherVeil';

const meta: Meta<typeof DitherVeil> = {
  title: 'Effects/DitherVeil',
  component: DitherVeil,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Isolated High Density DitherVeil WebGL shader component. Features 1px micro-engraving, invariant centered scale, and harmonic chromatic split-toning (incandescent sunset orange highlights, translucent emerald green midtones, deep midnight teal shadows, and electric turquoise rim).',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000000', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    scale: {
      control: { type: 'range', min: 0.25, max: 1.5, step: 0.05 },
      description: 'Scale multiplier of the head, fixed at exact center (0.5, 0.5)',
    },
    tintStyle: {
      control: 'select',
      options: ['chromatic', 'single'],
      description: 'Chromatic multi-stop harmonic ramp (orange & green) or single uniform color',
    },
    tintHighlight: {
      control: 'color',
      description: 'Highlight tone (e.g. #ff7a00 for Sunset Orange)',
    },
    tintMidtone: {
      control: 'color',
      description: 'Midtone tone (e.g. #10b981 for Emerald Green)',
    },
    tintShadow: {
      control: 'color',
      description: 'Shadow tone (e.g. #041e24 for Midnight Abyssal Teal)',
    },
    tintPeak: {
      control: 'color',
      description: 'Specular peak tone (e.g. #fff2a3 for Champagne Gold)',
    },
    underlyingTint: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Blend factor for the underlying face tint (0 = raw photo, 1 = metallic chrome)',
    },
    pattern: {
      control: 'select',
      options: ['lines', 'floyd', 'atkinson', 'bayer', 'noise'],
      description: 'Dithering algorithm pattern',
    },
    pixelSize: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Pixel block size in screen pixels (1 for high-density micro detail)',
    },
    paperColor: {
      control: 'color',
      description: 'Primary light/paper color (e.g. #e2e8f0 for Silver Head)',
    },
    inkColor: {
      control: 'color',
      description: 'Primary dark/ink color (#000000 for pitch black)',
    },
    rimColor: {
      control: 'color',
      description: 'Highlight rim color along the reveal frontier (e.g. #00f5d4 for Turquoise)',
    },
    rim: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.02 },
      description: 'Rim highlight width',
    },
    clickBurst: {
      control: 'boolean',
      description: 'Shockwave burst on click',
    },
    washEnabled: {
      control: 'boolean',
      description: 'Periodic tint wash sweeping vertically across the head from bottom to top',
    },
    washPeriod: {
      control: { type: 'range', min: 1.0, max: 10.0, step: 0.5 },
      description: 'Duration of one full bottom-to-top wash cycle in seconds',
    },
    washWidth: {
      control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 },
      description: 'Width of the sweeping wash band',
    },
    smoothReveal: {
      control: 'boolean',
      description: 'Use silky smooth continuous Hermite dissolve instead of pixelated Bayer "x" matrix artifacts',
    },
    cursorEnabled: {
      control: 'boolean',
      description: 'Whether moving/hovering the cursor unmasks the head (default: false, so only the periodic wash wave animates)',
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
    style: { width: '100%', height: '100%', backgroundColor: '#000000' },
  },
};

export default meta;
type Story = StoryObj<typeof DitherVeil>;

export const OrangeAndEmeraldHarmonic: Story = {
  name: 'Orange & Emerald Harmonic Tint',
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
  },
};

export const SunsetJadeTriad: Story = {
  name: 'Sunset Jade Triad (Blood Orange & Jade)',
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
  },
};

export const HighDensitySilverHead: Story = {
  name: 'High Density Silver Head (Monochrome Silver)',
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
  },
};

export const CenteredHeadCompact50: Story = {
  name: 'Centered Head (50% Compact Scale)',
  args: {
    scale: 0.5,
    tintStyle: 'chromatic',
    tintHighlight: '#ff7a00',
    tintMidtone: '#10b981',
    tintShadow: '#041e24',
    tintPeak: '#fff2a3',
    rimColor: '#00f5d4',
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
  },
};

export const PeriodicWashBottomToTop: Story = {
  name: 'Periodic Wash Sweep (Bottom → Top)',
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
    washPeriod: 3.8,
    washWidth: 0.35,
    washIntensity: 0.95,
    smoothReveal: true,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
  },
};

export const SilkyFluidCursor: Story = {
  name: 'Silky Fluid Cursor (No Pixel/ASCII "x" Artifacts)',
  args: {
    scale: 0.65,
    tintStyle: 'chromatic',
    tintHighlight: '#ff7a00',
    tintMidtone: '#10b981',
    tintShadow: '#041e24',
    tintPeak: '#fff2a3',
    rimColor: '#00f5d4',
    rim: 0.12,
    underlyingTint: 0.95,
    washEnabled: false,
    smoothReveal: true,
    revealRadius: 240,
    softness: 0.7,
    linger: 1.4,
    pattern: 'lines',
    pixelSize: 1,
    paperColor: '#e2e8f0',
    inkColor: '#000000',
  },
};

