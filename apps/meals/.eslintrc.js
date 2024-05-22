/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next.js'],
  overrides: [
      {
          files: ['*.ts', '*.tsx'],
          parser: '@typescript-eslint/parser',
          parserOptions: {
              project: true,
          },
      },
  ],
};
