import {it,expect,vi} from 'vitest';
import {createBrowserAuth} from '../../../../lib/client/auth';
const fake=vi.hoisted(()=>({getApps:vi.fn().mockReturnValue([]),token:vi.fn().mockResolvedValue('id-token')}));
vi.mock('firebase/app',()=>({getApps:fake.getApps,initializeApp:vi.fn(()=>({}))}));
vi.mock('firebase/auth',()=>({getAuth:vi.fn(()=>({})),GoogleAuthProvider:class{},signInWithPopup:vi.fn(async()=>({user:{getIdToken:fake.token}})),inMemoryPersistence:{},setPersistence:vi.fn(),signOut:vi.fn()}));
it('uses in-memory browser authentication and clears the SDK after exchanging its token',async()=>{const auth=createBrowserAuth({projectId:'project'});expect(await auth.signIn()).toBe('id-token');fake.getApps.mockReturnValue([{}]);expect(await auth.signIn()).toBe('id-token');});
