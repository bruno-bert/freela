import {it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {CategorySelect} from './category-select';
import {t} from '../../../storybook/fixtures';
import {googlePlaceTypes} from '@core/domain/place-types';
it('offers the complete grouped catalog without an ambiguous search input',()=>{const change=vi.fn(),{rerender}=render(<CategorySelect value="all" copy={t} disabled={false} onChange={change}/>);expect(screen.getAllByRole('option')).toHaveLength(googlePlaceTypes.length+1);expect(screen.getByRole('group',{name:t.categoryRecommended})).toContainElement(screen.getByRole('option',{name:'Clínica médica'}));expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();fireEvent.change(screen.getByRole('combobox'),{target:{value:'veterinary_care'}});expect(change).toHaveBeenCalledWith('veterinary_care');rerender(<CategorySelect value="veterinary_care" copy={t} disabled={true} onChange={change}/>);expect(screen.getByRole('combobox')).toBeDisabled();});
