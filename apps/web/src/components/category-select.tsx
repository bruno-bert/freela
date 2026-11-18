"use client";
import type { Copy } from '@core/domain/model';
import { placeTypeGroups, recommendedPlaceTypes } from '@core/domain/place-types';
import { Select } from '@design-system';
const recommended = new Set<string>(recommendedPlaceTypes);
export function CategorySelect({value,copy:t,disabled,onChange}:{value:string;copy:Copy;disabled:boolean;onChange(value:string):void}) {
 const suggestions = recommendedPlaceTypes;
 const groups = placeTypeGroups.map(group=>({...group,types:group.types.filter(id=>!recommended.has(id))}));
 const option = (id:string) => <option key={id} value={id}>{t[`placeType.${id}`]}</option>;
 return <div className="flex items-end gap-sm"><label className="min-w-0 flex-1 space-y-xs"><span className="block text-meta font-semibold uppercase text-muted">{t.category}</span><Select value={value} disabled={disabled} onChange={event=>onChange(event.target.value)}><option value="all">{t.all}</option>{<optgroup label={t.categoryRecommended}>{suggestions.map(option)}</optgroup>}{groups.map(group=><optgroup key={group.id} label={t[`placeGroup.${group.id}`]}>{group.types.map(option)}</optgroup>)}</Select></label></div>;
}
