import {it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {CategorySelect} from './category-select';
import {t} from '../../../storybook/fixtures';
import {googlePlaceTypes} from '@core/domain/place-types';
it('offers every direct Google filter, prioritizes requested businesses and searches localized labels or IDs',()=>{
 const change=vi.fn();const {rerender}=render(<CategorySelect value="all" copy={t} disabled={false} onChange={change}/>);
 expect(screen.getAllByRole('option')).toHaveLength(googlePlaceTypes.length+1);expect(screen.getByRole('group',{name:t.categoryRecommended})).toContainElement(screen.getByRole('option',{name:'Clínica médica'}));
 fireEvent.change(screen.getByRole('searchbox',{name:t.categorySearch}),{target:{value:'veterinary_care'}});expect(screen.getByRole('option',{name:'Clínica veterinária'})).toBeVisible();expect(screen.queryByRole('option',{name:'Eletricista'})).not.toBeInTheDocument();fireEvent.change(screen.getByRole('combobox',{name:t.category}),{target:{value:'veterinary_care'}});expect(change).toHaveBeenCalledWith('veterinary_care');expect(screen.getByRole('searchbox')).toHaveValue('');
 fireEvent.change(screen.getByRole('searchbox'),{target:{value:'clinica medica'}});expect(screen.getByRole('option',{name:'Clínica médica'})).toBeVisible();fireEvent.change(screen.getByRole('searchbox'),{target:{value:'zzzzzz'}});expect(screen.getByRole('option',{name:t.categoryNoMatches})).toBeDisabled();
 rerender(<CategorySelect value="medical_clinic" copy={t} disabled={true} onChange={change}/>);expect(screen.getByRole('combobox')).toBeDisabled();expect(screen.getByRole('searchbox')).toBeDisabled();expect(screen.getByRole('option',{name:'Clínica médica'})).toBeInTheDocument();
});
