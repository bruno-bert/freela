import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon } from '@design-system';
const meta = { title: 'DesignSystem/Icon', component: Icon, tags: ['autodocs'], args: { name: 'work' } } satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
