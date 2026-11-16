import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@design-system';
const meta = { title: 'DesignSystem/Input', component: Input, tags: ['autodocs'], args: { 'aria-label': 'Portfolio', placeholder: 'https://example.com' } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
