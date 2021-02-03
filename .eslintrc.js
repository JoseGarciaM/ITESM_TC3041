module.exports = {
  'env': {
    browser: true,
    es2021: true,
    node: true,
  },
  'parser': '@typescript-eslint/parser',
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'google',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  'parserOptions': {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  'plugins': ['react', 'jsdoc', '@typescript-eslint'],
  'rules': {
    '@typescript-eslint/rule-name': 0,
    'react/display-name': 0,
    'require-jsdoc': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  'overrides': [
    {
      'files': ['*.ts', '*.tsx'],
      'rules': {
        '@typescript-eslint/explicit-module-boundary-types': 0,
      },
    },
  ],
  'settings': {
    react: {
      version: 'detect',
    },
  },
};
