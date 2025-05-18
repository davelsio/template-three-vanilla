import eslint from '@eslint/js';
import html from '@html-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

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
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      /**
       * Typescript support for eslint-import-plugin
       * https://github.com/import-js/eslint-plugin-import/tree/main?tab=readme-ov-file#typescript
       * https://github.com/import-js/eslint-plugin-import/tree/main?tab=readme-ov-file#typescript
       */
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      /**
       * Custom import order rules.
       * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
       */
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@*/**',
              group: 'parent',
              position: 'before',
            },
          ],
          distinctGroup: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
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
