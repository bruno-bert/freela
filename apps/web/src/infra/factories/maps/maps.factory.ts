import { GoogleMapAdapter } from '../../adapters/maps/google/google-map.adapter';
export function createMap(provider: string, key: string) { if (provider !== 'google') throw new Error('Unknown map provider.'); return new GoogleMapAdapter(key); }
