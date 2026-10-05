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
      width: '320px',
      height: '160px',
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
      width: '320px',
      height: '160px',
    },
  },
};

/**
 * Side-by-Side Theme Comparison:
 * Light and dark modes rendered together with active pointer interaction without card wrappers.
 */
export const BloomOutlineComparison: Story = {
  name: 'Theme Comparison',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '48px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: '#0d1117',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Dark Bloom Outline
        </p>
        <div style={{ width: '320px', height: '240px', overflow: 'hidden' }}>
          <RectangleButtons
            variant="bloom-outline-button"
            mode="dark"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Light Bloom Outline
        </p>
        <div style={{ width: '320px', height: '240px', overflow: 'hidden' }}>
          <RectangleButtons
            variant="bloom-outline-button"
            mode="light"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Standalone Across Themes:
 * Proves that RectangleButtons variants float cleanly with zero artificial card boxes
 * or background squares, while keeping 100% of their tactile effects, magnetic drift,
 * pointer ink bloom, and physical styling across any background surface.
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
                  Bloom Outline
                </p>
                <div style={{ width: '240px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RectangleButtons variant="bloom-outline-button" mode={theme.mode} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: theme.textColor, opacity: 0.7, marginBottom: '8px' }}>
                  Lumen CTA
                </p>
                <div style={{ width: '240px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RectangleButtons variant="lumen-cta" mode={theme.mode} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: theme.textColor, opacity: 0.7, marginBottom: '8px' }}>
                  Launch Button
                </p>
                <div style={{ width: '240px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RectangleButtons variant="launch-button" mode={theme.mode} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: theme.textColor, opacity: 0.7, marginBottom: '8px' }}>
                  Attune Thermal
                </p>
                <div style={{ width: '240px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RectangleButtons variant="attune-thermal" mode={theme.mode} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

