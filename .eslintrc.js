module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    'no-var': 'error',
    'prefer-const': 'error'
  }
};
