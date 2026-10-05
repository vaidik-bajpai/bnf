import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { ConstellationField } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

const meta: Meta<typeof ConstellationField> = {
  title: 'ThreeUI/ConstellationField',
  component: ConstellationField,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ThreeUI ConstellationField with the **Gateway Flow** (`gateway-flow`) variant. A black-stage flow canvas with streaming gateway trajectories. Fully owned by the codebase with pure HTML and Canvas 2D runtime — zero iframes. Includes interactive click shockwave explosions that deflect traveling trajectories.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['gateway-flow', 'constellation-field', 'particle-drift', 'particle-network'],
      description: 'Constellation field shader variant',
      table: {
        defaultValue: { summary: 'gateway-flow' },
      },
    },
    mode: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Color theme mode (dark with obsidian background or light with paper background)',
      table: {
        defaultValue: { summary: 'dark' },
      },
    },
    speed: {
      control: { type: 'range', min: 0.1, max: 3.0, step: 0.1 },
      description: 'Velocity multiplier of traveling particles along the gateway trajectories',
      table: {
        defaultValue: { summary: '1.00' },
      },
    },
    size: {
      control: { type: 'range', min: 0.2, max: 3.0, step: 0.1 },
      description: 'Size multiplier for trajectory lines and particle squares',
      table: {
        defaultValue: { summary: '1.00' },
      },
    },
    length: {
      control: { type: 'range', min: 0.35, max: 2.5, step: 0.05 },
      description: 'Horizontal curvature and span scale of the gateway trajectories',
      table: {
        defaultValue: { summary: '1.00' },
      },
    },
    density: {
      control: { type: 'range', min: 0.25, max: 2.5, step: 0.1 },
      description: 'Density multiplier of streaming gateway trajectory paths',
      table: {
        defaultValue: { summary: '1.00' },
      },
    },
    opacity: {
      control: { type: 'range', min: 0.1, max: 1.0, step: 0.05 },
      description: 'Overall opacity of the canvas field',
      table: {
        defaultValue: { summary: '1.00' },
      },
    },
    hue: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Hue rotation in degrees',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    saturation: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Color saturation multiplier',
      table: {
        defaultValue: { summary: '1.00' },
      },
    },
    brightness: {
      control: { type: 'range', min: 0.35, max: 1.65, step: 0.05 },
      description: 'Brightness multiplier',
      table: {
        defaultValue: { summary: '1.00' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConstellationField>;

/**
 * Exact ThreeUI Configured Usage Reference Scene
 */
export const Scene: Story = {
  render: (args) => (
    <div className="shader-frame w-full h-screen min-h-[500px]">
      <ConstellationField {...args} />
    </div>
  ),
  args: {
    variant: 'gateway-flow',
    mode: 'dark',
    speed: 1.0,
    size: 1.0,
    length: 1.0,
    density: 1.0,
    opacity: 1.0,
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
  },
};

/**
 * High Speed Luminous Stream
 */
export const HighSpeedStream: Story = {
  render: (args) => (
    <div className="shader-frame w-full h-screen min-h-[500px]">
      <ConstellationField {...args} />
    </div>
  ),
  args: {
    variant: 'gateway-flow',
    mode: 'dark',
    speed: 2.2,
    size: 1.3,
    length: 1.2,
    density: 1.4,
    opacity: 1.0,
    hue: 0,
    saturation: 1.0,
    brightness: 1.2,
  },
};

/**
 * Light Paper Mode
 */
export const LightMode: Story = {
  render: (args) => (
    <div className="shader-frame w-full h-screen min-h-[500px]">
      <ConstellationField {...args} />
    </div>
  ),
  args: {
    variant: 'gateway-flow',
    mode: 'light',
    speed: 1.0,
    size: 1.0,
    length: 1.0,
    density: 1.0,
    opacity: 1.0,
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
  },
};

/**
 * Saffron & Green Gateway Flow:
 * Beads streaming from the left are saffron:
 * - #FFB866 (Light)
 * - #FF9933 (Base)
 * - #D96B00 (Deep)
 *
 * Beads streaming from the right are green:
 * - #5BBF72 (Light)
 * - #138808 (Base)
 * - #075E2E (Deep)
 */
export const SaffronAndGreenParticles: Story = {
  render: (args) => (
    <div className="shader-frame w-full h-screen min-h-[500px]">
      <ConstellationField {...args} />
    </div>
  ),
  args: {
    variant: 'gateway-flow',
    mode: 'dark',
    speed: 1.0,
    size: 1.0,
    length: 1.0,
    density: 1.0,
    opacity: 1.0,
    saffronShades: ['#FFB866', '#FF9933', '#D96B00'],
    greenShades: ['#5BBF72', '#138808', '#075E2E'],
  },
};
