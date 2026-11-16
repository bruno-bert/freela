import type { StorybookConfig } from '@storybook/nextjs-vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const config: StorybookConfig = { stories: ['../stories/**/*.stories.tsx'], addons: ['@storybook/addon-docs','@storybook/addon-a11y','@storybook/addon-vitest'], framework: '@storybook/nextjs-vite', viteFinal: async config => { config.resolve ??= {}; config.resolve.alias = { ...config.resolve.alias, '@theme': resolve(root, 'packages/config-tailwind'), '@design-system': resolve(root, 'packages/design-system/src/index.tsx'), '@core': resolve(root, 'packages/core/src') }; config.css = { postcss: { plugins: [(await import('tailwindcss')).default({ presets: [(await import('../../../packages/config-tailwind/preset')).default], content: [resolve(root, 'packages/design-system/src/**/*.{ts,tsx}'),resolve(root, 'apps/web/src/**/*.{ts,tsx}'),resolve(root, 'apps/docs/src/**/*.{ts,tsx}'),resolve(root, 'apps/storybook/stories/**/*.tsx')] }), (await import('autoprefixer')).default()] } }; return config; } };
export default config;
