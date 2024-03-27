module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  rules: {
    eqeqeq: ['error', 'always'],
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: true,
      },
    ],
    'react-hooks/rules-of-hooks': 'error', // Ellenőrzi a Hook szabályokat
    'react-hooks/exhaustive-deps': 'warn', // Ellenőrzi az Effect Hook függőségeit
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}], // Figyelmen kívül hagyja az aláhúzással kezdődő változókat
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', // Figyelmeztet, ha a `any` típus használata
    'react/jsx-filename-extension': [1, {extensions: ['.tsx']}], // Csak .tsx kiterjesztés engedélyezése JSX szintaxisra
    'react/react-in-jsx-scope': 'off', // React 17 óta nem szükséges a React importálása JSX használatakor
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unused-vars': 'off', // Kikapcsolja a JavaScript változó szabályt, mivel a TypeScript változó szabálya ezt lefedi
    'prettier/prettier': 'error', // Ha használsz Prettier-t, ez biztosítja, hogy az ESLint figyelmeztessen a Prettier által észlelt problémákra
    'import/no-unresolved': 'error', // Ellenőrzi, hogy az importált modulok léteznek-e
    'import/named': 'error', // Ellenőrzi, hogy a nevesített importok léteznek-e az exportált modulokban
    'no-console': ['warn', {allow: ['warn', 'error']}], // Figyelmeztet a console.log használatára, de engedélyezi a warn és error
  },
  settings: {
    react: {
      version: 'detect', // Automatikusan észleli a telepített React verziót
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'app'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
