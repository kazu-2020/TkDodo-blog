module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier/vue',
    'prettier',
    'plugin:prettier/recommended',
  ],
  // ここにカスタムルールを追加します。
  rules: {
    semi: [2, 'never'],
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
        },
      },
    ],
    'prettier/prettier': ['error', { semi: false }],
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
