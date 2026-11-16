import {defineConfig} from 'vitest/config';
import {resolve} from 'node:path';
export default defineConfig({resolve:{alias:{'@core':resolve('packages/core/src')}},test:{environment:'node',include:['tests/*.integration.ts'],testTimeout:20000,hookTimeout:30000}});
