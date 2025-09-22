import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
        // Custom globals from globals.js
        ApiError: 'readonly',
        DB: 'readonly',
        asyncHandler: 'readonly',
        createLogger: 'readonly',
        _ServerLog: 'readonly',
        _DatabaseLog: 'readonly',
        _AuthLog: 'readonly',
        _ChatLog: 'readonly',
        _LLMLog: 'readonly',
        _KafkaLog: 'readonly',
        _ErrorLog: 'readonly',
        _io: 'writable',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],
      'no-undef': 'error', // Detects undefined variables
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '*.min.js', '*.md'],
  },
];
