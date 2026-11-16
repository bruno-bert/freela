"use client";
import { useState } from 'react';
import type { Copy } from '@core/domain/model';
import { placeTypeGroups, recommendedPlaceTypes } from '@core/domain/place-types';
import { Input, Select } from '@design-system';
const recommended = new Set<string>(recommendedPlaceTypes);
const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
export function CategorySelect({value,copy:t,disabled,onChange}:{value:string;copy:Copy;disabled:boolean;onChange(value:string):void}) {
 const [query,setQuery] = useState('');
 const matches = (id:string) => id===value || normalize(`${t[`placeType.${id}`]} ${id}`).includes(normalize(query.trim()));
 const suggestions = recommendedPlaceTypes.filter(matches);
 const groups = placeTypeGroups.map(group=>({...group,types:group.types.filter(id=>!recommended.has(id)&&matches(id))})).filter(group=>group.types.length);
 const option = (id:string) => <option key={id} value={id}>{t[`placeType.${id}`]}</option>;
 return <div className="flex items-end gap-sm"><label className="min-w-0 flex-1 space-y-xs"><span className="block text-meta font-semibold uppercase text-muted">{t.category}</span><Select value={value} disabled={disabled} onChange={event=>{onChange(event.target.value);setQuery('');}}><option value="all">{t.all}</option>{suggestions.length>0&&<optgroup label={t.categoryRecommended}>{suggestions.map(option)}</optgroup>}{groups.map(group=><optgroup key={group.id} label={t[`placeGroup.${group.id}`]}>{group.types.map(option)}</optgroup>)}{!suggestions.length&&!groups.length&&<option disabled>{t.categoryNoMatches}</option>}</Select></label><div className="w-1/3 shrink-0"><Input className="text-meta" type="search" value={query} disabled={disabled} aria-label={t.categorySearch} placeholder={t.categorySearchPlaceholder} onChange={event=>setQuery(event.target.value)}/></div></div>;
}
