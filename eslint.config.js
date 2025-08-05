import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: { parser, globals: globals.browser },
    plugins: { '@typescript-eslint': ts, react },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    files: ['public/sw.js'],
    languageOptions: { globals: globals.serviceworker }
  }
];
