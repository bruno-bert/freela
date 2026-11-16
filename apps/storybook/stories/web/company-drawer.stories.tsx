import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { SiteRequest } from '@core/domain/model';
import { fn, userEvent, expect }  from 'storybook/test';
import { CompanyDrawer } from '../../../web/src/components/company-drawer';
import { company, t, queuedRequest, websiteAudit } from '../../fixtures';
const meta = { title: 'Web/Opportunities/CompanyDrawer', component: CompanyDrawer, tags: ['autodocs'], args: { company, mode: 'details', copy: t, onRequestSite: async()=>queuedRequest, onLoadSiteRequest: async():Promise<SiteRequest|null>=>null, onClose: fn(), onPrepare: fn(), onRecord: fn().mockResolvedValue({ contacted: true, version: 1, history: [] }) } } satisfies Meta<typeof CompanyDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Contact: Story = { args: { mode: 'contact' } };
export const Queued: Story = { args: { mode: 'contact', onLoadSiteRequest: async()=>queuedRequest } };
export const QueueError: Story = { args: { mode: 'contact', onLoadSiteRequest: async()=>{throw new Error('Unavailable');} } };

export const WebsiteReview:Story={args:{company:{...company,website:'https://example.com'},mode:'contact',onAnalyze:async()=>websiteAudit},play:async({canvas})=>{await userEvent.click(canvas.getByRole('button',{name:t.analyzeWebsite}));await expect(canvas.findByText('Adicionar descrição')).resolves.toBeVisible();}};
export const ReviewError:Story={args:{company:{...company,website:'https://example.com'},onAnalyze:async()=>{throw Error('Unavailable');}},play:async({canvas})=>{await userEvent.click(canvas.getByRole('button',{name:t.analyzeWebsite}));await expect(canvas.findByText(t.auditError)).resolves.toBeVisible();}};

const whatsappPhone='+1 202 555 0100';
const whatsappState={contacted:false,version:1,history:[],whatsappConfirmation:{number:'12025550100',confirmedAt:'2026-11-16T12:00:00Z'}};
export const PhoneOnly:Story={args:{company:{...company,phone:whatsappPhone,whatsapp:null},mode:'contact',onConfirmWhatsapp:async()=>whatsappState}};
export const ConfirmedWhatsapp:Story={args:{company:{...company,phone:whatsappPhone,whatsapp:null,contact:whatsappState},mode:'contact',onConfirmWhatsapp:async()=>whatsappState}};
export const ManualConfirmation:Story={args:{company:{...company,fictional:false,phone:whatsappPhone,whatsapp:null},mode:'contact',onConfirmWhatsapp:async()=>whatsappState},play:async({canvas})=>{const previous=window.open;window.open=fn(()=>null);try{await userEvent.click(canvas.getByRole('button',{name:t.openWhatsapp}));await userEvent.click(canvas.getByRole('button',{name:t.confirmWhatsapp}));await expect(canvas.getByRole('button',{name:t.openWhatsapp})).toHaveAccessibleDescription(t.whatsappConfirmed);}finally{window.open=previous;}}};
export const WhatsappSaveError:Story={args:{company:{...company,fictional:false,phone:whatsappPhone,whatsapp:null},mode:'contact',onConfirmWhatsapp:async()=>{throw Error('Unavailable');}},play:async({canvas})=>{const previous=window.open;window.open=fn(()=>null);try{await userEvent.click(canvas.getByRole('button',{name:t.openWhatsapp}));await userEvent.click(canvas.getByRole('button',{name:t.confirmWhatsapp}));await expect(canvas.findByText(t.whatsappConfirmError)).resolves.toBeVisible();}finally{window.open=previous;}}};
