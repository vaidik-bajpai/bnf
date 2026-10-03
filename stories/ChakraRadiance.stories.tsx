import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { ChakraRadiance } from '@/components/effects/chakra-radiance/ChakraRadiance';
import '@/components/effects/chakra-radiance/styles.css';

const meta: Meta<typeof ChakraRadiance> = {
  title: 'Effects/ChakraRadiance',
  component: ChakraRadiance,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Ultra-high-end 2D screen-space lighting, radiance, and particle engine directly based on the architecture of the Vercel Marketing Hero ("triangle-led-4"). Features generalized modular 2D SDF shapes (Circle, Triangle, Rounded Box, Hexagon, Torus/Ring), 72 perimeter LED emitters, 24-ray direct raycasting with Interleaved Gradient Noise, analytic contact AO, Oklab color grading, and Lottes/AgX filmic tonemapping.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    shapeType: {
      control: 'select',
      options: ['circle', 'triangle', 'rounded-box', 'hexagon', 'torus'],
      description: 'Parametric 2D SDF shape of the radiance occluder',
      table: {
        defaultValue: { summary: 'circle' },
      },
    },
    theme: {
      control: 'select',
      options: [
        'golden-amber',
        'tricolor',
        'chakra-navy-gold',
        'vercel-monochrome',
        'cyan-hyper',
        'emerald-matrix',
      ],
      description: 'Color theme preset matching website palette',
      table: {
        defaultValue: { summary: 'golden-amber' },
      },
    },
    ledCount: {
      control: { type: 'range', min: 24, max: 96, step: 6 },
      description: 'Number of discrete perimeter LED emitters (default: 72)',
      table: {
        defaultValue: { summary: '72' },
      },
    },
    rayCount: {
      control: { type: 'range', min: 8, max: 48, step: 4 },
      description: 'Number of raycast trace samples per pixel (default: 24)',
      table: {
        defaultValue: { summary: '24' },
      },
    },
    decayPower: {
      control: { type: 'range', min: 0.8, max: 2.2, step: 0.05 },
      description: 'Inverse polynomial distance attenuation power p',
      table: {
        defaultValue: { summary: '1.25' },
      },
    },
    decayExp: {
      control: { type: 'range', min: 0.001, max: 0.015, step: 0.0005 },
      description: 'Exponential atmospheric absorption factor alpha',
      table: {
        defaultValue: { summary: '0.0045' },
      },
    },
    speed: {
      control: { type: 'range', min: 0.2, max: 3.0, step: 0.1 },
      description: 'Traveling pulse speed along perimeter',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    floorTheme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Floor surface theme (Dark absorbing slate vs Light studio albedo)',
      table: {
        defaultValue: { summary: 'dark' },
      },
    },
    floorAlbedo: {
      control: { type: 'range', min: 0.02, max: 0.5, step: 0.02 },
      description: 'Floor surface reflectivity / albedo',
      table: {
        defaultValue: { summary: '0.14' },
      },
    },
    grainIntensity: {
      control: { type: 'range', min: 0.0, max: 0.15, step: 0.01 },
      description: 'Procedural micro-surface noise grain scale-compensated for DPR',
      table: {
        defaultValue: { summary: '0.05' },
      },
    },
    ambientOcclusionStrength: {
      control: { type: 'range', min: 0.0, max: 1.0, step: 0.05 },
      description: 'Contact ambient occlusion shadow depth',
      table: {
        defaultValue: { summary: '0.65' },
      },
    },
    tonemapper: {
      control: 'select',
      options: ['lottes', 'aces', 'agx'],
      description: 'Filmic tonemapping operator in WGSL',
      table: {
        defaultValue: { summary: 'lottes' },
      },
    },
    rainbowSweep: {
      control: 'boolean',
      description: 'Deploy Oklab chromatic rainbow sweep on perimeter emitters',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showChakraWheel: {
      control: 'boolean',
      description: 'Show spinning Ashoka Chakra wheel inside the radiance core',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    chakraScale: {
      control: { type: 'range', min: 0.5, max: 1.4, step: 0.05 },
      description: 'Scale multiplier for the central Chakra wheel',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    showBadge: {
      control: 'boolean',
      description: 'Display active engine status badge (WebGPU vs WebGL2)',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Pointer tracking, click flare, and dynamic spark billow',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
  args: {
    shapeType: 'circle',
    size: [185, 185],
    theme: 'golden-amber',
    ledCount: 72,
    rayCount: 24,
    decayPower: 1.25,
    decayExp: 0.0045,
    speed: 1.0,
    floorTheme: 'dark',
    floorAlbedo: 0.14,
    grainIntensity: 0.05,
    ambientOcclusionStrength: 0.65,
    tonemapper: 'lottes',
    rainbowSweep: false,
    showChakraWheel: true,
    chakraScale: 1.0,
    showBadge: true,
    interactive: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '100vh', background: '#02040A', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChakraRadiance>;

/**
 * Flagship: Golden Amber Radiance Wheel:
 * Features 72 golden amber LEDs distributed along the circular rim of the spinning Ashoka Chakra wheel, casting volumetric screen-space radiance, contact AO, and interactive flare.
 */
export const ChakraGoldenRadiance: Story = {
  name: 'Chakra Golden Radiance (Flagship)',
  args: {
    shapeType: 'circle',
    size: [195, 300],
    theme: 'golden-amber',
    ledCount: 72,
    rayCount: 24,
    showChakraWheel: true,
    chakraScale: 1.0,
    ambientOcclusionStrength: 0.7,
  },
};

/**
 * Sacred Tricolour Radiance:
 * Saffron, pure luminous white, and India green LEDs orbiting the Chakra, casting multi-hued light across the dark floor.
 */
export const SacredTricolourRadiance: Story = {
  args: {
    shapeType: 'circle',
    size: [195, 195],
    theme: 'tricolor',
    ledCount: 84,
    rayCount: 28,
    speed: 1.2,
    showChakraWheel: true,
    chakraScale: 1.0,
  },
};

/**
 * Chakra Navy & Celestial Gold:
 * Ashoka Chakra navy blue paired with celestial golden amber radiance and deep contact shadows.
 */
export const ChakraNavyAndCelestialGold: Story = {
  args: {
    shapeType: 'circle',
    size: [195, 195],
    theme: 'chakra-navy-gold',
    ledCount: 72,
    decayPower: 1.3,
    decayExp: 0.004,
    showChakraWheel: true,
    chakraScale: 1.0,
  },
};

/**
 * Vercel Classic Triangle:
 * The direct recreation of Vercel Marketing Hero ("triangle-led-4") with 72 pure white and slate LEDs, raycasting into deep space.
 */
export const VercelClassicTriangle: Story = {
  args: {
    shapeType: 'triangle',
    size: [175, 175],
    theme: 'vercel-monochrome',
    ledCount: 72,
    rayCount: 28,
    showChakraWheel: false,
    ambientOcclusionStrength: 0.8,
  },
};

/**
 * Rounded Box Radiance:
 * Modern card / rounded rectangular SDF emitter with smooth corner radiuses.
 */
export const RoundedBoxRadiance: Story = {
  args: {
    shapeType: 'rounded-box',
    size: [210, 150],
    cornerRadius: 36,
    theme: 'golden-amber',
    ledCount: 72,
    showChakraWheel: false,
    ambientOcclusionStrength: 0.75,
  },
};

/**
 * Hexagon Radiance:
 * Precision 6-sided geometric polygon with Electric Cyan hyperdrive lighting.
 */
export const HexagonRadiance: Story = {
  args: {
    shapeType: 'hexagon',
    size: [190, 190],
    theme: 'cyan-hyper',
    ledCount: 72,
    showChakraWheel: false,
    ambientOcclusionStrength: 0.7,
  },
};

/**
 * Annular Torus Ring Radiance:
 * Dual-perimeter ring SDF with inner and outer light scattering around the spinning Chakra wheel.
 */
export const AnnularTorusRingRadiance: Story = {
  args: {
    shapeType: 'torus',
    size: [195, 195],
    cornerRadius: 18,
    theme: 'golden-amber',
    ledCount: 84,
    rayCount: 28,
    showChakraWheel: true,
    chakraScale: 0.95,
  },
};

/**
 * Interactive Chromatic Rainbow Sweep:
 * Oklab chromatic rainbow sweep deployed across the LED emitters with dynamic cursor spark billow.
 */
export const InteractiveRainbowSparkSweep: Story = {
  args: {
    shapeType: 'circle',
    size: [195, 195],
    theme: 'golden-amber',
    rainbowSweep: true,
    ledCount: 84,
    rayCount: 28,
    showChakraWheel: true,
    chakraScale: 1.0,
  },
};

/**
 * Light Mode Studio Radiance:
 * High-key studio floor theme demonstrating deep contact AO shadowing and subtle radiance bounce.
 */
export const LightModeStudioRadiance: Story = {
  args: {
    shapeType: 'circle',
    size: [195, 195],
    theme: 'chakra-navy-gold',
    floorTheme: 'light',
    floorAlbedo: 0.22,
    ambientOcclusionStrength: 0.9,
    showChakraWheel: true,
    chakraScale: 1.0,
  },
};

/**
 * Raw Radiance Field (Pure Geometry):
 * Chakra wheel hidden, showcasing the raw mathematical 2D screen-space lighting engine and beveled occluder rim.
 */
export const RawRadianceField: Story = {
  name: 'Raw Radiance Field (Pure Geometry)',
  args: {
    shapeType: 'circle',
    size: [185, 185],
    theme: 'golden-amber',
    showChakraWheel: false,
    ambientOcclusionStrength: 0.75,
  },
};
