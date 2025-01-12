// @ts-check

import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import html from '@html-eslint/eslint-plugin';

export default tseslint.config(
  // Global ignores
  // https://eslint.org/docs/latest/use/configure/ignore#ignoring-files
  {
    ignores: [
      // compiled project
      'dist/*',
      // static assets folder
      'public/*',
    ],
  },
  html.configs['flat/recommended'],
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Sort imports
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Module imports
            ['^[a-z]', '^@'],
            // Folder aliases
            ['^@helpers', '^@scenes', '^@shaders'],
            // Folder imports (starting with `../` or `./`)
            [
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
            // Style imports
            ['^.+\\.s?css$'],
            // Side effect imports
            ['^\\u0000'],
          ],
        },
      ],

      // Disable the `any` police and allow the creation of more advanced types.
      '@typescript-eslint/no-explicit-any': 'off',

      // Warn about unused variables (ignore middle vars)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', args: 'after-used' },
      ],

      // Allow `self` as a `this` alias
      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowedNames: ['self'],
        },
      ],
    },
  }
);
