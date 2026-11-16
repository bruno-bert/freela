import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from '@design-system';
const meta = { title: 'DesignSystem/Card', component: Card, tags: ['autodocs'], args: { children: 'Company details' } } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
