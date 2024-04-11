module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    requireConfigFile: false,
  },
  extends: ['eslint:recommended'],
  plugins: ['simple-import-sort'],
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

          [
            '^@atoms',
            '^@errors',
            '^@geometries',
            '^@helpers',
            '^@loaders',
            '^@materials',
            '^@scenes',
            '^@shaders',
            '^@state',
            '^@styles',
            '^@utils',
          ],
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
  },
  overrides: [
    {
      files: ['**/*.[c]js'],
      parser: '@babel/eslint-parser',
      rules: {
        // Warn about unused variables
        'no-unused-vars': 'warn',
      },
    },
    {
      files: ['**/*.{ts,tsx}', '**/*.d.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        // Probably not the best practice
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              // Allow using {}, instead of e.g., Record<string, unknown>
              '{}': false,
            },
          },
        ],

        // Disable this rule and specify only input contracts
        // Alternatively, require return types on functions only where useful
        '@typescript-eslint/explicit-function-return-type': [
          'off', // warn
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],

        // Disable the `any` police and allow the creation of more advanced types.
        '@typescript-eslint/no-explicit-any': 'off',

        // Warn about unused variables (ignore middle vars)
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', args: 'after-used' },
        ],

        '@typescript-eslint/no-this-alias': [
          'error',
          {
            allowedNames: ['self'],
          },
        ],
      },
    },
  ],
};
