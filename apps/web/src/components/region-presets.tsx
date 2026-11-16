"use client";
import { useSyncExternalStore } from 'react';
import type { Copy } from '@core/domain/model';
import { Select } from '@design-system';
import { regionPresets, type RegionPreset } from '../domain/value-objects/opportunities/region-presets';
const subscribe=()=>()=>{};
const clientReady=()=>true;
const serverReady=()=>false;
export function RegionPresets({copy:t,selected,disabled,onSelect}:{copy:Copy;selected:string;disabled:boolean;onSelect(preset:RegionPreset):void}) {
 const hydrated=useSyncExternalStore(subscribe,clientReady,serverReady);
 const active=regionPresets.find(preset=>preset.id===selected);
 return <section className="space-y-sm" aria-label={t.presets}><label className="block space-y-sm"><span className="font-semibold">{t.presets}</span><Select value={selected} disabled={disabled||!hydrated} onChange={event=>{const preset=regionPresets.find(item=>item.id===event.target.value);if(preset)onSelect(preset);}}><option value="">{t.regionCustom}</option>{['US','CA','IE','NL'].map(country=><optgroup key={country} label={t[country]}>{regionPresets.filter(preset=>preset.country===country).map(preset=><option key={preset.id} value={preset.id}>{preset.name}</option>)}</optgroup>)}</Select></label><p className="text-meta text-muted">{t.presetsHint}</p>{active&&<a className="inline-block text-meta text-primary underline" href={active.sourceUrl} target="_blank" rel="noreferrer">{t.districtSource}</a>}</section>;
}
