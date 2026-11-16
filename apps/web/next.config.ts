import type { NextConfig } from 'next';
import { RuntimeFactory } from '../../packages/core/src/infra/factories/runtime/runtime.factory';
const config: NextConfig = { ...RuntimeFactory.forApp('web'), transpilePackages: ['@freela/core', '@freela/design-system', '@freela/config-tailwind'], outputFileTracingExcludes: { '/*': ['../../.env*', '../../.data/**/*', '../../.git/**/*', '../../.stitch/**/*'] }, poweredByHeader: false, devIndicators: false };
export default config;
