import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Documentation } from '../../../docs/src/components/documentation';
const meta = { title: 'Docs/Documentation', component: Documentation, tags: ['autodocs'], args: { content: { title: 'Workspace guide', overview: 'Explore local opportunities.' }, changelog: '' } } satisfies Meta<typeof Documentation>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const Changelog: StoryObj<typeof meta> = { args: { changelog: 'Unreleased: Opportunities workspace.' } };
