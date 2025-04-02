import js from '@eslint/js';

export default [
  {
    ignores: ['dist'],
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    ...js.configs.recommended,
    rules: {},
  },
];
