import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { resolve } from 'node:path';
export default defineConfig({ plugins: [storybookTest({ configDir: resolve('apps/storybook/.storybook') })], test: { name: 'storybook', browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] }, setupFiles: [resolve('apps/storybook/.storybook/vitest.setup.ts')] } });
