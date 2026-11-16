import ts from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
export default ts.config(
 { ignores: ['.data/**', '**/node_modules/**', '**/.next/**', '**/.next-test/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/storybook-static/**', '.github/**', '.agents/**', '.stitch/**', '**/next-env.d.ts', 'playwright-report/**', 'test-results/**'] },
 ...ts.configs.recommended,
 { files: ['**/*.{ts,tsx}'], rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }], '@typescript-eslint/no-explicit-any': 'error' } },
 { files: ['**/domain/**/*.{ts,tsx}'], rules: { 'no-restricted-imports': ['error', { patterns: ['**/application/**','**/infra/**','react','next','next/*','firebase*','zod','fastify'] }] } },
 { files: ['**/application/**/*.{ts,tsx}'], rules: { 'no-restricted-imports': ['error', { patterns: ['**/infra/**','**/components/**','react','next','next/*','firebase*','zod','fastify'] }] } },
 { files: ['apps/*/src/components/**/*.{ts,tsx}','apps/*/src/app/**/*.{ts,tsx}'], rules: { 'no-restricted-imports': ['error', { patterns: ['**/infra/**','**/application/**','firebase*','firebase/*'] }] } },
 { files: ['**/*.tsx'], plugins: { 'react-hooks': hooks }, rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'warn' } },
 { files: ['**/*.test.*','**/tests/**','tests/**','**/*.config.*','**/*.stories.*'], rules: { 'no-restricted-imports': 'off' } },
 { files: ['**/*.cjs'], languageOptions: { sourceType: 'commonjs' }, rules: { '@typescript-eslint/no-require-imports': 'off' } },
);
