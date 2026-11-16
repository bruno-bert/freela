import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Drawer } from '@design-system';
const meta = { title: 'DesignSystem/Drawer', component: Drawer, tags: ['autodocs'], args: { title: 'Company details', closeLabel: 'Close', onClose: fn(), children: 'Company information', footer: <button>Close</button> } } satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
