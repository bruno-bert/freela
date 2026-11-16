import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from '@design-system';
const meta = { title: 'DesignSystem/Badge', component: Badge, tags: ['autodocs'], args: { children: 'Sem site informado', tone: 'warning' } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Success: Story = { args: { tone: 'success' } };
