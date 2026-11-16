import {it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {RegionPresets} from './region-presets';
import {regionPresets} from '../domain/value-objects/opportunities/region-presets';
import {t} from '../../../storybook/fixtures';
it('offers eight districts grouped by country, selects their coordinates and supports custom/disabled states',()=>{
 const onSelect=vi.fn();const {rerender}=render(<RegionPresets copy={t} selected="nyc" disabled={false} onSelect={onSelect}/>);const select=screen.getByRole('combobox',{name:t.presets});expect(screen.getAllByRole('option')).toHaveLength(9);expect(screen.getByRole('link',{name:t.districtSource})).toHaveAttribute('href',regionPresets[0].sourceUrl);
 for(const preset of regionPresets)fireEvent.change(select,{target:{value:preset.id}});expect(onSelect).toHaveBeenCalledTimes(8);expect(onSelect).toHaveBeenLastCalledWith(regionPresets.at(-1));fireEvent.change(select,{target:{value:''}});expect(onSelect).toHaveBeenCalledTimes(8);
 rerender(<RegionPresets copy={t} selected="" disabled={true} onSelect={onSelect}/>);expect(screen.queryByRole('link')).not.toBeInTheDocument();expect(screen.getByRole('combobox',{name:t.presets})).toBeDisabled();
});

it('keeps server-rendered shortcuts disabled until hydration attaches selection handlers',()=>{expect(renderToString(<RegionPresets copy={t} selected="nyc" disabled={false} onSelect={()=>{}}/>)).toContain('disabled=""');render(<RegionPresets copy={t} selected="nyc" disabled={false} onSelect={()=>{}}/>);expect(screen.getByRole('combobox',{name:t.presets})).toBeEnabled();});
