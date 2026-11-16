import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {userEvent,expect} from 'storybook/test';
import { Workspace } from '../../../web/src/components/workspace';
import type { Company } from '@core/domain/model';
import denseCompanies from '../../fixtures/dense-companies.json';
import { company, t } from '../../fixtures';
const meta = { title: 'Web/Opportunities/Workspace', component: Workspace, tags: ['autodocs'], args: { copy: t, identity: { id: 'demo-owner', name: 'Lucas Martins', role: 'owner' }, locale: 'pt-BR', initial: { companies: [company], provider: 'demo', exhaustive: false, fetched: 1 }, placesProvider:'demo', mapProvider: 'schematic', mapKey: '' } } satisfies Meta<typeof Workspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { initial: { companies: [], provider: 'demo', exhaustive: false, fetched: 0 } } };
export const Error: Story = { args: { initial: null } };
export const LiveProviderError: Story = {args:{initial:null,placesProvider:'google-places'}};
export const ManyResults: Story = {args:{initial:{companies:denseCompanies as Company[],provider:'demo',exhaustive:false,fetched:denseCompanies.length}}};

export const WebsiteSelection:Story={play:async({canvas})=>{await userEvent.click(canvas.getByRole('checkbox',{name:t.noWebsite}));await expect(canvas.getByLabelText(t.websiteFilter)).toHaveValue('all');await userEvent.selectOptions(canvas.getByLabelText(t.websiteFilter),'present');await expect(canvas.getByRole('checkbox',{name:t.noWebsite})).not.toBeChecked();}};

export const VerifiedChannel:Story={args:{initial:{companies:[{...company,phone:'+1 202 555 0100',whatsapp:'12025550100',whatsappConfirmed:true,contact:{contacted:false,version:1,history:[],whatsappConfirmation:{number:'12025550100',confirmedAt:'2026-11-16T12:00:00Z'}}}],provider:'demo',exhaustive:false,fetched:1}}};
