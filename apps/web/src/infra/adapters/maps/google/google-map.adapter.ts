import { circleStyle } from '@theme/map-tokens';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import type { Region, Company } from '@core/domain/model';
import type { MapPort, MapHandle } from '../../../../domain/ports/maps/map.port';
export class GoogleMapAdapter implements MapPort {
 constructor(private readonly key: string) {}
 async mount(element: HTMLElement, region: Region, onSelect: (region: Region) => void): Promise<MapHandle> {
  setOptions({ key: this.key, v: 'quarterly' });
  const { Map, Circle } = await importLibrary('maps');
  const map = new Map(element, { center: { lat: region.latitude, lng: region.longitude }, zoom: 14, streetViewControl: false, mapTypeControl: false });
  const circle = new Circle({ map, center: map.getCenter(), radius: region.radius, editable: true, draggable: true, ...circleStyle });
  let updating = false;
  const change = () => { if(updating) return; const center = circle.getCenter(); if (center) onSelect({ latitude: center.lat(), longitude: center.lng(), radius: Math.min(50000, Math.max(100, circle.getRadius())) }); };
  const listeners = [circle.addListener('dragend', change), circle.addListener('radius_changed', change), map.addListener('click', (event: google.maps.MapMouseEvent) => { if (event.latLng) { circle.setCenter(event.latLng); change(); } })];
  let center = region;
  let markers: google.maps.Marker[] = [];
  return { update(next: Region, companies: Company[]) { updating=true; if(next.latitude!==center.latitude || next.longitude!==center.longitude) map.panTo({lat:next.latitude,lng:next.longitude}); center=next; circle.setCenter({ lat: next.latitude, lng: next.longitude }); if (Math.abs(circle.getRadius() - next.radius) > 1) circle.setRadius(next.radius); markers.forEach(m => m.setMap(null)); markers = companies.map((company, index) => new google.maps.Marker({ map, position: { lat: company.location.latitude, lng: company.location.longitude }, label: String(index + 1), title: company.name })); updating=false; }, destroy() { listeners.forEach(l => l.remove()); markers.forEach(m => m.setMap(null)); circle.setMap(null); } };
 }
}
