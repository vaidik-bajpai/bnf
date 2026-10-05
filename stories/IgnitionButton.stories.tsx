import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { IgnitionButton } from "@/src/components/ui/threeui/IgnitionButton";

const meta: Meta<typeof IgnitionButton> = {
  title: "ThreeUI/Buttons/IgnitionButton",
  component: IgnitionButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0c0d12" },
        { name: "warm-stone", value: "#f4f1ea" },
      ],
    },
    docs: {
      description: {
        component: `
### Authentic Native WebGL Ignition Button

A 100% native, zero-iframe extraction of ThreeUI's **Ignition Terminal** button:
- **Engine**: Hardware-accelerated WebGL fragment shader with procedural Fractal Brownian Motion (FBM), 3-tier rotating relativistic warp stars, and click impulse flash.
- **Hardware Bezel**: Precision 3-stop linear gradient casing with multi-tier inset drop shadows and outer ambient occlusion.
- **Interactive States**:
  - **Hover**: Smoothly accelerates warp tunnel velocity (\`u_warp\` uniform interpolation).
  - **Click**: Triggers full-screen shockwave flash with exponential decay (\`u_flash\` uniform).
  - **Accessibility**: Full keyboard focus ring (\`focus-visible\`), standard button semantics.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Button label text",
      defaultValue: "LAUNCH",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      defaultValue: false,
    },
    onClick: {
      action: "clicked",
      description: "Triggered on button click (fires shockwave flash)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof IgnitionButton>;

/**
 * Standard Ignition button with interactive WebGL FBM warp tunnel.
 * Hover to accelerate the warp streaks; click to trigger the ignition flash shockwave.
 */
export const Default: Story = {
  args: {
    label: "LAUNCH",
  },
};

/**
 * Custom operational labels demonstrating typography tracking and letter spacing.
 */
export const EngageDrive: Story = {
  args: {
    label: "ENGAGE DRIVE",
  },
};

export const StartEngine: Story = {
  args: {
    label: "START ENGINE",
  },
};

/**
 * Showcase context demonstrating how the button integrates into a high-end dark landing page hero.
 */
export const InContextShowcase: Story = {
  render: (args) => (
    <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-[#090a0f] border border-white/10 shadow-2xl max-w-md w-full text-center space-y-6">
      <div className="space-y-1">
        <span className="text-[11px] font-mono tracking-widest text-orange-400 uppercase">
          AETHER SYSTEMS // SEC-09
        </span>
        <h3 className="text-xl font-bold tracking-tight text-white">
          Quantum Propulsion Core
        </h3>
        <p className="text-xs text-neutral-400 max-w-xs">
          Hover to initiate pre-ignition warp sequence. Click to fire ignition pulse.
        </p>
      </div>

      <div className="py-2">
        <IgnitionButton {...args} />
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500">
        <span>STATUS: ARMED</span>
        <span>•</span>
        <span>CORE: NOMINAL</span>
      </div>
    </div>
  ),
  args: {
    label: "IGNITION",
  },
};
