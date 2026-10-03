import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { CharacterCarousel } from '@/src/shaders/character-carousel/CharacterCarousel';
import '@/src/shaders/threeui.css';

const meta: Meta<typeof CharacterCarousel> = {
  title: 'ThreeUI/CharacterCarousel',
  component: CharacterCarousel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Warm editorial card deck with framed portraits, numbered identity footers, paper grain, and a deep looping perspective rail (Source revision SHA-256 4c98939e0e2b).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filmstrip', 'wave'],
      description: 'Carousel perspective rail layout',
      table: {
        defaultValue: { summary: 'filmstrip' },
      },
    },
    speed: {
      control: { type: 'range', min: 0, max: 2.5, step: 0.1 },
      description: 'Continuous drift speed multiplier',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    scale: {
      control: { type: 'range', min: 0.7, max: 1.3, step: 0.05 },
      description: 'Card deck scale factor',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Atmospheric opacity',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    hue: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Color hue rotation in degrees',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    saturation: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Color saturation multiplier',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Scene brightness factor',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CharacterCarousel>;

/**
 * Configured Default: Filmstrip Variant.
 * Deep looping perspective rail with warm editorial card portraits,
 * numbered identity footers, paper grain, and subtle perspective drift.
 */
export const Filmstrip: Story = {
  args: {
    variant: 'filmstrip',
    speed: 1.0,
    scale: 1.0,
    opacity: 1.0,
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '100%',
      height: '100vh',
    },
  },
};

/**
 * Wave Variant:
 * Undulating undulating sinusoidal perspective wave across the card deck.
 */
export const Wave: Story = {
  args: {
    variant: 'wave',
    speed: 1.0,
    scale: 1.0,
    opacity: 1.0,
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '100%',
      height: '100vh',
    },
  },
};

/**
 * Slow Atmospheric Drift:
 * Gentle continuous motion with rich warm tonal values.
 */
export const SlowDrift: Story = {
  args: {
    variant: 'filmstrip',
    speed: 0.4,
    scale: 1.05,
    opacity: 1.0,
    hue: 15,
    saturation: 1.1,
    brightness: 1.0,
    style: {
      width: '100%',
      height: '100vh',
    },
  },
};
