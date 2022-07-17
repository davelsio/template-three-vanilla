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
  overrides: [
    {
      files: ['**/*.[c]js'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        requireConfigFile: false,
      },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      plugins: ['simple-import-sort'],
      rules: {
        // Warn about unused variables
        'no-unused-vars': 'warn',

        // Override prettier/recommended to show errors as warnings
        'prettier/prettier': ['warn'],

        // Sort imports
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
      },
    },
    {
      files: ['**/*.{ts,tsx}', '**/*.d.ts'],
      parser: '@typescript-eslint/parser',
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      parserOptions: { ecmaVersion: 2019 },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      plugins: ['simple-import-sort'],
      rules: {
        // Override prettier/recommended to show errors as warnings
        'prettier/prettier': ['warn'],

        // Sort imports
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',

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

        // Require return types on functions only where useful
        // Alternatively, disable this rule and specify only input contracts
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
