module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    extends: ['plugin:vue/essential', '@vue/prettier', 'eslint:recommended'],
    plugins: ['vue', 'prettier'],
    rules: {
        'prettier/prettier': [
            'off',
            {
                htmlWhitespaceSensitivity: 'ignore',
            },
        ],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-useless-escape': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
