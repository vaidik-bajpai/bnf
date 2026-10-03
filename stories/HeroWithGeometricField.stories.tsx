import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import HeroWithGeometricField from '@/components/home/HeroWithGeometricField';
import { MockAuthProvider } from '@/context/AuthContext';

const meta: Meta<typeof HeroWithGeometricField> = {
  title: 'Compositions/HeroWithGeometricField',
  component: HeroWithGeometricField,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hero Section composed with the procedural Vercel-inspired 3D geometric light structure, positioned directly behind the spinning Ashoka Chakra wheel, alongside the App Header (Navbar), typography, and CTA actions.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <div style={{ width: '100%', minHeight: '100vh', background: '#02040A' }}>
          <Story />
        </div>
      </MockAuthProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['monolith', 'tetrahedron', 'hyperboloid', 'horizon-grid'],
      description: 'Geometric architectural structure variant',
    },
    pointDensity: {
      control: 'select',
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Density of the luminous geometric points',
    },
    wireframe: {
      control: 'boolean',
      description: 'Show/hide structural contour wireframe lines',
    },
    showNavbar: {
      control: 'boolean',
      description: 'Show/hide the top application navigation header',
    },
    showChakraWheel: {
      control: 'boolean',
      description: 'Show/hide the central 3D glowing Ashoka Chakra wheel',
    },
    showEmbers: {
      control: 'boolean',
      description: 'Show/hide floating embers and particle layer',
    },
    titleLine1: {
      control: 'text',
      description: 'First line of the hero title',
    },
    titleLine2: {
      control: 'text',
      description: 'Second line of the hero title',
    },
    subtitle: {
      control: 'text',
      description: 'Hero subtitle or mission statement',
    },
  },
  args: {
    variant: 'monolith',
    pointDensity: 'high',
    wireframe: true,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    titleLine1: 'Bharat-Ganrajya',
    titleLine2: 'Nationalists Front',
    subtitle:
      "Uniting for our nation's mission of civilizational renewal, unity, and progress across five millennia of living heritage.",
    geometricOptions: {
      variant: 'monolith',
      pointDensity: 'high',
      pointSize: 1.8,
      pointBrightness: 1.0,
      lineOpacity: 0.35,
      wireframe: true,
      glowIntensity: 0.85,
      speed: 1.0,
      interactive: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroWithGeometricField>;

/**
 * Flagship Composition: Monolith Prism Behind Chakra:
 * Features the majestic Vercel-inspired 3D prism architectural structure radiating behind the Ashoka Chakra wheel with soft bloom, traveling light wave, and smooth 3D parallax.
 */
export const MonolithBehindChakra: Story = {
  name: 'Monolith Architectural Prism Behind Chakra (Flagship)',
  args: {
    variant: 'monolith',
    pointDensity: 'high',
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    geometricOptions: {
      variant: 'monolith',
      pointDensity: 'high',
      pointSize: 1.8,
      pointBrightness: 1.1,
      lineOpacity: 0.35,
      glowIntensity: 0.85,
      tone: 'pure',
      speed: 1.0,
      interactive: true,
    },
  },
};

/**
 * Crystalline Tetrahedral Core Behind Chakra:
 * An intersecting 3D tetrahedral lattice framing the Chakra wheel with precision alignment rings.
 */
export const TetrahedronBehindChakra: Story = {
  name: 'Crystalline Tetrahedral Core Behind Chakra',
  args: {
    variant: 'tetrahedron',
    pointDensity: 'high',
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    geometricOptions: {
      variant: 'tetrahedron',
      pointDensity: 'high',
      pointSize: 1.9,
      pointBrightness: 1.15,
      lineOpacity: 0.4,
      glowIntensity: 0.9,
      tone: 'cool',
    },
  },
};

/**
 * Curved Hyperboloid Lattice Behind Chakra:
 * A precision mathematical hourglass curved structure with rotating coordinates around the Chakra.
 */
export const HyperboloidBehindChakra: Story = {
  name: 'Curved Hyperboloid Lattice Behind Chakra',
  args: {
    variant: 'hyperboloid',
    pointDensity: 'high',
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    geometricOptions: {
      variant: 'hyperboloid',
      pointDensity: 'high',
      pointSize: 1.7,
      pointBrightness: 1.05,
      lineOpacity: 0.35,
      glowIntensity: 0.8,
      tone: 'silver',
    },
  },
};

/**
 * Deep Horizon Grid & Monoliths Behind Chakra:
 * A grounded 3D coordinate floor grid receding to infinity with flanking architectural monoliths.
 */
export const HorizonGridBehindChakra: Story = {
  name: 'Architectural Horizon Grid & Monoliths Behind Chakra',
  args: {
    variant: 'horizon-grid',
    pointDensity: 'high',
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    geometricOptions: {
      variant: 'horizon-grid',
      pointDensity: 'high',
      pointSize: 1.9,
      pointBrightness: 1.1,
      lineOpacity: 0.4,
      glowIntensity: 0.85,
      tone: 'pure',
    },
  },
};

/**
 * Chakra In Isolated Geometric Void:
 * Navbar and text hidden, focusing purely on the visual interaction between the glowing Ashoka Chakra wheel and the 3D geometric structure.
 */
export const IsolatedChakraInVoid: Story = {
  name: 'Isolated Chakra in Geometric Void',
  args: {
    variant: 'monolith',
    pointDensity: 'ultra',
    showNavbar: false,
    showChakraWheel: true,
    showEmbers: false,
    titleLine1: '',
    titleLine2: '',
    subtitle: '',
    geometricOptions: {
      variant: 'monolith',
      pointDensity: 'ultra',
      pointSize: 1.6,
      pointBrightness: 1.25,
      lineOpacity: 0.4,
      glowIntensity: 1.1,
      tone: 'pure',
      speed: 1.0,
      interactive: true,
    },
  },
};
