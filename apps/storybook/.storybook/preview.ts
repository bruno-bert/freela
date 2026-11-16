import type { Preview } from '@storybook/nextjs-vite';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '../../web/src/app/globals.css';
const preview: Preview = { parameters: { layout: 'padded', a11y: { test: 'error' } }, tags: ['autodocs'] };
export default preview;
