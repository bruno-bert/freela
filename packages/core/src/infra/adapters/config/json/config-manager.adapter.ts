import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { z } from 'zod';
import type { ConfigManager } from '../../../../domain/config';
export function workspaceRoot(start = process.cwd()) { let current = start; while (!existsSync(resolve(current, 'pnpm-workspace.yaml'))) { const parent = dirname(current); if (parent === current) return process.cwd(); current = parent; } return current; }
const root = workspaceRoot();
const selector = z.object({ provider: z.string().min(1) }).passthrough();
const schema = z.object({ app: z.object({ env: z.enum(['development', 'test', 'production']), commit: z.string(), buildDirectory: z.enum(['.next','.next-test']).default('.next') }), http: z.object({ port: z.number(), swagger: z.object({ enabled: z.boolean() }) }), infra: z.object({ auth: selector, repositories: selector, places: selector, cms: selector, maps: selector, queue: selector.optional(), ai: selector.optional(), websites: selector.optional() }).passthrough(), domains: z.record(z.string(), z.object({ usecases: z.record(z.string(), z.string()) })) });
export class JsonConfigManager implements ConfigManager {
  private readonly data: Record<string, unknown>;
  constructor(private readonly app: string, private readonly env: Record<string, string | undefined> = process.env, rootDirectory = root) {
    const configDir = existsSync(resolve(rootDirectory, `apps/${app}/config/default.json`)) ? resolve(rootDirectory, `apps/${app}/config`) : resolve(rootDirectory, 'config');
    const base = JSON.parse(readFileSync(resolve(configDir, 'default.json'), 'utf8'));
    const mode = env.APP_ENV ?? env.NODE_ENV ?? 'development';
    if (mode !== 'production') loadEnv({ path: resolve(rootDirectory, '.env.local'), quiet: true });
    const overridePath = resolve(configDir, `${mode}.json`);
    const override = existsSync(overridePath) ? JSON.parse(readFileSync(overridePath, 'utf8')) : {};
    const merge = (a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> => Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b)])].map(k => [k, b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) ? merge((a[k] ?? {}) as Record<string, unknown>, b[k] as Record<string, unknown>) : b[k] ?? a[k]]));
    this.data = schema.parse(merge(base, { ...override, app: { ...base.app, ...override.app, env: mode, commit: env.DEPLOY_COMMIT_SHA ?? base.app.commit } }));
    if (mode === 'production' && (this.get('infra.auth.provider') === 'local' || this.get('infra.repositories.provider') === 'memory' || this.get('infra.places.provider') === 'demo' || (this.data.infra as Record<string, {provider?: string}>).queue?.provider === 'local-sqlite' || ['ai','websites'].some(port=>(this.data.infra as Record<string,{provider?:string}>)[port]?.provider==='fixture'))) throw new Error('Development adapters are forbidden in production. Configure Firebase and Google Places.');
  }
  get<T>(key: string): T {
    let value: unknown = this.data;
    for (const part of key.split('.')) value = (value as Record<string, unknown> | undefined)?.[part];
    if ((key === 'infra.cms.json.contentDir' || key === 'infra.queue.local-sqlite.filePath') && typeof value === 'string') return resolve(root, value) as T;
    if (value === undefined) throw new Error(`Missing configuration: ${key}`);
    return value as T;
  }
  secret(name: string): string { const value = this.env[name] ?? process.env[name]; if (!value) throw new Error(`Missing environment variable: ${name}`); return value; }
}
