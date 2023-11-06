module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'deprecation'],
  rules: {
    '@typescript-eslint/no-floating-promises': ['warn'],
    '@typescript-eslint/no-unnecessary-type-assertion': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-unsafe-assignment': [0],
    '@typescript-eslint/no-unsafe-return': [0],
    '@typescript-eslint/no-unsafe-call': [0],
    '@typescript-eslint/no-unnecessary-condition': ['off'],
    '@typescript-eslint/no-unsafe-member-access': [0],
    '@typescript-eslint/restrict-template-expressions': [0],
    '@typescript-eslint/explicit-module-boundary-types': ['warn'],
    '@typescript-eslint/no-unnecessary-type-constraint': ['warn'],
    '@typescript-eslint/no-non-null-asserted-optional-chain': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    '@typescript-eslint/ban-types': ['error'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/array-type': ['error'],

    'deprecation/deprecation': ['warn'],

    'no-console': ['warn'],
    'no-warning-comments': [0],

    'react-hooks/rules-of-hooks': ['error'],
    'react-hooks/exhaustive-deps': ['warn'],
  },
};
