import type { NextConfig } from 'next';
const config: NextConfig = { transpilePackages: ['@freela/core', '@freela/design-system', '@freela/config-tailwind'], outputFileTracingExcludes: { '/*': ['../../.env*', '../../.data/**/*', '../../.git/**/*', '../../.stitch/**/*'] }, poweredByHeader: false, devIndicators: false };
export default config;
