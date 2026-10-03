import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { WarpFieldBackground } from '@/components/effects/warp-field/WarpFieldBackground';
import '@/components/effects/warp-field/styles.css';

const meta: Meta<typeof WarpFieldBackground> = {
  title: 'Effects/WarpFieldBackground',
  component: WarpFieldBackground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Nexus’s focused hero warp: 400 emerald additive streaks and 40 luminous tiles streaming through an authored deep-space fog field, built with pinned Three.js r128.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['streaks', 'letters', 'keycaps', 'hyperspace'],
      description: 'Warp field variant orchestration',
      table: {
        defaultValue: { summary: 'streaks' },
      },
    },
    speed: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Travel speed along the Z-axis',
      table: {
        defaultValue: { summary: '15' },
      },
    },
    streakOpacity: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Opacity scaling for line streaks',
      table: {
        defaultValue: { summary: '0.6' },
      },
    },
    tileOpacity: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Opacity scaling for luminous plane tiles or mesh layers',
      table: {
        defaultValue: { summary: '0.9' },
      },
    },
    fov: {
      control: { type: 'range', min: 45, max: 110, step: 1 },
      description: 'Perspective camera field of view',
      table: {
        defaultValue: { summary: '75' },
      },
    },
    brightness: {
      control: { type: 'range', min: 0.4, max: 2, step: 0.05 },
      description: 'Canvas color grade brightness multiplier',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    hue: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Canvas hue rotation in degrees',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    saturation: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Canvas color grade saturation multiplier',
      table: {
        defaultValue: { summary: '1' },
      },
    },
  },
  args: {
    variant: 'streaks',
    speed: 15,
    streakOpacity: 0.6,
    tileOpacity: 0.9,
    fov: 75,
    brightness: 1,
    hue: 0,
    saturation: 1,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WarpFieldBackground>;

/**
 * The original hero warp: 400 emerald additive streaks and 40 luminous tiles streaming through deep space fog.
 */
export const DefaultStreaks: Story = {
  args: {
    variant: 'streaks',
  },
};

/**
 * Hyperspace variant: 1200 streaks with high velocity tunnel and pulsing core glow.
 */
export const Hyperspace: Story = {
  args: {
    variant: 'hyperspace',
    speed: 20,
    streakOpacity: 0.8,
    tileOpacity: 0.95,
  },
};

/**
 * Keycaps variant: floating 3D mechanical keycaps with custom glyphs and glowing dust particles.
 */
export const Keycaps: Story = {
  args: {
    variant: 'keycaps',
    speed: 14,
    streakOpacity: 0.7,
    tileOpacity: 0.9,
  },
};

/**
 * Letters variant: 260 streaming alphanumeric character planes with orbital sway and drift.
 */
export const Letters: Story = {
  args: {
    variant: 'letters',
    speed: 16,
    streakOpacity: 0.7,
    tileOpacity: 0.9,
  },
};

/**
 * High speed warp jump effect.
 */
export const HighSpeedWarp: Story = {
  args: {
    variant: 'streaks',
    speed: 36,
    streakOpacity: 0.9,
    tileOpacity: 1.0,
    fov: 90,
  },
};

/**
 * Amber/Golden Grade: Color graded using hue-rotation to match the saffron/golden website theme.
 */
export const AmberGrade: Story = {
  args: {
    variant: 'streaks',
    hue: -125, // shifts emerald green to golden saffron amber
    saturation: 1.4,
    brightness: 1.15,
    speed: 16,
  },
};

/**
 * Contained in a card or banner frame (16:9 aspect ratio).
 */
export const InAspectRatioBox: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#040A1A',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '960px',
            aspectRatio: '16 / 9',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(229, 169, 60, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(229, 169, 60, 0.2)',
            position: 'relative',
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
};
