import type { Meta, StoryObj } from "@storybook/react";
import { LiquidMetalButton } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

const meta: Meta<typeof LiquidMetalButton> = {
  title: "ThreeUI/LiquidMetalButton",
  component: LiquidMetalButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0e0f12" },
        { name: "deep-black", value: "#050507" },
      ],
    },
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
      control: { type: "range", min: 72, max: 160, step: 2 },
      description: "Play button diameter in pixels",
    },
    strokeWidth: {
      control: { type: "range", min: 1, max: 8, step: 0.5 },
      description: "Play icon stroke width",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LiquidMetalButton>;

/**
 * The canonical authored Sign up pill with complete WebGL 2 spectral field,
 * bloom, pointer well, and faceted press ripple.
 */
export const SignUpPill: Story = {
  args: {
    variant: "pill",
  },
  render: (args) => (
    <div style={{ width: 400, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LiquidMetalButton {...args} />
    </div>
  ),
};

/**
 * Circular variant with embedded '+' action icon.
 */
export const CircleAdd: Story = {
  args: {
    variant: "circle",
    text: "Add",
  },
  render: (args) => (
    <div style={{ width: 300, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LiquidMetalButton {...args} />
    </div>
  ),
};

/**
 * Circular liquid-metal Play button variant.
 */
export const PlayButton: Story = {
  args: {
    variant: "play",
    diameter: 88,
    strokeWidth: 3,
  },
  render: (args) => (
    <div style={{ width: 300, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LiquidMetalButton {...args} />
    </div>
  ),
};

/**
 * Custom text label on the liquid-metal pill.
 */
export const CustomText: Story = {
  args: {
    variant: "pill",
    text: "Get Started",
  },
  render: (args) => (
    <div style={{ width: 440, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LiquidMetalButton {...args} />
    </div>
  ),
};

/**
 * Showcase of all authored liquid-metal button variants together.
 */
export const AllVariantsShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        background: "#0a0a0c",
        borderRadius: "16px",
      }}
    >
      <div style={{ textAlign: "center", color: "#a1a1aa", fontSize: "14px", letterSpacing: "0.05em" }}>
        LIQUID METAL BUTTON FAMILY · WEBGL 2 SPECTRUM & FACETED RIPPLE
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "36px", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "#71717a" }}>Pill (Sign up)</span>
          <div style={{ width: 320, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LiquidMetalButton variant="pill" text="Sign up" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "#71717a" }}>Circle (Add)</span>
          <div style={{ width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LiquidMetalButton variant="circle" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "#71717a" }}>Play (Diameter 88)</span>
          <div style={{ width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LiquidMetalButton variant="play" diameter={88} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  ),
};
