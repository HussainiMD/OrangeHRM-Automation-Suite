// eslint.config.js
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // 1. Global config for all TS files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Spread (js operator) recommended rules manually (flat config doesn't support "extends")
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off', // turn off base rule (conflicts with TS version)
     '@typescript-eslint/no-unused-vars': [
        'warn',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_',
            },
      ],  
      // Forbidden imports
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              message: '@playwright/test is allowed only inside base.ts or tests.',
            },           
            { name: 'axios', message: 'Use Playwright request fixture instead.' },
          ],
        },
      ],

      // Restrict console globally
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // 2. Exception: base.ts — lift import & console restrictions
  {
    files: ['tests/base.ts', 'config/playwright.config.ts'],
    rules: {
      'no-restricted-imports': 'off',
      'no-console': 'off',
    },
  },

  // 3. Restrict fs only in spec files
{
  files: ['**/*.spec.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          // Keep the global restrictions too
          {
            name: '@playwright/test',
            message: '@playwright/test is allowed only inside base.ts or tests.',
          },
          { name: 'axios', message: 'Use Playwright request fixture instead.' },
          // Spec-specific restriction
          { name: 'fs', message: 'Do not use fs in tests. Use fixtures.' },
        ],
      },
    ],
  },
},

  // 4. Exception: test files — relax strict TS rules
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];