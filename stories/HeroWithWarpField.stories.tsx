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
    warpVariant: {
      control: 'select',
      options: ['tricolor', 'streaks', 'hyperspace', 'keycaps', 'letters'],
      description: 'Quick selector for the Warp Field variant',
    },
    streakThickness: {
      control: { type: 'range', min: 0.5, max: 12, step: 0.5 },
      description: 'Thickness of the warp field streaks in pixels',
      table: {
        defaultValue: { summary: '2' },
      },
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
      streakThickness: 2,
      fov: 75,
      brightness: 1,
      hue: 0,
      saturation: 1,
    },
    streakThickness: 2,
  },
};

export default meta;
type Story = StoryObj<typeof HeroWithWarpField>;

/**
 * Warp With Hero Composition (Tricolour):
 * Features random additive streaks of authentic Indian Tricolour — saffron (#FF9933), pure luminous white (#FFFFFF), and vivid green (#138808) — streaming through deep space alongside luminous tricolour tiles, with the App Header (Navbar), spinning Ashoka Chakra wheel, and Bharat-Ganrajya hero content.
 */
export const WarpWithHeroComposition: Story = {
  name: 'Warp With Hero Composition (Tricolour)',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 3.0,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    titleLine1: 'Bharat-Ganrajya',
    titleLine2: 'Nationalists Front',
    subtitle:
      "Uniting for our nation's mission of civilizational renewal, unity, and progress across five millennia of living heritage.",
    warpOptions: {
      variant: 'tricolor',
      speed: 16,
      streakOpacity: 0.85,
      tileOpacity: 0.95,
      streakThickness: 3.0,
      fov: 75,
      brightness: 1,
      hue: 0,
      saturation: 1,
    },
  },
};

/**
 * Tricolour Warp at Hyperspeed:
 * Rushing 450 streaks of saffron, white, and green at high velocity (speed 30, FOV 85) behind the hero elements.
 */
export const TricolorHyperspeedHero: Story = {
  name: 'Tricolour Warp (Hyperspeed Hero)',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 4.0,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    titleLine1: 'Bharat-Ganrajya',
    titleLine2: 'Nationalists Front',
    subtitle:
      "Uniting for our nation's mission of civilizational renewal, unity, and progress across five millennia of living heritage.",
    warpOptions: {
      variant: 'tricolor',
      speed: 30,
      streakOpacity: 0.95,
      tileOpacity: 1.0,
      streakThickness: 4.0,
      fov: 85,
      brightness: 1.1,
    },
  },
};

/**
 * Bold Tricolour Beams Hero:
 * Luminous 6px thick rays of saffron, white, and green creating high-impact radiant light shafts behind the Chakra wheel and App Header.
 */
export const BoldTricolorBeamsHero: Story = {
  name: 'Bold Tricolour Beams (Heavy Linewidth)',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 6.0,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    titleLine1: 'Bharat-Ganrajya',
    titleLine2: 'Nationalists Front',
    subtitle:
      "Uniting for our nation's mission of civilizational renewal, unity, and progress across five millennia of living heritage.",
    warpOptions: {
      variant: 'tricolor',
      speed: 20,
      streakOpacity: 0.95,
      tileOpacity: 0.95,
      streakThickness: 6.0,
      fov: 80,
    },
  },
};

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
