import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    files: ['**/*.js'], // всі JS-файли в проекті
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node, // додає Node.js глобали (console, process, Buffer)
      },
    },
    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': ['error', { args: 'none' }],
      'no-undef': 'error',
      'no-console': 'off',
      caughtErrorsIgnorePattern: '^_',
    },
  },
];
