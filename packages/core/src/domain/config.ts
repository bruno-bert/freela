export interface ConfigManager { get<T>(key: string): T; secret(name: string): string; }
export abstract class AbstractFactory<S, I> {
  constructor(protected readonly config: ConfigManager) {}
  make(): S { return this.makeService(this.makeInfra()); }
  protected abstract makeService(infra: I): S;
  protected abstract makeInfra(): I;
  protected select<T>(key: string, registry: Record<string, () => T>): T {
    const value = this.config.get<string>(key);
    const create = registry[value];
    if (!create) throw new Error(`Unknown selection for ${key}: ${value}`);
    return create();
  }
}
