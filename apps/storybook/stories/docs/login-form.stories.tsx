import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoginForm } from '../../../docs/src/components/login-form';
import { t } from '../../fixtures';
const meta = { title: 'Docs/LoginForm', component: LoginForm, tags: ['autodocs'], args: { copy: t, provider: 'local', firebase: null, returnTo: '/' } } satisfies Meta<typeof LoginForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
