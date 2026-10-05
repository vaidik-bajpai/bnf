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
      width: '360px',
      height: '240px',
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
      width: '360px',
      height: '240px',
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
      width: '360px',
      height: '240px',
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
      width: '360px',
      height: '240px',
    },
  },
};

/**
 * Interactive Gallery Grid:
 * Showcasing the three prompt-requested buttons side-by-side without card wrappers.
 */
export const PromptButtonsComparison: Story = {
  name: 'All Prompt Buttons Comparison',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: '#0a0d14',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Ignition Control
        </p>
        <div style={{ width: '320px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShaderButtons variant="ignition-button" mode="dark" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Light Switch (Rocker)
        </p>
        <div style={{ width: '320px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShaderButtons variant="light-switch" mode="dark" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Book a Demo (Dot Matrix)
        </p>
        <div style={{ width: '320px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShaderButtons variant="book-a-demo" mode="dark" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Standalone Across Themes:
 * Proves that ShaderButtons variants float cleanly with zero artificial card boxes
 * or background squares, while keeping 100% of their tactile shader effects, physics,
 * and glowing states across any background surface.
 */
export const StandaloneAcrossThemes: Story = {
  name: 'Standalone Across Themes',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const themes = [
      { name: 'Pure White Background', bg: '#ffffff', textColor: '#0f172a', mode: 'light' as const },
      { name: 'Slate Dark Background', bg: '#0f172a', textColor: '#f8fafc', mode: 'dark' as const },
      { name: 'Heritage Indigo Gradient', bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)', textColor: '#f8fafc', mode: 'dark' as const },
    ];

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {themes.map((theme) => (
          <div
            key={theme.name}
            style={{
              padding: '48px 32px',
              background: theme.bg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <h3
              style={{
                margin: '0 0 32px',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: theme.textColor,
                opacity: 0.9,
              }}
            >
              {theme.name} (True Standalone Buttons — Zero Card Boxes)
            </h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '1200px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: theme.textColor, opacity: 0.7, marginBottom: '8px' }}>
                  Ignition Button
                </p>
                <div style={{ width: '280px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShaderButtons variant="ignition-button" mode={theme.mode} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: theme.textColor, opacity: 0.7, marginBottom: '8px' }}>
                  Light Switch (Rocker)
                </p>
                <div style={{ width: '280px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShaderButtons variant="light-switch" mode={theme.mode} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: theme.textColor, opacity: 0.7, marginBottom: '8px' }}>
                  Book a Demo
                </p>
                <div style={{ width: '280px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShaderButtons variant="book-a-demo" mode={theme.mode} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: theme.textColor, opacity: 0.7, marginBottom: '8px' }}>
                  Thinking Button
                </p>
                <div style={{ width: '280px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShaderButtons variant="thinking-button" mode={theme.mode} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

