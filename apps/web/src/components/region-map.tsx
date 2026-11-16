"use client";
import { useEffect, useRef, useState } from 'react';
import type { Region, Company, Copy } from '@core/domain/model';
import { validRegion } from '@core/domain/region';
import type { MapHandle } from '../domain/ports/maps/map.port';
import { createMap } from '../lib/client/maps';
import { regionPresets } from '../domain/value-objects/opportunities/region-presets';
import { Button, Icon } from '@design-system';
export function RegionMap({ region, companies, onSelect, onCompany, copy: t, provider, apiKey }: { region: Region; companies: Company[]; onSelect(region: Region): void; onCompany(company: Company): void; copy: Copy; provider: string; apiKey: string }) {
 const ref = useRef<HTMLDivElement>(null), handle = useRef<MapHandle | null>(null), callback = useRef(onSelect);
 const latest = useRef({region,companies}); latest.current={region,companies};
 const [error, setError] = useState(false), [zoom, setZoom] = useState(1);
 callback.current = onSelect;
 useEffect(() => { if (provider !== 'google' || !ref.current) return; let disposed = false; createMap(provider, apiKey).mount(ref.current, region, next => callback.current(next)).then(value => { if (disposed) value.destroy(); else { handle.current = value; if(validRegion(latest.current.region))value.update(latest.current.region, latest.current.companies); } }).catch(() => setError(true)); return () => { disposed = true; handle.current?.destroy(); handle.current = null; }; /* Initial center is applied once; subsequent updates use the map handle. */
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [provider, apiKey]);
 useEffect(() => { if(validRegion(region))handle.current?.update(region, companies); }, [region, companies]);
 if (provider === 'google') return <div className="relative h-full min-h-map"><div ref={ref} className="absolute inset-0" aria-label={t.region}/>{error && <p role="alert" className="absolute inset-x-0 top-0 bg-danger-soft p-lg text-danger">{t.mapError}</p>}</div>;
 const span = 0.055 / zoom;
 return <div className="relative h-full min-h-map overflow-hidden bg-map-land">
 <svg role="group" tabIndex={0} aria-label={t.selectMap} viewBox="0 0 700 700" className="h-full min-h-map w-full cursor-crosshair" onClick={event => { const rect = event.currentTarget.getBoundingClientRect(); onSelect({ ...region, latitude: region.latitude + (0.5 - (event.clientY - rect.top) / rect.height) * span, longitude: region.longitude + ((event.clientX - rect.left) / rect.width - 0.5) * span }); }} onKeyDown={event => { const directions: Record<string, [number, number]> = { ArrowUp: [0.001, 0], ArrowDown: [-0.001, 0], ArrowLeft: [0, -0.001], ArrowRight: [0, 0.001] }; const move = directions[event.key]; if (move) { event.preventDefault(); onSelect({ ...region, latitude: region.latitude + move[0], longitude: region.longitude + move[1] }); } }}>
 <path d="M0 70 Q130 90 120 230T0 390Z" className="fill-map-park"/>
 <g className="stroke-map-road" strokeWidth="7">{[80,180,280,400,520,620].map(x => <path key={x} d={`M${x} 0 ${x + 110} 700 M0 ${x} 700 ${x - 80}`}/>)}</g>
 <path d="M160 0 580 700" className="stroke-warning/30" strokeWidth="12"/>
 <g className="fill-muted text-meta"><text x="60" y="100">{t.mapSchematic}</text><text x="60" y="150">{regionPresets.find(p=>Math.abs(p.region.latitude-region.latitude)<0.00001&&Math.abs(p.region.longitude-region.longitude)<0.00001)?.name??t.regionCustom}</text><text x="60" y="200">{region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}</text></g>
 <circle cx="350" cy="350" r={Math.min(290, Math.max(30, region.radius / (span * 111000) * 700))} className="fill-primary/10 stroke-primary" strokeWidth="2" strokeDasharray="6 4"/>
 <circle cx="350" cy="350" r="5" className="fill-primary"/>
 {companies.map((company, index) => { const x = 350 + (company.location.longitude - region.longitude) / span * 700, y = 350 - (company.location.latitude - region.latitude) / span * 700; return <g key={company.id} role="button" tabIndex={0} aria-label={`${index + 1}: ${t.details}: ${company.name}`} onClick={event => { event.stopPropagation(); onCompany(company); }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.stopPropagation(); onCompany(company); } }} transform={`translate(${x},${y})`} className="cursor-pointer"><path d="M0 14C-25-7-20-30 0-30S25-7 0 14Z" className="fill-primary stroke-surface" strokeWidth="3"/><text y="-7" textAnchor="middle" className="fill-surface text-body font-semibold">{index + 1}</text></g>; })}
 </svg>
 <div className="absolute bottom-md left-md rounded-control bg-surface p-sm text-meta text-muted">{t.mapDemo}</div>
 <div className="absolute bottom-md right-md flex flex-col gap-xs"><Button variant="secondary" aria-label={t.zoomIn} onClick={() => setZoom(z => Math.min(3,z + 0.25))}><Icon name="plus"/></Button><Button variant="secondary" aria-label={t.zoomOut} onClick={() => setZoom(z => Math.max(0.5,z - 0.25))}><Icon name="minus"/></Button></div>
 </div>;
}
