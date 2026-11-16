import plugin from 'tailwindcss/plugin.js';
import type { Config } from 'tailwindcss';
const preset: Partial<Config> = {
 theme: { extend: {
 colors: { canvas: '#F8FAFC', surface: '#FFFFFF', ink: '#0F172A', muted: '#475569', primary: '#0F766E', 'primary-hover': '#005C55', divider: '#E2E8F0', boundary: '#64748B', focus: '#2563EB', success: '#166534', warning: '#854D0E', danger: '#B91C1C', 'primary-soft': '#F1F4F3', 'success-soft': '#F0FDF4', 'warning-soft': '#FFFBEB', 'danger-soft': '#FEF2F2', skeleton: '#E2E8F0', 'map-land': '#E9ECEF', 'map-park': '#D1E7DD', 'map-road': '#FFFFFF' },
 fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
 fontSize: { body: ['14px', '20px'], lead: ['16px', '24px'], heading: ['24px', '32px'], title: ['28px', '36px'], meta: ['12px', '18px'] },
 spacing: { sidebar: '216px', topbar: '76px', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', control: '36px', compact: '12px', scrollbar: '12px', icon: '20px', drawer: '480px', login: '420px', map: '560px' },
 borderRadius: { control: '8px', panel: '12px' }, boxShadow: { floating: '0 8px 32px rgb(15 23 42 / 0.15)' },
 gridTemplateColumns: { workspace: 'minmax(0, 45fr) minmax(0, 55fr)' }, screens: { 'workspace-tall': { raw: '(min-width: 1024px) and (min-height: 640px)' } }, height: { 'map-panel': 'clamp(240px, 40dvh, 420px)' }, minHeight: { map: '240px' },
 } },
 plugins: [plugin(({addBase,theme})=>addBase({
  html:{overflowY:'scroll',scrollbarGutter:'stable',scrollbarWidth:'auto',scrollbarColor:`${theme('colors.boundary')} ${theme('colors.canvas')}`},
  '::-webkit-scrollbar':{width:theme('spacing.scrollbar')},
  '::-webkit-scrollbar-track':{background:theme('colors.canvas')},
  '::-webkit-scrollbar-thumb':{background:theme('colors.boundary'),borderRadius:theme('borderRadius.control')},
 }))],
};
export default preset;
