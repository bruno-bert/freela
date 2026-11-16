import {it,expect} from 'vitest';
import {NextRequest} from 'next/server';
import {proxy} from './proxy';
it('performs optimistic redirects while leaving actual authorization to the server',()=>{for(const path of ['/login','/api/auth/session','/api/health'])expect(proxy(new NextRequest(`http://localhost:3000${path}`)).status).toBe(200);expect(proxy(new NextRequest('http://localhost:3000/api/opportunities/search')).status).toBe(401);const response=proxy(new NextRequest('http://localhost:3000/opportunities'));expect(response.status).toBe(307);expect(response.headers.get('location')).toContain('returnTo=%2Fopportunities');expect(proxy(new NextRequest('http://localhost:3000/',{headers:{cookie:'freela-session=token'}})).status).toBe(200);});
