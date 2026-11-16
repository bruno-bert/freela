import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as preview from './preview';
const annotations = setProjectAnnotations([preview]);
beforeAll(annotations.beforeAll);
