import type { Region as RegionData } from '@core/domain/model';
import { validRegion } from '@core/domain/region';
import { DomainError } from '@core/domain/errors';
export class Region {
  readonly value: RegionData;
  constructor(value: RegionData) {
    if (!validRegion(value)) throw new DomainError('Invalid region. Radius must be between 100 and 50000 meters.');
    this.value = Object.freeze({ ...value });
  }
}
