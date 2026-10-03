import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import HeroWithWarpField from '@/components/home/HeroWithWarpField';
import { MockAuthProvider } from '@/context/AuthContext';

const meta: Meta<typeof HeroWithWarpField> = {
  title: 'Compositions/HeroWithWarpField',
  component: HeroWithWarpField,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hero Section composed with the live Three.js r128 Warp Field background, Ashoka Chakra wheel, and App Header (Navbar).',
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
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    titleLine1: 'Bharat-Ganrajya',
    titleLine2: 'Nationalists Front',
    subtitle:
      "Uniting for our nation's mission of civilizational renewal, unity, and progress across five millennia of living heritage.",
    warpOptions: {
      variant: 'streaks',
      speed: 15,
      streakOpacity: 0.6,
      tileOpacity: 0.9,
      fov: 75,
      brightness: 1,
      hue: 0,
      saturation: 1,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroWithWarpField>;

/**
 * The full Hero section: Original 400 emerald streaks + 40 tiles warp field, App Header, spinning Chakra wheel, and typography.
 */
export const FullHeroWithNavbar: Story = {
  args: {
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    warpOptions: {
      variant: 'streaks',
      speed: 15,
      streakOpacity: 0.65,
      tileOpacity: 0.85,
    },
  },
};

/**
 * Saffron Amber Theme: Hue-shifted Warp Field to align with the Bharat-Ganrajya golden amber branding.
 */
export const SaffronAmberHero: Story = {
  args: {
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    warpOptions: {
      variant: 'streaks',
      speed: 16,
      streakOpacity: 0.75,
      tileOpacity: 0.9,
      hue: -125, // transforms emerald green to warm golden saffron
      saturation: 1.4,
      brightness: 1.15,
    },
  },
};

/**
 * Hyperspace Warp Hero: High velocity star tunnel with pulsing blue celestial core.
 */
export const HyperspaceHero: Story = {
  args: {
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    warpOptions: {
      variant: 'hyperspace',
      speed: 22,
      streakOpacity: 0.8,
      tileOpacity: 0.95,
      fov: 80,
    },
  },
};

/**
 * Keycaps Cyber Variant: Floating 3D mechanical keycaps streaming through deep space.
 */
export const KeycapsCyberHero: Story = {
  args: {
    showNavbar: true,
    showChakraWheel: false,
    showEmbers: true,
    warpOptions: {
      variant: 'keycaps',
      speed: 14,
      streakOpacity: 0.75,
      tileOpacity: 0.9,
      fov: 75,
    },
  },
};

/**
 * Letters Typography Hero: 260 alphanumeric characters streaming in orbital sway.
 */
export const LettersTypographyHero: Story = {
  args: {
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    warpOptions: {
      variant: 'letters',
      speed: 16,
      streakOpacity: 0.7,
      tileOpacity: 0.9,
    },
  },
};

/**
 * App Header Only over Warp Field: Highlights how the navbar interacts with the animation.
 */
export const AppHeaderOnlyWithWarp: Story = {
  render: (args) => (
    <div className="relative w-full h-[360px] overflow-hidden bg-[#02040A] flex flex-col justify-between">
      <HeroWithWarpField
        {...args}
        showNavbar={true}
        showChakraWheel={false}
        showEmbers={false}
        titleLine1=""
        titleLine2=""
        subtitle=""
      />
    </div>
  ),
  args: {
    warpOptions: {
      variant: 'streaks',
      speed: 14,
      streakOpacity: 0.6,
      tileOpacity: 0.8,
    },
  },
};

/**
 * Authenticated Header View: Header showing logged-in user state over the Warp Hero.
 */
export const AuthenticatedUserHero: Story = {
  decorators: [
    (Story) => (
      <MockAuthProvider
        user={{
          id: 'usr_123',
          name: 'Vikramaditya',
          email: 'vikram@bharat.in',
          username: 'vikram',
          initials: 'V',
          bg: '#E5A93C',
        }}
      >
        <div style={{ width: '100%', minHeight: '100vh', background: '#02040A' }}>
          <Story />
        </div>
      </MockAuthProvider>
    ),
  ],
  args: {
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    warpOptions: {
      variant: 'streaks',
      speed: 15,
      streakOpacity: 0.7,
      tileOpacity: 0.9,
    },
  },
};
