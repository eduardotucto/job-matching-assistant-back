import neostandard from 'neostandard'

export default [
  ...neostandard({
    ts: true,
    env: ['node'],
    filesTs: ['**/*.ts'],
    ignores: ['dist', 'node_modules'],
  }),

  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
    },
  },
]
