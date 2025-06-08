import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import hooksPlugin from 'eslint-plugin-react-hooks';
import refreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier'; // Recommended way to integrate with Prettier

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [
      'dist/',
      'eslint.config.js', // Self-ignore
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.ts', // Assuming vitest config is in vite.config.ts
      'coverage/',
      'node_modules/',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  tseslint.configs.base, // Basic TS setup
  tseslint.configs.eslintRecommended, // Overrides ESLint recommended
  ...tseslint.configs.recommended, // More specific TS rules (plugin:@typescript-eslint/recommended)
  {
    // React Hooks specific setup
    plugins: { 'react-hooks': hooksPlugin },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    // React Refresh specific setup
    plugins: { 'react-refresh': refreshPlugin },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  pluginReactConfig, // Settings for eslint-plugin-react (like version detection)
  prettierConfig, // Disables ESLint rules that conflict with Prettier. Must be last.
  {
    // Custom rules (can be merged or added here)
    rules: {
      // 'prettier/prettier': 'warn', // This rule is from eslint-plugin-prettier, not needed if prettierConfig is last.
      '@typescript-eslint/no-unused-vars': 'warn',
      // Add other specific rules from original .eslintrc.cjs if compatible
    },
  },
];
