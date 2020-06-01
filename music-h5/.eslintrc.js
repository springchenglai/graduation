// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': [0],
    'import/no-unresolved': [0],
    'no-unused-expressions': [0],
    'no-plusplus': [0],
    'prefer-destructuring': [1],
    'consistent-return': [0],
    'no-underscore-dangle': [0],
    'no-bitwise': [0],
    'prefer-rest-params': [0],
    'comma-dangle': [0],
    'arrow-parens': [2, 'as-needed'],
    'no-param-reassign': [0],
    'func-names': [0],
    'object-curly-newline': [0],
    'operator-linebreak': [0],
    'linebreak-style': [0],
    'wrap-iife': [2, 'inside'],
    'max-len': [0],
    'no-alert': [0],
    'no-console': [0],
    'no-use-before-define': [0],
    'prefer-destructuring': [0]
  }
}
