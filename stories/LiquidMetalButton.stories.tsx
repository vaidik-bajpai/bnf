import type { Meta, StoryObj } from "@storybook/react";

import { LiquidMetalButton } from "@designcodeio/threeui";

import "@designcodeio/threeui/style.css";

const meta: Meta<typeof LiquidMetalButton> = {
  title: "ThreeUI/LiquidMetalButton",
  component: LiquidMetalButton,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    variant: {
      control: "select",
      options: ["pill", "circle", "play"],
      description: "Button shape variant",
    },

    rendering: {
      control: "radio",
      options: ["colored", "monotone"],
      description: "Shader spectral finish: full chromatic or monotone",
    },

    text: {
      control: "text",
      description: "Button label text",
    },

    diameter: {
      control: {
        type: "range",
        min: 72,
        max: 160,
        step: 2,
      },
      description: "Play button diameter in pixels",
    },

    strokeWidth: {
      control: {
        type: "range",
        min: 1,
        max: 8,
        step: 0.5,
      },
      description: "Play icon stroke width",
    },
  },
};

export default meta;

type Story = StoryObj<typeof LiquidMetalButton>;

export const SignUpPill: Story = {
  args: {
    variant: "pill",
  },
};

export const CircleAdd: Story = {
  args: {
    variant: "circle",
    text: "Add",
  },
};

export const PlayButton: Story = {
  args: {
    variant: "play",
    diameter: 88,
    strokeWidth: 3,
  },
};

export const CustomText: Story = {
  args: {
    variant: "pill",
    text: "Get Started",
  },
};

/**
 * Compact Standalone Pill:
 * Demonstrates embedding LiquidMetalButton directly into compact UI controls
 * (such as a navbar or card action) with a clipped 48px pill boundary.
 */
export const CompactStandalonePill: Story = {
  args: {
    variant: "pill",
    text: "Sign In",
    embedded: true,
  },
  render: (args) => (
    <div style={{ width: 160, height: 48, position: "relative", overflow: "hidden", borderRadius: 999 }}>
      <LiquidMetalButton {...args} />
    </div>
  ),
};

/**
 * All Variants Showcase:
 * Pill, circle, and play buttons floating side-by-side with zero card wrappers.
 */
export const AllVariantsShowcase: Story = {
  name: "All Variants Showcase",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        width: "100%",
      }}
    >
      <div style={{ textAlign: "center", color: "#a1a1aa", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Liquid Metal Button Family · WebGL 2 Spectrum & Faceted Ripple
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "48px", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <LiquidMetalButton variant="pill" text="Sign up" />
          <span style={{ fontSize: "12px", color: "#71717a" }}>Pill (Sign up)</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <LiquidMetalButton variant="circle" />
          <span style={{ fontSize: "12px", color: "#71717a" }}>Circle (Add)</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <LiquidMetalButton variant="play" diameter={88} strokeWidth={3} />
          <span style={{ fontSize: "12px", color: "#71717a" }}>Play (Diameter 88)</span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Standalone Across Themes:
 * Demonstrating the button is 100% standalone and isolated from the background,
 * with no enclosing card or black box, rendering cleanly on light, dark, and brand gradient surfaces.
 */
export const StandaloneAcrossThemes: Story = {
  name: "Standalone Across Themes",
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        padding: "48px 32px",
        minHeight: "100vh",
        background: "#0e1117",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h2 style={{ color: "#f8fafc", fontSize: "18px", fontWeight: 700, margin: 0 }}>
          Standalone Liquid Metal Buttons
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
          Clean, self-contained controls with zero black card boxes — completely separate from any background.
        </p>
      </div>

      {/* Row 1: Light Theme Canvas */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <p style={{ color: "#0f172a", fontWeight: 600, fontSize: "14px", margin: 0 }}>Light Canvas</p>
          <p style={{ color: "#64748b", fontSize: "12px", margin: "2px 0 0 0" }}>Pure white surface</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LiquidMetalButton variant="pill" text="Sign up" />
          <LiquidMetalButton variant="circle" />
          <LiquidMetalButton variant="play" diameter={52} />
        </div>
      </div>

      {/* Row 2: Dark Slate Canvas */}
      <div
        style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ color: "#f8fafc", fontWeight: 600, fontSize: "14px", margin: 0 }}>Dark Slate Canvas</p>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: "2px 0 0 0" }}>Tailwind Slate-800</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LiquidMetalButton variant="pill" text="Sign up" />
          <LiquidMetalButton variant="circle" />
          <LiquidMetalButton variant="play" diameter={52} />
        </div>
      </div>

      {/* Row 3: Brand Amber / Navy Surface */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A1224 0%, #152544 100%)",
          borderRadius: "16px",
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid rgba(229,169,60,0.2)",
        }}
      >
        <div>
          <p style={{ color: "#E5A93C", fontWeight: 600, fontSize: "14px", margin: 0 }}>Heritage Navy</p>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: "2px 0 0 0" }}>Brand gradient</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LiquidMetalButton variant="pill" text="Join The Front" />
          <LiquidMetalButton variant="circle" />
          <LiquidMetalButton variant="play" diameter={52} />
        </div>
      </div>
    </div>
  ),
};

