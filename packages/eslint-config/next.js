const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
    },
    extends: [
        'eslint:recommended',
        'prettier',
        require.resolve('@vercel/style-guide/eslint/next'),
        'eslint-config-turbo',
    ],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
        browser: true,
    },
    plugins: ['only-warn', 'simple-import-sort', 'import'],
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        '.*.js',
        'node_modules/',
    ],
    overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
    rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
    },
};
