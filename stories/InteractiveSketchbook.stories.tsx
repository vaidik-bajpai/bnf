import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { InteractiveSketchbook } from '@/components/sketchbook/InteractiveSketchbook';
import {
  DEFAULT_BOTANICAL_PAGES,
  CHAKRA_HERITAGE_PAGES,
  CHAKRA_DARK_PAGES,
} from '@/components/sketchbook/platesData';

const meta: Meta<typeof InteractiveSketchbook> = {
  title: 'Components/Sketchbook/InteractiveSketchbook',
  component: InteractiveSketchbook,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'High-end procedural interactive 3D sketchbook extracted from ThreeUI Meng To Sketchbook. Features authentic 18-strip cylindrical paper-curl physics, dynamic strip lighting and specular highlights, a draggable optical magnifying loupe with real mirror magnification, pointer perspective tilt, spring-physics page turns, and an editorial catalog index. Supports hot-swappable themes including our website Vedic Chakra Heritage and Dark themes, as well as the original Botanical watercolor theme.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['chakra-heritage', 'chakra-dark', 'default', 'botanical'],
      description: 'Visual color and atmospheric theme preset',
      table: {
        defaultValue: { summary: 'chakra-heritage' },
      },
    },
    initialPage: {
      control: { type: 'number', min: 0, max: 8 },
      description: 'Initial spread index (0 to 8)',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    enableLoupe: {
      control: 'boolean',
      description: 'Enable the draggable optical magnifying glass',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    enableTilt: {
      control: 'boolean',
      description: 'Enable subtle 3D perspective tilt towards mouse pointer',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    enableZoom: {
      control: 'boolean',
      description: 'Enable floating zoom in/out toolbar controls',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    enableRiffleIntro: {
      control: 'boolean',
      description: 'Play kinetic page-flip riffle animation on load',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showIndex: {
      control: 'boolean',
      description: 'Show editorial catalog table of plates underneath',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showNavigationArrows: {
      control: 'boolean',
      description: 'Show left/right chevron navigation arrows',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showToolBar: {
      control: 'boolean',
      description: 'Show floating view toolbar controls',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    kicker: {
      control: 'text',
      description: 'Top kicker badge text',
    },
    maxWidth: {
      control: 'text',
      description: 'Max width of the sketchbook container',
      table: {
        defaultValue: { summary: '960px' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InteractiveSketchbook>;

/**
 * Flagship Website Theme: Sacred Vedic & Indian Heritage.
 * Rendered on warm sacred parchment (#FDF8F0) with deep umber ink (#1A0800),
 * sacred saffron accents (#E8550A), royal navy (#0D1B3E), and radiant gold foil loupe (#D4A017).
 * Features 9 high-resolution architectural monographs: Sarnath Ashoka Chakra, Brihadisvara Vimana,
 * Konark Sun Chariot, Padmanabhaswamy, Hampi Stone Chariot, Kailasa Monolith, Varanasi Ghats,
 * Meenakshi Gopuram, and Sri Yantra Maha Meru.
 */
export const ChakraHeritageTheme: Story = {
  args: {
    theme: 'chakra-heritage',
    pages: CHAKRA_HERITAGE_PAGES,
    initialPage: 0,
    enableLoupe: true,
    enableTilt: true,
    enableZoom: true,
    enableRiffleIntro: false,
    showIndex: true,
    showNavigationArrows: true,
    showToolBar: true,
    kicker: 'Vedic Heritage Monographs · Architectural Epigraphy & Sacred Geometry',
    maxWidth: 960,
  },
};

/**
 * Website Dark Theme: Cosmic Chakra & Celestial Navy.
 * Rendered against deep nocturnal navy (#080d1a) with radiant amber (#F59E0B)
 * and illuminated gold leaf foil accents (#FBBF24).
 */
export const ChakraDarkTheme: Story = {
  args: {
    theme: 'chakra-dark',
    pages: CHAKRA_DARK_PAGES,
    initialPage: 0,
    enableLoupe: true,
    enableTilt: true,
    enableZoom: true,
    enableRiffleIntro: false,
    showIndex: true,
    showNavigationArrows: true,
    showToolBar: true,
    kicker: 'Cosmic Chakra Archives · Celestial Illumination Edition',
    maxWidth: 960,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Original Default Botanical Sketchbook: Singapore Architectural & Botanical Plates.
 * Rendered on authentic cream watercolor paper (#ece7dc) with sepia ink (#2b2721)
 * and earth tones (#9a6a3e), featuring the original 9 Singapore illustrated spreads.
 */
export const DefaultBotanicalSketchbook: Story = {
  args: {
    theme: 'default',
    pages: DEFAULT_BOTANICAL_PAGES,
    initialPage: 0,
    enableLoupe: true,
    enableTilt: true,
    enableZoom: true,
    enableRiffleIntro: false,
    showIndex: true,
    showNavigationArrows: true,
    showToolBar: true,
    kicker: 'Designer / Creator / AI Educator / Founder @ Singapore',
    maxWidth: 960,
  },
};

/**
 * Optical Magnifier Focus:
 * Loupe positioned over intricate plate details with 2.3x magnification,
 * showcasing the annular gold bezel, realistic shadow pool, and mirror lens layer.
 */
export const OpticalMagnifierFocus: Story = {
  args: {
    theme: 'chakra-heritage',
    pages: CHAKRA_HERITAGE_PAGES,
    initialPage: 2, // Konark Sun Temple astronomical wheel
    enableLoupe: true,
    enableTilt: true,
    enableZoom: true,
    enableRiffleIntro: false,
    showIndex: true,
    showNavigationArrows: true,
    showToolBar: true,
    kicker: 'Detail Inspection · 2.3x Optical Magnifying Lens',
    maxWidth: 960,
  },
};

/**
 * Kinetic Riffle Page-Flip:
 * Automatically plays the introductory sinusoidal page-riffle sequence on mount.
 */
export const WithRiffleIntro: Story = {
  args: {
    theme: 'chakra-heritage',
    pages: CHAKRA_HERITAGE_PAGES,
    initialPage: 0,
    enableLoupe: true,
    enableTilt: true,
    enableZoom: true,
    enableRiffleIntro: true,
    showIndex: true,
    showNavigationArrows: true,
    showToolBar: true,
    kicker: 'Interactive Fluid Physics · Smooth Kinetic Riffle',
    maxWidth: 960,
  },
};

/**
 * Compact Viewer (Without Index):
 * Minimal embedded book spread suitable for hero banners or modal dialogs.
 */
export const CompactHeroViewer: Story = {
  args: {
    theme: 'chakra-heritage',
    pages: CHAKRA_HERITAGE_PAGES,
    initialPage: 0,
    enableLoupe: true,
    enableTilt: true,
    enableZoom: true,
    enableRiffleIntro: false,
    showIndex: false,
    showNavigationArrows: true,
    showToolBar: true,
    kicker: 'Autonomous Hero Component',
    maxWidth: 820,
  },
};
