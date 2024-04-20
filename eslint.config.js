import { antfu } from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    quotes: 'single',
    semi: true,
  },

  rules: {
    'style/arrow-parens': ['error', 'always'],
    'curly': ['error', 'multi-or-nest', 'consistent'],
    'antfu/if-newline': 'off',
  },

  jsonc: false,
  yaml: false,
  toml: false,
  vue: true,
  typescript: true,

  ignores: ['**/*.md'],
});
