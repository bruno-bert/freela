import {it,expect} from 'vitest';
import {RuntimeFactory} from './runtime.factory';
import {JsonConfigManager} from '../../adapters/config/json/config-manager.adapter';
it('isolates test build output from the live development server',()=>{expect(RuntimeFactory.forApp('web').distDir).toBe('.next-test');expect(new RuntimeFactory(new JsonConfigManager('web',{APP_ENV:'development'})).make().distDir).toBe('.next');});
