import { searchCategoryIds } from '@core/domain/place-types';
import { DomainError } from '@core/domain/errors';
export class PlaceCategory { constructor(readonly value: string) { if(!searchCategoryIds.includes(value)) throw new DomainError('Unsupported place category.'); } }
