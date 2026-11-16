import type { NextConfig } from 'next';
import { RuntimeFactory } from '../../packages/core/src/infra/factories/runtime/runtime.factory';
const config: NextConfig = { ...RuntimeFactory.forApp('web'), transpilePackages: ['@freela/core', '@freela/design-system', '@freela/config-tailwind'], outputFileTracingRoot: new URL('../../', import.meta.url).pathname, outputFileTracingIncludes: { '/*': ['config/*.json', '../docs/content/**/*.json', '../../pnpm-workspace.yaml'] }, outputFileTracingExcludes: { '/*': ['../../.env*', '../../.data/**/*', '../../.git/**/*', '../../.stitch/**/*'] }, poweredByHeader: false, devIndicators: false };
export default config;
