import { DomainError } from '@core/domain/errors';
import { circleStyle } from '@theme/map-tokens';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import type { Region, Company } from '@core/domain/model';
import type { MapPort, MapHandle } from '../../../../domain/ports/maps/map.port';
let configuredKey: string | undefined;
export class GoogleMapAdapter implements MapPort {
 constructor(private readonly key: string) {}
 async mount(element: HTMLElement, region: Region, onSelect: (region: Region) => void): Promise<MapHandle> {
  if(configuredKey === undefined) {setOptions({key:this.key,v:'quarterly'});configuredKey=this.key;}
  else if(configuredKey !== this.key) throw new DomainError('Maps configuration changed. Reload the page.');
  const { Map, Circle } = await importLibrary('maps');
  const map = new Map(element, { center: { lat: region.latitude, lng: region.longitude }, zoom: 14, gestureHandling: 'cooperative', streetViewControl: false, mapTypeControl: false });
  // A passive overlay lets mouse drags pan the map instead of dragging the circle.
  const circle = new Circle({ map, center: map.getCenter(), radius: region.radius, clickable: false, editable: false, draggable: false, ...circleStyle });
  const select = (point: google.maps.LatLng | null) => { if(point) onSelect({latitude:point.lat(),longitude:point.lng(),radius:circle.getRadius()}); };
  const listeners = [map.addListener('dragend',()=>select(map.getCenter() ?? null)),map.addListener('click',(event:google.maps.MapMouseEvent)=>select(event.latLng))];
  let center = region;
  let markers: google.maps.Marker[] = [];
  const fit = () => {const bounds=circle.getBounds();if(bounds)map.fitBounds(bounds);};
  fit();
  return {
   update(next: Region, companies: Company[]) {
    if(next.latitude!==center.latitude || next.longitude!==center.longitude)map.setCenter({lat:next.latitude,lng:next.longitude});
    center=next;circle.setCenter({lat:next.latitude,lng:next.longitude});
    if(Math.abs(circle.getRadius()-next.radius)>1){circle.setRadius(next.radius);fit();}
    markers.forEach(marker=>marker.setMap(null));
    markers=companies.map((company,index)=>new google.maps.Marker({map,position:{lat:company.location.latitude,lng:company.location.longitude},label:String(index+1),title:company.name}));
   },
   destroy(){listeners.forEach(listener=>listener.remove());markers.forEach(marker=>marker.setMap(null));circle.setMap(null);},
  };
 }
}
