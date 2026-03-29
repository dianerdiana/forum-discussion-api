import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import daStyle from 'eslint-config-dicodingacademy';
import vitest from '@vitest/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

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
        ...vitest.environments.env.globals,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-unused-vars': 'off',

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

            ['^./application'],
            ['^./common'],
            ['^./domain'],
            ['^./infrastructure'],
            ['^./interface'],

            ['^../../application'],
            ['^../../common'],
            ['^../../domain'],
            ['^../../infrastructure'],
            ['^../../interface'],

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

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
]);
