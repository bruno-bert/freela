import 'server-only';
import type { ConfigManager } from '@core/domain/config';
import { JsonConfigManager } from '@core/infra/adapters/config/json/config-manager.adapter';
export const getConfigManager = (): ConfigManager => new JsonConfigManager('docs');
