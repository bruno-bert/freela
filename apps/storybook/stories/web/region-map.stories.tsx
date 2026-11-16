import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { RegionMap } from '../../../web/src/components/region-map';
import { company, t } from '../../fixtures';
const meta = { title: 'Web/Opportunities/RegionMap', component: RegionMap, tags: ['autodocs'], args: { region: { latitude: -23.589, longitude: -46.635, radius: 2000 }, companies: [company], onSelect: fn(), onCompany: fn(), copy: t, provider: 'schematic', apiKey: '' } } satisfies Meta<typeof RegionMap>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InternationalRegion: Story = {args:{region:{latitude:52.3546,longitude:4.8933,radius:1200},companies:[]}};
