import { AbstractFactory, type ConfigManager } from '../../../domain/config';
import { JsonConfigManager } from '../../adapters/config/json/config-manager.adapter';
/** Framework bootstrap keeps build-output selection inside ConfigManager. */
export class RuntimeFactory extends AbstractFactory<{distDir:string},ConfigManager> {
 static forApp(app:string) { return new RuntimeFactory(new JsonConfigManager(app)).make(); }
 protected makeInfra() { return this.config; }
 protected makeService(config:ConfigManager) { return {distDir:config.get<string>('app.buildDirectory')}; }
}
