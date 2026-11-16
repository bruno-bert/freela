import { it,expect } from 'vitest';
import {render,screen} from '@testing-library/react';
import {Documentation} from './documentation';
it('renders CMS sections and a generated changelog',()=>{const {rerender}=render(<Documentation content={{title:'Guide',overview:'Explore opportunities'}} changelog=""/>);expect(screen.getByText('Explore opportunities')).toBeVisible();rerender(<Documentation content={{title:'Guide'}} changelog="Unreleased"/>);expect(screen.getByText('Unreleased')).toBeVisible();});
