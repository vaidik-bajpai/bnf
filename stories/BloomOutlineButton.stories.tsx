import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

export interface BloomOutlineButtonProps {
  /** The text displayed on the button label */
  label?: string;
  /** Theme mode for dark or light backgrounds */
  mode?: 'dark' | 'light';
  /** Enable subtle magnetic pointer drift */
  magnetic?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

const BLOOM_OUTLINE_STYLES = `
.threeui-bloom-stage {
  --threeui-bloom-outline-edge: #f5ece6;
  --threeui-bloom-outline-fill: #f5ece6;
  --threeui-bloom-outline-fg: #3f2c33;
  --threeui-page-ink: #f5ece6;
  background: #b5808e;
  font-family: "General Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 48px 64px;
  border-radius: 12px;
  position: relative;
  isolation: isolate;
}

.threeui-bloom-stage[data-mode="light"] {
  --threeui-bloom-outline-edge: #3f2c33;
  --threeui-bloom-outline-fill: #3f2c33;
  --threeui-bloom-outline-fg: #f5ece6;
  background: #fdf7f4;
}

.threeui-page-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
}

.threeui-page-button--bloom-outline {
  --bloom-outline-x: 50%;
  --bloom-outline-y: 50%;
  --bloom-outline-diameter: 220px;
  gap: 13.6px;
  overflow: hidden;
  padding: 14.4px 23.2px;
  border: 1px solid currentColor;
  border-radius: 2px;
  background: transparent;
  color: var(--threeui-bloom-outline-edge);
  font-size: 14.72px;
  font-weight: 400;
  letter-spacing: .045em;
  line-height: 1;
  text-transform: uppercase;
  will-change: transform;
  transition:
    color .38s cubic-bezier(.22, .61, .36, 1),
    border-color .38s cubic-bezier(.22, .61, .36, 1),
    transform .55s cubic-bezier(.19, 1, .22, 1);
}

.threeui-page-button--bloom-outline::before {
  content: "";
  position: absolute;
  z-index: 0;
  left: var(--bloom-outline-x);
  top: var(--bloom-outline-y);
  width: var(--bloom-outline-diameter);
  height: var(--bloom-outline-diameter);
  border-radius: 50%;
  background: var(--threeui-bloom-outline-fill);
  transform: translate(-50%, -50%) scale(0);
  transition: transform .58s cubic-bezier(.19, 1, .22, 1);
}

.threeui-page-button--bloom-outline > * {
  position: relative;
  z-index: 1;
}

.threeui-page-button--bloom-outline:hover,
.threeui-page-button--bloom-outline:focus-visible {
  border-color: var(--threeui-bloom-outline-fg);
  color: var(--threeui-bloom-outline-fg);
}

.threeui-page-button--bloom-outline:hover::before,
.threeui-page-button--bloom-outline:focus-visible::before {
  transform: translate(-50%, -50%) scale(1);
}

.threeui-page-button--bloom-outline .threeui-page-button__bloom-label {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  position: relative;
}

.threeui-page-button--bloom-outline .threeui-page-button__bloom-label > span {
  display: block;
  transition: transform .5s cubic-bezier(.19, 1, .22, 1);
}

.threeui-page-button--bloom-outline .threeui-page-button__bloom-label > span + span {
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(115%);
}

.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-label > span:first-child,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-label > span:first-child {
  transform: translateY(-115%);
}

.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-label > span + span,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-label > span + span {
  transform: translateY(0);
}

.threeui-page-button__bloom-dot {
  width: 4.8px;
  height: 4.8px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
  transition: transform .55s cubic-bezier(.19, 1, .22, 1), opacity .4s;
}

.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-dot:first-child,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-dot:first-child {
  opacity: .5;
  transform: translateX(5.44px) scale(.6);
}

.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-dot:last-child,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-dot:last-child {
  transform: translateX(-5.44px) scale(1.7);
}
`;

/**
 * BloomOutlineButton component isolating the exact button logic and interaction.
 */
export const BloomOutlineButton: React.FC<BloomOutlineButtonProps> = ({
  label = 'See the season',
  mode = 'dark',
  magnetic = true,
  onClick,
}) => {
  return (
    <div className="threeui-bloom-stage" data-mode={mode}>
      <style>{BLOOM_OUTLINE_STYLES}</style>
      <button
        className="threeui-page-button threeui-page-button--bloom-outline"
        type="button"
        onClick={onClick}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const diameter = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
          event.currentTarget.style.setProperty("--bloom-outline-x", `${x.toFixed(1)}px`);
          event.currentTarget.style.setProperty("--bloom-outline-y", `${y.toFixed(1)}px`);
          event.currentTarget.style.setProperty("--bloom-outline-diameter", `${diameter.toFixed(1)}px`);
          if (magnetic && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const dx = (x - rect.width / 2) / rect.width;
            const dy = (y - rect.height / 2) / rect.height;
            event.currentTarget.style.transform = `translate3d(${(dx * 14).toFixed(1)}px, ${(dy * 9).toFixed(1)}px, 0)`;
          }
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.transform = '';
        }}
      >
        <span className="threeui-page-button__bloom-dot" aria-hidden="true" />
        <span className="threeui-page-button__bloom-label">
          <span>{label}</span>
          <span aria-hidden="true">{label}</span>
        </span>
        <span className="threeui-page-button__bloom-dot" aria-hidden="true" />
      </button>
    </div>
  );
};

const meta: Meta<typeof BloomOutlineButton> = {
  title: 'ThreeUI/Buttons/BloomOutlineButton',
  component: BloomOutlineButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Seasonal tactile button featuring pointer-calculated radial bloom expansion, magnetic drift, dual blossom dots, and sliding typography.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button text label',
      table: { defaultValue: { summary: 'See the season' } },
    },
    mode: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Visual theme mode (dark rose or light cream)',
      table: { defaultValue: { summary: 'dark' } },
    },
    magnetic: {
      control: 'boolean',
      description: 'Enable or disable magnetic cursor drift physics',
      table: { defaultValue: { summary: 'true' } },
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof BloomOutlineButton>;

/**
 * Default Dark Mode:
 * Features a soft rose background, pale blossom outline, and radial expansion from cursor origin.
 */
export const Default: Story = {
  args: {
    label: 'See the season',
    mode: 'dark',
    magnetic: true,
  },
};

/**
 * Light Mode:
 * High contrast variant with inverted cream background and deep berry outline/fill.
 */
export const LightMode: Story = {
  args: {
    label: 'See the season',
    mode: 'light',
    magnetic: true,
  },
};

/**
 * Custom Label:
 * Demonstrates the auto-scaling label geometry and sliding duplicate text animation with custom copy.
 */
export const CustomLabel: Story = {
  args: {
    label: 'Explore Collection',
    mode: 'dark',
    magnetic: true,
  },
};

/**
 * Static / Reduced Motion:
 * Preserves the radial ink bloom effect while disabling magnetic pointer drift.
 */
export const StaticNoDrift: Story = {
  args: {
    label: 'Static Position',
    mode: 'dark',
    magnetic: false,
  },
};

/**
 * Side-by-Side Comparison:
 * Displays both Dark and Light variants together for design review.
 */
export const SideBySide: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <BloomOutlineButton label="Dark Mode" mode="dark" />
      <BloomOutlineButton label="Light Mode" mode="light" />
    </div>
  ),
};
