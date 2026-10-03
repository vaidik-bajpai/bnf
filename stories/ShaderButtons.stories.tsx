import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { ShaderButtons } from '@/src/shaders/shader-buttons/ShaderButtons';
import '@/src/shaders/threeui.css';

const meta: Meta<typeof ShaderButtons> = {
  title: 'ThreeUI/ShaderButtons',
  component: ShaderButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'High-end tactile shader and physics controls from ThreeUI (Source revision SHA-256 6f56c4f91814). Features WebGL, Canvas 2D, Three.js, and spring physics with real-time tactile response.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'ignition-button',
        'light-switch',
        'book-a-demo',
        'star-portal',
        'induction-button',
        'plasma-button',
        'tactile-button',
        'thinking-button',
        'raking-light-pill',
        'glassy-split',
        'generate-site',
        'chrome-upload',
        'iridescent-glass',
        'create-and-get-started',
        'soft-surface',
        'balloon',
        'start-growing',
        'car-controls',
      ],
      description: 'Tactile control study variant',
      table: {
        defaultValue: { summary: 'ignition-button' },
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
      description: 'Color saturation factor',
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
type Story = StoryObj<typeof ShaderButtons>;

/**
 * Ignition Button:
 * A raw-WebGL ambient field with a tactile ignition control, glowing core,
 * perimeter spark discharge, and live physics depression.
 */
export const IgnitionButtonStory: Story = {
  name: 'Ignition Button',
  args: {
    variant: 'ignition-button',
    mode: 'dark',
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '420px',
      height: '340px',
      borderRadius: '16px',
      overflow: 'hidden',
    },
  },
};

/**
 * Light Switch:
 * A molded day and night rocker switch with tactile spring motion,
 * ambient surface shading, and state illumination.
 */
export const LightSwitchStory: Story = {
  name: 'Light Switch',
  args: {
    variant: 'light-switch',
    mode: 'dark',
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '420px',
      height: '340px',
      borderRadius: '16px',
      overflow: 'hidden',
    },
  },
};

/**
 * Light Switch (Light Mode):
 * Day mode with crisp light molded surface and subtle contact shadows.
 */
export const LightSwitchLightMode: Story = {
  name: 'Light Switch (Light Mode)',
  args: {
    variant: 'light-switch',
    mode: 'light',
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '420px',
      height: '340px',
      borderRadius: '16px',
      overflow: 'hidden',
    },
  },
};

/**
 * Book a Demo:
 * A dark precision control with an animated lime-green dot matrix arrow,
 * sub-pixel raster glow, and hover acceleration.
 */
export const BookADemoStory: Story = {
  name: 'Book a Demo',
  args: {
    variant: 'book-a-demo',
    mode: 'dark',
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    style: {
      width: '420px',
      height: '340px',
      borderRadius: '16px',
      overflow: 'hidden',
    },
  },
};

/**
 * Interactive Gallery Grid:
 * Showcasing the three prompt-requested buttons side-by-side.
 */
export const PromptButtonsComparison: Story = {
  name: 'All Prompt Buttons Comparison',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: '#0a0d14',
        minHeight: '100vh',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.1em' }}>
          IGNITION CONTROL
        </p>
        <div style={{ width: '360px', height: '300px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ShaderButtons variant="ignition-button" mode="dark" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.1em' }}>
          LIGHT SWITCH (ROCKER)
        </p>
        <div style={{ width: '360px', height: '300px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ShaderButtons variant="light-switch" mode="dark" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.1em' }}>
          BOOK A DEMO (DOT MATRIX)
        </p>
        <div style={{ width: '360px', height: '300px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ShaderButtons variant="book-a-demo" mode="dark" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  ),
};
