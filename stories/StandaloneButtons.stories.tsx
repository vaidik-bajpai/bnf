import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  LaunchButton,
  DotBorderButton,
  FloatingDotsCta,
  SlidingTextCta,
  GradientBeamCta,
  GradientPillButton,
  GenerateButton,
  GlassmorphismCta,
  SpinningBorderButton,
  GradientCta,
  TrochilSignalButton,
  AttuneThermalButton,
  TideformOutlineButton,
  UnderstoryArrowPillButton,
  MeridianKeycapPrimaryButton,
  MeridianKeycapSecondaryButton,
  HalvorsenArrowPillButton,
  AsterGlassAccessButton,
  AsterGlassArrowButton,
  EmberKeycapButton,
  DarkGlassButton,
  LumenCta,
  LumenCtaGhost,
  BloomOutlineButton,
} from "@/src/components/standalone-buttons";

const meta: Meta = {
  title: "ThreeUI/StandaloneButtons",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Static, standalone, 100% TSX button components extracted directly from raw-rectangle-buttons.json. Contains ZERO iframes or embeds — fully customizable with props, native events, and inline styles in your local React environment.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

/* -------------------------------------------------------------------------- */
/* Neuform Standalone Buttons (Converted from HTML/iframe to pure TSX)        */
/* -------------------------------------------------------------------------- */

export const Launch: StoryObj = {
  name: "1. Launch Button",
  render: () => <LaunchButton label="Initialize Launch" />,
};

export const DotBorder: StoryObj = {
  name: "2. Dot Border Button",
  render: () => <DotBorderButton label="Start Creating" />,
};

export const FloatingDots: StoryObj = {
  name: "3. Floating Dots CTA",
  render: () => <FloatingDotsCta label="Sign Up" />,
};

export const SlidingText: StoryObj = {
  name: "4. Sliding Text CTA",
  render: () => <SlidingTextCta label="Download Mac app" />,
};

export const GradientBeam: StoryObj = {
  name: "5. Gradient Beam CTA",
  render: () => <GradientBeamCta label="Start Building" />,
};

export const GradientPill: StoryObj = {
  name: "6. Gradient Pill Button",
  render: () => <GradientPillButton label="Demo Lesson" />,
};

export const Generate: StoryObj = {
  name: "7. Generate Button",
  render: () => <GenerateButton label="Generate" activeLabel="Generating" highlightHue={210} />,
};

export const Glassmorphism: StoryObj = {
  name: "8. Glassmorphism CTA",
  render: () => <GlassmorphismCta label="Generate My Site" />,
};

export const SpinningBorder: StoryObj = {
  name: "9. Spinning Border Button",
  render: () => <SpinningBorderButton label="Request Demo" />,
};

export const GradientSunrise: StoryObj = {
  name: "10. Gradient CTA (Sunrise)",
  render: () => <GradientCta label="Start Free Pilot" />,
};

/* -------------------------------------------------------------------------- */
/* Page Buttons (Native TSX & ThreeUI tactile physics)                        */
/* -------------------------------------------------------------------------- */

export const BloomOutline: StoryObj = {
  name: "11. Bloom Outline Button",
  render: () => <BloomOutlineButton label="See the season" mode="dark" />,
};

export const TrochilSignal: StoryObj = {
  name: "12. Trochil Signal",
  render: () => <TrochilSignalButton mode="dark" />,
};

export const AttuneThermal: StoryObj = {
  name: "13. Attune Thermal",
  render: () => <AttuneThermalButton mode="dark" />,
};

export const TideformOutline: StoryObj = {
  name: "14. Tideform Outline",
  render: () => <TideformOutlineButton mode="dark" />,
};

export const UnderstoryArrowPill: StoryObj = {
  name: "15. Understory Arrow Pill",
  render: () => <UnderstoryArrowPillButton mode="dark" />,
};

export const MeridianKeycapPrimary: StoryObj = {
  name: "16. Meridian Keycap (Primary)",
  render: () => <MeridianKeycapPrimaryButton mode="dark" />,
};

export const MeridianKeycapSecondary: StoryObj = {
  name: "17. Meridian Keycap (Secondary)",
  render: () => <MeridianKeycapSecondaryButton mode="dark" />,
};

export const HalvorsenArrowPill: StoryObj = {
  name: "18. Halvorsen Arrow Pill",
  render: () => <HalvorsenArrowPillButton mode="dark" />,
};

export const AsterGlassAccess: StoryObj = {
  name: "19. Aster Glass Access",
  render: () => <AsterGlassAccessButton mode="dark" />,
};

export const AsterGlassArrow: StoryObj = {
  name: "20. Aster Glass Arrow",
  render: () => <AsterGlassArrowButton mode="dark" />,
};

export const EmberKeycap: StoryObj = {
  name: "21. Ember Keycap ($249 Pre-order)",
  render: () => <EmberKeycapButton mode="dark" />,
};

export const DarkGlass: StoryObj = {
  name: "22. Dark Glass Pill (Section)",
  render: () => <DarkGlassButton mode="dark" />,
};

export const LumenPrimary: StoryObj = {
  name: "23. Lumen CTA (Primary)",
  render: () => <LumenCta label="Get your card" mode="dark" />,
};

export const LumenGhost: StoryObj = {
  name: "24. Lumen CTA (Ghost)",
  render: () => <LumenCtaGhost label="Get your card" mode="dark" />,
};

/* -------------------------------------------------------------------------- */
/* Complete Showcase Galleries                                                */
/* -------------------------------------------------------------------------- */

export const NeuformShowcaseGallery: StoryObj = {
  name: "Gallery: 10 Neuform Buttons (No Iframes)",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center", justifyContent: "center", padding: "40px", background: "#0a0a0c", borderRadius: "16px" }}>
      <LaunchButton />
      <DotBorderButton />
      <FloatingDotsCta />
      <SlidingTextCta />
      <GradientBeamCta />
      <GradientPillButton />
      <GenerateButton />
      <GlassmorphismCta />
      <SpinningBorderButton />
      <GradientCta />
    </div>
  ),
};

export const PageButtonsShowcaseGallery: StoryObj = {
  name: "Gallery: Page & Tactile Buttons",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center", justifyContent: "center", padding: "40px", background: "#121217", borderRadius: "16px" }}>
      <BloomOutlineButton />
      <TrochilSignalButton />
      <AttuneThermalButton />
      <TideformOutlineButton />
      <UnderstoryArrowPillButton />
      <MeridianKeycapPrimaryButton />
      <HalvorsenArrowPillButton />
      <AsterGlassAccessButton />
      <EmberKeycapButton />
      <DarkGlassButton />
      <LumenCta />
      <LumenCtaGhost />
    </div>
  ),
};
