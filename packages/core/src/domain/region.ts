import type { Region } from './model';
export function validRegion(value: Region): boolean {
 return Number.isFinite(value.latitude) && Math.abs(value.latitude)<=90 && Number.isFinite(value.longitude) && Math.abs(value.longitude)<=180 && Number.isFinite(value.radius) && value.radius>=100 && value.radius<=50000;
}
