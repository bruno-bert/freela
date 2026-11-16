import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@design-system';
const meta = { title: 'DesignSystem/Button', component: Button, tags: ['autodocs'], args: { children: 'Buscar nesta região' } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Secondary: Story = { args: { variant: 'secondary' } };
