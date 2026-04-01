import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', '.env'],
    plugins: { vitest },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  daStyle,

  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-unused-vars': 'off',
      'linebreak-style': 'off',
      indent: 'off',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node builtin
            ['^node:'],

            // External packages
            ['^@?\\w'],

            // Internal alias
            ['^@/application'],
            ['^@/common'],
            ['^@/domain'],
            ['^@/infrastructure'],
            ['^@/interface'],
            ['^@/'],

            // Parent
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

            // Same folder
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            // Style
            ['^.+\\.?(css|scss)$'],
          ],
        },
      ],

      'simple-import-sort/exports': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...vitest.environments.env.globals,
        ...globals.vitest,
      },
    },
    plugins: { vitest },
    ...vitest.configs.recommended,
  },
]);
