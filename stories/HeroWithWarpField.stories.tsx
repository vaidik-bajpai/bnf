import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { ArrowRight, User as UserIcon } from 'lucide-react';
import HeroWithWarpField from '@/components/home/HeroWithWarpField';
import { MockAuthProvider } from '@/context/AuthContext';
import {
  LiquidMetalButton,
  RectangleButtons,
  ShaderButtons,
} from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

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
    joinButtonStyle: {
      control: 'select',
      options: [
        'amber-heritage',
        'liquid-metal',
        'bloom-outline',
        'ignition',
        'book-a-demo',
        'tricolor-beam',
        'cyber-glass',
        'monochrome-minimal',
      ],
      description: 'Style of the primary JOIN THE FRONT button inside the warp composition',
      table: {
        defaultValue: { summary: 'ignition' },
      },
    },
    joinButtonLabel: {
      control: 'text',
      description: 'Label for the primary Join button',
      table: {
        defaultValue: { summary: 'JOIN THE FRONT' },
      },
    },
    joinButtonSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'showcase'],
      description: 'Dimensions and scale preset for the primary Join button',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    signInButtonStyle: {
      control: 'select',
      options: [
        'default',
        'liquid-metal',
        'bloom-outline',
        'amber-glow',
        'glass-cyan',
        'minimal-ghost',
      ],
      description: 'Style of the Sign In button in the Navbar',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    signInButtonLabel: {
      control: 'text',
      description: 'Label for the Sign In button in the Navbar',
      table: {
        defaultValue: { summary: 'Sign In' },
      },
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
    joinButtonStyle: 'ignition',
    joinButtonLabel: 'JOIN THE FRONT',
    joinButtonSize: 'md',
    signInButtonStyle: 'default',
    signInButtonLabel: 'Sign In',
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
      speed: 2,
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
      speed: 2,
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
      speed: 2,
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

/**
 * 🌟 Interactive Button Customization Master Composition:
 * Allows dynamic switching of both the primary "JOIN THE FRONT" button and the Navbar "Sign In" button directly from the Storybook controls panel!
 */
export const CustomizableButtonsComposition: Story = {
  name: 'Interactive Customizable Buttons (Master Composition)',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 3.5,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    joinButtonStyle: 'ignition',
    joinButtonLabel: 'JOIN THE FRONT',
    signInButtonStyle: 'default',
    signInButtonLabel: 'Sign In',
    warpOptions: {
      variant: 'tricolor',
      speed: 2,
      streakOpacity: 0.9,
      tileOpacity: 0.95,
      streakThickness: 3.5,
    },
  },
};

/**
 * 💧 Liquid Metal Buttons in Warp Composition:
 * Features ThreeUI's authentic WebGL 2 `<LiquidMetalButton />` for both the primary "JOIN THE FRONT" CTA and the Navbar "Sign In" pill.
 * Features live specular refraction, pointer well bloom, and faceted press ripple over the rushing Tricolour warp field.
 */
export const LiquidMetalButtonsWarp: Story = {
  name: 'Liquid Metal Buttons · WebGL 2 Warp Composition',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 3.5,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    joinButtonStyle: 'liquid-metal',
    joinButtonLabel: 'JOIN THE FRONT',
    signInButtonStyle: 'liquid-metal',
    signInButtonLabel: 'Sign In',
    warpOptions: {
      variant: 'tricolor',
      speed: 20,
      streakOpacity: 0.9,
      tileOpacity: 0.95,
      streakThickness: 3.5,
    },
  },
};

/**
 * 🌸 Bloom Outline Buttons in Warp Composition:
 * Features ThreeUI's `<RectangleButtons variant="bloom-outline-button" />` with magnetic pointer drift, paired blossom dots, ink bloom, and sliding duplicate typography.
 */
export const BloomOutlineButtonsWarp: Story = {
  name: 'Bloom Outline Buttons · Magnetic Drift Warp Composition',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 3.0,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    joinButtonStyle: 'bloom-outline',
    joinButtonLabel: 'JOIN THE FRONT',
    signInButtonStyle: 'bloom-outline',
    signInButtonLabel: 'Sign In',
    warpOptions: {
      variant: 'tricolor',
      speed: 2,
      streakOpacity: 0.85,
      tileOpacity: 0.9,
      streakThickness: 3.0,
    },
  },
};

/**
 * ⚡ Tactile WebGL Ignition Button in Warp Composition:
 * Features ThreeUI's `<ShaderButtons variant="ignition-button" />` raw-WebGL energy field with tactile ignition trigger and golden amber navbar button.
 */
export const TactileIgnitionWarp: Story = {
  name: 'Tactile Ignition Button · WebGL Energy Warp Composition',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 3.0,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    joinButtonStyle: 'ignition',
    joinButtonLabel: 'JOIN THE FRONT',
    signInButtonStyle: 'amber-glow',
    signInButtonLabel: 'Sign In',
    warpOptions: {
      variant: 'streaks',
      speed: 2,
      streakOpacity: 0.8,
      tileOpacity: 0.9,
      streakThickness: 3.0,
      hue: -125, // Golden amber hue shift
      saturation: 1.4,
    },
  },
};

/**
 * 🟩 Dot Matrix Book A Demo Button in Warp Composition:
 * Features ThreeUI's `<ShaderButtons variant="book-a-demo" />` with moving lime dot-matrix arrow over deep hyperspace warp.
 */
export const DotMatrixBookDemoWarp: Story = {
  name: 'Dot Matrix Arrow Button · Warp Composition',
  args: {
    warpVariant: 'hyperspace',
    streakThickness: 2.5,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    joinButtonStyle: 'book-a-demo',
    joinButtonLabel: 'JOIN THE FRONT',
    signInButtonStyle: 'amber-glow',
    signInButtonLabel: 'Sign In',
    warpOptions: {
      variant: 'hyperspace',
      speed: 22,
      streakOpacity: 0.85,
      tileOpacity: 0.95,
      fov: 80,
    },
  },
};

/**
 * 🇮🇳 Tricolour Laser Beam Button in Warp Composition:
 * Radiant animated laser border of saffron, white, and green with glowing shadow alongside bold tricolour warp beams.
 */
export const TricolorLaserBeamWarp: Story = {
  name: 'Tricolour Laser Beam Button · Heavy Linewidth Warp',
  args: {
    warpVariant: 'tricolor',
    streakThickness: 6.0,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    joinButtonStyle: 'tricolor-beam',
    joinButtonLabel: 'JOIN THE FRONT',
    signInButtonStyle: 'amber-glow',
    signInButtonLabel: 'Sign In',
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
 * 💎 Cyber Glass Button in Warp Composition:
 * Translucent frosted cyber glass button with cyan/amber edge glow and cyan navbar pill over blue hyperspace warp.
 */
export const CyberGlassWarp: Story = {
  name: 'Cyber Glass Button · Cyan Hyperspace Warp',
  args: {
    warpVariant: 'hyperspace',
    streakThickness: 2.5,
    showNavbar: true,
    showChakraWheel: true,
    showEmbers: true,
    joinButtonStyle: 'cyber-glass',
    joinButtonLabel: 'JOIN THE FRONT',
    signInButtonStyle: 'glass-cyan',
    signInButtonLabel: 'Sign In',
    warpOptions: {
      variant: 'hyperspace',
      speed: 24,
      streakOpacity: 0.9,
      tileOpacity: 0.95,
      fov: 85,
    },
  },
};

/**
 * 🏛️ Button Styles Side-by-Side Comparison:
 * Renders all primary button styles in context so designers can compare their visual weight, interactions, and aesthetic alignment.
 */
export const ButtonStylesComparison: Story = {
  name: 'Button Styles Gallery & Comparison',
  render: () => (
    <div className="relative min-h-screen w-full bg-[#02040A] text-white flex flex-col items-center justify-center p-8 sm:p-12 gap-12">
      <div className="text-center z-10 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-[#FFB020]" style={{ fontFamily: "'Fraunces', serif" }}>
          Interactive Button Styles for Warp Hero
        </h2>
        <p className="text-sm text-white/70 mt-2 leading-relaxed">
          The Warp Hero composition supports hot-swappable button styles for both the primary <span className="text-[#FFB020] font-semibold">JOIN THE FRONT</span> action and the Navbar <span className="text-white font-semibold">Sign In</span> control.
        </p>
      </div>

      {/* Row 1: Primary Hero "JOIN THE FRONT" Styles (No Cards) */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-6">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#FFB020] font-bold text-center">
          Primary Hero Action Buttons ("JOIN THE FRONT")
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 w-full">
          {/* 1. Heritage Amber */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="px-7 py-3 rounded-md font-bold text-xs sm:text-sm tracking-wider uppercase transition-transform hover:scale-[1.03] shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: '#E5A93C', color: '#0A1224' }}
            >
              <span>JOIN THE FRONT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/60 tracking-wider font-medium">Heritage Amber (Default)</span>
          </div>

          {/* 2. Liquid Metal */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-[200px] h-[58px] relative flex items-center justify-center">
              <LiquidMetalButton variant="pill" text="JOIN THE FRONT" embedded />
            </div>
            <span className="text-xs text-sky-400 tracking-wider font-medium">Liquid Metal (WebGL 2)</span>
          </div>

          {/* 3. Bloom Outline */}
          <div className="flex flex-col items-center gap-3">
            <RectangleButtons
              variant="bloom-outline-button"
              label="JOIN THE FRONT"
              mode="dark"
              style={{ minHeight: 'auto', height: 'auto' }}
              className="!min-h-0 !h-auto"
            />
            <span className="text-xs text-pink-300 tracking-wider font-medium">Bloom Outline</span>
          </div>

          {/* 4. Tricolour Laser Beam */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="relative group p-[2px] rounded-lg overflow-hidden shadow-[0_0_25px_rgba(255,153,51,0.45)] hover:scale-[1.03] transition-transform cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-90 animate-pulse" />
              <span className="relative px-7 py-3 rounded-[6px] bg-[#02040A] text-white font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 border border-white/10">
                <span>JOIN THE FRONT</span>
                <ArrowRight className="w-4 h-4 text-[#FF9933]" />
              </span>
            </button>
            <span className="text-xs text-emerald-400 tracking-wider font-medium">Tricolour Laser Beam</span>
          </div>

          {/* 5. Tactile Ignition */}
          <div className="flex flex-col items-center gap-3">
            <ShaderButtons variant="ignition-button" mode="dark" />
            <span className="text-xs text-amber-400 tracking-wider font-medium">WebGL Ignition</span>
          </div>

          {/* 6. Cyber Glass */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="px-7 py-3 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase text-cyan-200 border border-cyan-400/50 bg-gradient-to-r from-cyan-950/70 via-slate-900/80 to-cyan-950/70 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.03] transition-transform flex items-center gap-2 cursor-pointer"
            >
              <span>JOIN THE FRONT</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <span className="text-xs text-cyan-300 tracking-wider font-medium">Cyber Glass</span>
          </div>
        </div>
      </div>

      {/* Row 2: Navbar "Sign In" Button Styles (No Cards) */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-6 mt-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#FFB020] font-bold text-center">
          Navbar Header Action Buttons ("Sign In")
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 w-full">
          {/* A. Default */}
          <div className="flex flex-col items-center gap-2.5">
            <button className="text-white/85 text-xs font-semibold border border-white/20 px-3.5 py-1.5 rounded-xs flex items-center gap-1.5 hover:border-white/40 transition-colors">
              <UserIcon className="w-3.5 h-3.5" /> Sign In
            </button>
            <span className="text-[11px] text-white/50">Default</span>
          </div>

          {/* B. Liquid Metal */}
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-[124px] h-[36px] relative flex items-center justify-center overflow-hidden rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <div className="w-[200px] h-[70px] absolute flex items-center justify-center scale-[0.52] origin-center">
                <LiquidMetalButton variant="pill" text="Sign In" embedded />
              </div>
            </div>
            <span className="text-[11px] text-sky-400">Liquid Metal</span>
          </div>

          {/* C. Bloom Outline */}
          <div className="flex flex-col items-center gap-2.5">
            <div className="scale-75 origin-center">
              <RectangleButtons
                variant="bloom-outline-button"
                label="Sign In"
                mode="dark"
                style={{ minHeight: 'auto', height: 'auto' }}
                className="!min-h-0 !h-auto"
              />
            </div>
            <span className="text-[11px] text-pink-300">Bloom Outline</span>
          </div>

          {/* D. Amber Glow */}
          <div className="flex flex-col items-center gap-2.5">
            <button className="text-[#E5A93C] hover:text-[#0A1224] hover:bg-[#E5A93C] text-xs font-bold border border-[#E5A93C]/70 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,169,60,0.3)] transition-all">
              <UserIcon className="w-3.5 h-3.5" /> Sign In
            </button>
            <span className="text-[11px] text-[#E5A93C]">Amber Glow</span>
          </div>

          {/* E. Glass Cyan */}
          <div className="flex flex-col items-center gap-2.5">
            <button className="text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 text-xs font-semibold border border-cyan-500/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" /> Sign In
            </button>
            <span className="text-[11px] text-cyan-300">Glass Cyan</span>
          </div>

          {/* F. Minimal Ghost */}
          <div className="flex flex-col items-center gap-2.5">
            <button className="text-white/70 hover:text-white text-xs font-medium flex items-center gap-1.5 underline-offset-4 hover:underline transition-colors">
              <UserIcon className="w-3.5 h-3.5 text-white/50" /> Sign In
            </button>
            <span className="text-[11px] text-white/50">Minimal Ghost</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
