import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { CompanyDrawer } from '../../../web/src/components/company-drawer';
import { company, t } from '../../fixtures';
const meta = { title: 'Web/Opportunities/CompanyDrawer', component: CompanyDrawer, tags: ['autodocs'], args: { company, mode: 'details', copy: t, onClose: fn(), onPrepare: fn(), onRecord: fn().mockResolvedValue({ contacted: true, version: 1, history: [] }) } } satisfies Meta<typeof CompanyDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Contact: Story = { args: { mode: 'contact' } };
