import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      eslint.configs.recommended,
      tsEslint.configs.recommended,
      react.configs.flat['jsx-runtime'],
    ],
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['off', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 0,
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'no-console': 'warn',
      'no-alert': 'error',
      'no-debugger': 'error',
    },
  },
  {
    ...prettier,
    rules: {
      'prettier/prettier': 'warn',
    },
  },
);
