module.exports = {
  root: true,
  ignorePatterns: [
    // installed packages
    'node_modules/*',
    // static assets folder
    'public/*',
    // compiled project
    'dist/*',
    // unignore pattern (ignored by default)
    '!.prettierrc.js',
    '!.prettierrc.cjs',
  ],
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
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    // Override prettier/recommended to show errors as warnings
    'prettier/prettier': ['warn'],

    // Sort imports
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
        'warn', {
        groups: [
          // Module imports
          ['^[a-z]', '^@'],
          // Folder aliases
          [
            '^@controllers',
            '^@debug',
            '^@errors',
            '^@helpers',
            '^@loaders',
            '^@settings',
            '^@shaders',
            '^@state',
            '^@styles',
            '^@type-guards',
            '^@utils',
            '^@views',
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
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
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
