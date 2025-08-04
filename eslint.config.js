 tp3y12-codex/create-voice-pause-video-pwa
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser },
    plugins: { '@typescript-eslint': ts, react },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  }
];
=======
export default [];
 main
