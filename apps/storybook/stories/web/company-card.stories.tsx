import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { CompanyCard } from '../../../web/src/components/company-card';
import { company, t } from '../../fixtures';
const meta = { title: 'Web/Opportunities/CompanyCard', component: CompanyCard, tags: ['autodocs'], args: { company, index: 0, copy: t, onDetails: fn(), onContact: fn() } } satisfies Meta<typeof CompanyCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Contacted: Story = { args: { company: { ...company, contact: { contacted: true, version: 1, history: [] } } } };
export const LongAddress: Story = {args:{company:{...company,name:'Example neighborhood clinic',address:'A long example commercial address with a suite and neighborhood, New York (fictional)'}}};

export const ExistingWebsite: Story = {args:{company:{...company,website:'https://example.com',email:'hello@example.com'}}};

export const ConfirmedWhatsapp:Story={args:{company:{...company,phone:'+1 202 555 0100',whatsapp:'12025550100',whatsappConfirmed:true,contact:{contacted:false,version:1,history:[],whatsappConfirmation:{number:'12025550100',confirmedAt:'2026-11-16T12:00:00Z'}}}}};
