import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { RectangleButtons } from '@/src/shaders/rectangle-buttons/RectangleButtons';
import '@/src/shaders/threeui.css';

const meta: Meta<typeof RectangleButtons> = {
  title: 'ThreeUI/RectangleButtons',
  component: RectangleButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Geometric tactile CTA and interaction controls from ThreeUI (Source revision SHA-256 ff30e28c2781). Features pointer-positioned ink blooms, magnetic physics drift, duplicate sliding typography, and responsive themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'bloom-outline-button',
        'dark-pill',
        'launch-button',
        'dot-border-button',
        'floating-dots-cta',
        'sliding-text-cta',
        'gradient-beam-cta',
        'gradient-pill-button',
        'generate-button',
        'glassmorphism-cta',
        'spinning-border-button',
        'gradient-cta',
        'lumen-cta',
        'lumen-cta-ghost',
        'trochil-signal',
        'attune-thermal',
        'tideform-outline',
        'understory-arrow-pill',
        'meridian-keycap-primary',
        'meridian-keycap-secondary',
        'halvorsen-arrow-pill',
        'aster-glass-access',
        'aster-glass-arrow',
        'ember-keycap',
      ],
      description: 'Button geometry and interaction variant',
      table: {
        defaultValue: { summary: 'bloom-outline-button' },
      },
    },
    mode: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Color theme mode',
      table: {
        defaultValue: { summary: 'dark' },
      },
    },
    hue: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Color hue offset (degrees)',
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
      description: 'Brightness multiplier',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RectangleButtons>;

/**
 * Bloom Outline Button (Dark Mode):
 * An outlined seasonal CTA with a pale blossom edge, paired dots,
 * pointer-positioned ink bloom, magnetic drift, and sliding duplicate label.
 */
export const BloomOutlineDark: Story = {
  name: 'Bloom Outline Button (Dark)',
  args: {
    variant: 'bloom-outline-button',
    mode: 'dark',
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '420px',
      height: '320px',
      borderRadius: '16px',
    },
  },
};

/**
 * Bloom Outline Button (Light Mode):
 * Inverted seasonal aesthetic with deep berry outline and crisp cream backdrop.
 */
export const BloomOutlineLight: Story = {
  name: 'Bloom Outline Button (Light)',
  args: {
    variant: 'bloom-outline-button',
    mode: 'light',
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '420px',
      height: '320px',
      borderRadius: '16px',
    },
  },
};

/**
 * Side-by-Side Theme Comparison:
 * Light and dark modes rendered together with active pointer interaction.
 */
export const BloomOutlineComparison: Story = {
  name: 'Theme Comparison',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: '#0d1117',
        minHeight: '100vh',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.1em' }}>
          DARK BLOOM OUTLINE
        </p>
        <div style={{ width: '380px', height: '300px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <RectangleButtons variant="bloom-outline-button" mode="dark" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.1em' }}>
          LIGHT BLOOM OUTLINE
        </p>
        <div style={{ width: '380px', height: '300px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <RectangleButtons variant="bloom-outline-button" mode="light" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  ),
};
