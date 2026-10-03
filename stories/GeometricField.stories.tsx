import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { GeometricFieldBackground } from '@/components/effects/geometric-field/GeometricFieldBackground';
import '@/components/effects/geometric-field/styles.css';

const meta: Meta<typeof GeometricFieldBackground> = {
  title: 'Effects/GeometricFieldBackground',
  component: GeometricFieldBackground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'High-end procedural 3D geometric light structure inspired by the visual language of Vercel’s homepage. Built with WebGL/Three.js custom GLSL shaders, featuring dense luminous points, precision structural wireframe contours, traveling illumination waves, and soft atmospheric back-scatter bloom.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['monolith', 'tetrahedron', 'hyperboloid', 'horizon-grid'],
      description: 'Geometric architectural structure variant',
      table: {
        defaultValue: { summary: 'monolith' },
      },
    },
    pointDensity: {
      control: 'select',
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Density of procedural luminous points',
      table: {
        defaultValue: { summary: 'high' },
      },
    },
    pointSize: {
      control: { type: 'range', min: 0.8, max: 4.5, step: 0.1 },
      description: 'Base size of the luminous point primitives',
      table: {
        defaultValue: { summary: '1.8' },
      },
    },
    pointBrightness: {
      control: { type: 'range', min: 0.2, max: 2.5, step: 0.1 },
      description: 'Luminance and specular intensity of points',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    lineOpacity: {
      control: { type: 'range', min: 0.05, max: 0.9, step: 0.05 },
      description: 'Opacity of structural wireframe contour ribs',
      table: {
        defaultValue: { summary: '0.35' },
      },
    },
    wireframe: {
      control: 'boolean',
      description: 'Toggle structural contour wireframe lines',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 2.0, step: 0.05 },
      description: 'Atmospheric back-scatter bloom intensity',
      table: {
        defaultValue: { summary: '0.85' },
      },
    },
    speed: {
      control: { type: 'range', min: 0, max: 3.0, step: 0.1 },
      description: 'Subtle continuous motion speed multiplier',
      table: {
        defaultValue: { summary: '1.0' },
      },
    },
    tone: {
      control: 'select',
      options: ['pure', 'cool', 'silver', 'warm'],
      description: 'Monochrome grading palette',
      table: {
        defaultValue: { summary: 'pure' },
      },
    },
    bloomHaze: {
      control: 'boolean',
      description: 'Toggle procedural volumetric back-scatter plane',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Smooth mouse-tracking 3D parallax',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
  args: {
    variant: 'monolith',
    pointDensity: 'high',
    pointSize: 1.8,
    pointBrightness: 1.0,
    lineOpacity: 0.35,
    wireframe: true,
    glowIntensity: 0.85,
    speed: 1.0,
    tone: 'pure',
    bloomHaze: true,
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
type Story = StoryObj<typeof GeometricFieldBackground>;

/**
 * Flagship Monolith Prism (Vercel-inspired Hero Aesthetic):
 * A towering 3D architectural prism with contour ribs, faceted planes, receding perspective depth rays, and a central focal reticle.
 */
export const MonolithVercelHero: Story = {
  name: 'Monolith Architectural Prism (Vercel Hero)',
  args: {
    variant: 'monolith',
    pointDensity: 'high',
    pointSize: 1.8,
    pointBrightness: 1.0,
    lineOpacity: 0.35,
    wireframe: true,
    glowIntensity: 0.85,
    tone: 'pure',
  },
};

/**
 * Crystalline Tetrahedral Core:
 * An intersecting 3D tetrahedral geometric lattice with stippled facets and outer coordinate rings.
 */
export const FacetedTetrahedron: Story = {
  name: 'Faceted Tetrahedral Core',
  args: {
    variant: 'tetrahedron',
    pointDensity: 'high',
    pointSize: 1.8,
    pointBrightness: 1.1,
    lineOpacity: 0.4,
    wireframe: true,
    glowIntensity: 0.9,
    tone: 'cool',
  },
};

/**
 * Curved Hyperboloid Spatial Field:
 * A precision mathematical ruled-surface lattice with twisted geometric struts and horizontal latitude rings.
 */
export const CurvedHyperboloid: Story = {
  name: 'Curved Hyperboloid Spatial Field',
  args: {
    variant: 'hyperboloid',
    pointDensity: 'high',
    pointSize: 1.7,
    pointBrightness: 1.0,
    lineOpacity: 0.32,
    wireframe: true,
    glowIntensity: 0.8,
    tone: 'silver',
  },
};

/**
 * Architectural Horizon Grid & Pillars:
 * Receding 3D coordinate floor grid with vertical geometric monolith pillars framing the spatial field.
 */
export const ArchitecturalHorizonGrid: Story = {
  name: 'Architectural Horizon Grid & Monoliths',
  args: {
    variant: 'horizon-grid',
    pointDensity: 'high',
    pointSize: 1.9,
    pointBrightness: 1.1,
    lineOpacity: 0.4,
    wireframe: true,
    glowIntensity: 0.8,
    tone: 'pure',
  },
};

/**
 * Ultra-Dense Luminous Point Field:
 * Over 22,000 precision micro-points with intense traveling light waves and subtle breathing.
 */
export const UltraDenseField: Story = {
  name: 'Ultra-Dense Luminous Point Field',
  args: {
    variant: 'monolith',
    pointDensity: 'ultra',
    pointSize: 1.4,
    pointBrightness: 1.25,
    lineOpacity: 0.25,
    wireframe: true,
    glowIntensity: 1.1,
    tone: 'pure',
  },
};

/**
 * Minimalist Stealth Graphite:
 * Whisper-quiet dark aesthetic with dimmed graphite lines and subtle silver micro-points.
 */
export const MinimalistStealth: Story = {
  name: 'Minimalist Stealth Graphite',
  args: {
    variant: 'monolith',
    pointDensity: 'medium',
    pointSize: 1.5,
    pointBrightness: 0.65,
    lineOpacity: 0.2,
    wireframe: true,
    glowIntensity: 0.4,
    tone: 'cool',
  },
};
