vi.mock('../lib/client/auth',()=>({createBrowserAuth:()=>({signIn:async()=> 'google-id-token'})}));
import { it,expect,vi } from 'vitest';
import { render,screen,fireEvent } from '@testing-library/react';
import { LoginForm } from './login-form';
import t from '../../content/en/workspace.json';
it('presents the local and Google sign-in flows and handles failures',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error()));const {rerender}=render(<LoginForm copy={t} provider="local" firebase={null} returnTo="/"/>);fireEvent.click(screen.getByRole('button',{name:t.demoLogin}));expect(await screen.findByRole('alert')).toHaveTextContent(t.loginError);rerender(<LoginForm copy={t} provider="firebase-auth" firebase={{}} returnTo="/"/>);expect(screen.getByRole('button',{name:t.googleLogin})).toBeVisible();vi.unstubAllGlobals();});

it('exchanges a Google token and navigates after either successful sign-in',async()=>{const navigate=vi.fn();vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({ok:true})));const {unmount}=render(<LoginForm copy={t} provider="local" firebase={null} returnTo="/" onNavigate={navigate}/>);fireEvent.click(screen.getByRole('button',{name:t.demoLogin}));await vi.waitFor(()=>expect(navigate).toHaveBeenCalledWith('/'));unmount();render(<LoginForm copy={t} provider="firebase-auth" firebase={{}} returnTo="/" onNavigate={navigate}/>);fireEvent.click(screen.getByRole('button',{name:t.googleLogin}));await vi.waitFor(()=>expect(navigate).toHaveBeenCalledTimes(2));vi.unstubAllGlobals();});

it('keeps a failed response on the sign-in page',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('',{status:401})));render(<LoginForm copy={t} provider="local" firebase={null} returnTo="/"/>);fireEvent.click(screen.getByRole('button',{name:t.demoLogin}));expect(await screen.findByRole('alert')).toHaveTextContent(t.loginError);vi.unstubAllGlobals();});
