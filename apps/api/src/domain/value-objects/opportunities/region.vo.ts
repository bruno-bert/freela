import type { Region as RegionData } from '@core/domain/model';
import { DomainError } from '@core/domain/errors';
export class Region {
  readonly value: RegionData;
  constructor(value: RegionData) {
    if (!Number.isFinite(value.latitude) || Math.abs(value.latitude) > 90 || !Number.isFinite(value.longitude) || Math.abs(value.longitude) > 180 || !Number.isFinite(value.radius) || value.radius < 100 || value.radius > 50000) throw new DomainError('Invalid region. Radius must be between 100 and 50000 meters.');
    this.value = Object.freeze({ ...value });
  }
}
