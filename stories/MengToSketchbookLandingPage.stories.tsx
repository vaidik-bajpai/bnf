import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { MengToSketchbookLandingPage } from '@/src/shaders/landing-pages/LandingPages';

const meta: Meta<typeof MengToSketchbookLandingPage> = {
  title: 'Components/Sketchbook/MengToSketchbookLandingPage',
  component: MengToSketchbookLandingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Exact registered ThreeUI Meng To Sketchbook Landing Page (Source revision SHA-256 e0330548b1ac). A tactile personal portfolio built as a Singapore sketchbook, with nine illustrated plates, curled page turns, a draggable magnifying glass, zoom controls, a botanical paper atmosphere, and an editorial index.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    headingFont: {
      control: 'text',
      description: 'Font family for headings',
      table: {
        defaultValue: { summary: 'instrument-serif' },
      },
    },
    bodyFont: {
      control: 'text',
      description: 'Font family for body text',
      table: {
        defaultValue: { summary: 'newsreader' },
      },
    },
    primaryColor: {
      control: 'color',
      description: 'Primary text / ink color',
      table: {
        defaultValue: { summary: '#2b2721' },
      },
    },
    headingSize: {
      control: { type: 'range', min: 20, max: 48, step: 1 },
      description: 'Heading font size (px)',
      table: {
        defaultValue: { summary: '30' },
      },
    },
    bodySize: {
      control: { type: 'range', min: 14, max: 28, step: 1 },
      description: 'Body font size (px)',
      table: {
        defaultValue: { summary: '20' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MengToSketchbookLandingPage>;

/**
 * Exact ThreeUI Authoring Configuration:
 * Full landing page with botanical background wash, navigation, botanical fronds,
 * interactive 3D sketchbook, loupe, bio section, and editorial plates.
 */
export const DefaultThreeUIPage: Story = {
  args: {
    headingFont: 'instrument-serif',
    bodyFont: 'newsreader',
    headingWeight: '400',
    bodyWeight: '400',
    primaryColor: '#2b2721',
    headingSize: 30,
    bodySize: 20,
    headingLetterSpacing: 0.01,
    style: {
      width: '100%',
      minHeight: '100vh',
    },
  },
};

/**
 * Chakra Theme Color Customization:
 * The landing page typography customized with Vedic Deep Umber (#1A0800).
 */
export const ChakraColorCustomized: Story = {
  args: {
    headingFont: 'instrument-serif',
    bodyFont: 'newsreader',
    headingWeight: '400',
    bodyWeight: '400',
    primaryColor: '#1A0800',
    headingSize: 32,
    bodySize: 20,
    headingLetterSpacing: 0.015,
    style: {
      width: '100%',
      minHeight: '100vh',
    },
  },
};
