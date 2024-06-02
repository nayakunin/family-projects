const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
    },
    extends: ['eslint:recommended', 'prettier', 'eslint-config-turbo'],
    plugins: ['only-warn', 'simple-import-sort', 'import'],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
    },
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
        'dist/',
    ],
    overrides: [
        {
            files: ['*.js?(x)', '*.ts?(x)'],
        },
    ],
    rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'turbo/no-undeclared-env-vars': 'off',
    },
};
