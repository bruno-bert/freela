import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Select } from '@design-system';
const meta = { title: 'DesignSystem/Select', component: Select, tags: ['autodocs'], args: { 'aria-label': 'Category', children: <option>All</option> } } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
