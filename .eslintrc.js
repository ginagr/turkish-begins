module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  globals: {
    React: true,
    JSX: true,
    document: true,
  },
  rules: {
    'accessor-pairs': [
      'error',
    ],
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'block-spacing': [
      'error',
      'always',
    ],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    camelcase: [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: false,
        ignoreImports: false,
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': [
      'error',
      'last',
    ],
    'computed-property-spacing': [
      'error',
      'never',
    ],
    'constructor-super': 'error',
    curly: [
      'error',
      'multi-line',
    ],
    'dot-location': [
      'error',
      'property',
    ],
    'dot-notation': 'off',
    'eol-last': 'error',
    eqeqeq: [
      'off',
      'always',
    ],
    'func-call-spacing': [
      'error',
      'never',
    ],
    'generator-star-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'handle-callback-err': [
      'error',
      '^(err|error)$',
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: [
          'TemplateLiteral *',
        ],
      },
    ],
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'lines-between-class-members': ['off'],
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: false,
        properties: true,
      },
    ],
    'new-parens': 'error',
    'no-array-constructor': [
      'error',
    ],
    'no-async-promise-executor': [
      'error',
    ],
    'no-caller': 'error',
    'no-case-declarations': [
      'error',
    ],
    'no-class-assign': [
      'error',
    ],
    'no-compare-neg-zero': [
      'error',
    ],
    'no-cond-assign': 'error',
    'no-const-assign': [
      'error',
    ],
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    'no-control-regex': [
      'error',
    ],
    'no-debugger': 'error',
    'no-delete-var': [
      'error',
    ],
    'no-dupe-args': [
      'error',
    ],
    'no-dupe-class-members': [
      'error',
    ],
    'no-dupe-keys': [
      'error',
    ],
    'no-duplicate-case': [
      'error',
    ],
    'no-empty-character-class': [
      'error',
    ],
    'no-empty-pattern': [
      'error',
    ],
    'no-eval': 'error',
    'no-ex-assign': [
      'error',
    ],
    'no-extend-native': [
      'error',
    ],
    'no-extra-bind': [
      'error',
    ],
    'no-extra-boolean-cast': [
      'error',
    ],
    'no-extra-parens': [
      'error',
      'functions',
    ],
    'no-fallthrough': 'error',
    'no-floating-decimal': [
      'error',
    ],
    'no-func-assign': [
      'error',
    ],
    'no-global-assign': [
      'error',
    ],
    'no-implied-eval': [
      'error',
    ],
    'no-inner-declarations': [
      'error',
      'functions',
    ],
    'no-invalid-regexp': [
      'error',
    ],
    'no-irregular-whitespace': [
      'error',
    ],
    'no-iterator': [
      'error',
    ],
    'no-labels': [
      'error',
      {
        allowLoop: false,
        allowSwitch: false,
      },
    ],
    'no-lone-blocks': [
      'error',
    ],
    'no-misleading-character-class': [
      'error',
    ],
    'no-prototype-builtins': [
      'error',
    ],
    'no-useless-catch': [
      'error',
    ],
    'no-mixed-operators': [
      'error',
      {
        groups: [
          [
            '==',
            '!=',
            '===',
            '!==',
            '>',
            '>=',
            '<',
            '<=',
          ],
          [
            '&&',
            '||',
          ],
          [
            'in',
            'instanceof',
          ],
        ],
        allowSamePrecedence: true,
      },
    ],
    'no-mixed-spaces-and-tabs': [
      'error',
    ],
    'no-multi-spaces': [
      'error',
    ],
    'no-multi-str': [
      'error',
    ],
    'multiline-ternary': ['off'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'no-negated-in-lhs': [
      'error',
    ],
    'no-new': [
      'error',
    ],
    'no-new-func': [
      'error',
    ],
    'no-new-object': [
      'error',
    ],
    'no-new-require': [
      'error',
    ],
    'no-new-symbol': [
      'error',
    ],
    'no-new-wrappers': 'error',
    'no-obj-calls': [
      'error',
    ],
    'no-octal': [
      'error',
    ],
    'no-octal-escape': [
      'error',
    ],
    'no-path-concat': [
      'error',
    ],
    'no-proto': [
      'error',
    ],
    'no-redeclare': [
      'error',
      {
        builtinGlobals: false,
      },
    ],
    'no-regex-spaces': [
      'error',
    ],
    'no-return-assign': [
      'error',
      'except-parens',
    ],
    'no-self-assign': [
      'error',
      {
        props: true,
      },
    ],
    'no-self-compare': [
      'error',
    ],
    'no-sequences': [
      'error',
    ],
    'no-shadow-restricted-names': [
      'error',
    ],
    'no-sparse-arrays': [
      'error',
    ],
    'no-tabs': [
      'error',
    ],
    'no-template-curly-in-string': [
      'error',
    ],
    'no-this-before-super': [
      'error',
    ],
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef': [
      'error',
    ],
    'no-undef-init': 'error',
    'no-unexpected-multiline': [
      'error',
    ],
    'no-unmodified-loop-condition': [
      'error',
    ],
    'no-unneeded-ternary': [
      'error',
      {
        defaultAssignment: false,
      },
    ],
    'no-unreachable': [
      'error',
    ],
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': [
      'error',
    ],
    'no-unused-expressions': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    'no-useless-call': [
      'error',
    ],
    'no-useless-computed-key': [
      'error',
    ],
    'no-useless-constructor': [
      'off',
    ],
    'no-useless-escape': [
      'error',
    ],
    'no-useless-rename': [
      'error',
    ],
    'no-useless-return': [
      'error',
    ],
    'no-whitespace-before-property': [
      'error',
    ],
    'no-with': [
      'error',
    ],
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        consistent: true,
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'object-property-newline': [
      'error',
      {
        allowMultiplePropertiesPerLine: true,
        allowAllPropertiesOnSameLine: false,
      },
    ],
    'one-var': [
      'error',
      'never',
    ],
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
          '|>': 'before',
        },
      },
    ],
    'padded-blocks': [
      'error',
      {
        blocks: 'never',
        switches: 'never',
        classes: 'never',
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: false,
      },
    ],
    'prefer-promise-reject-errors': [
      'error',
    ],
    'quote-props': [
      'error',
      'as-needed',
    ],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: false,
      },
    ],
    'rest-spread-spacing': [
      'error',
      'never',
    ],
    semi: [
      'error',
      'always',
    ],
    'semi-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'space-before-blocks': [
      'error',
      'always',
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        asyncArrow: 'always',
        named: 'never',
      },
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
    'space-infix-ops': [
      'error',
    ],
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false,
      },
    ],
    'spaced-comment': 'error',
    'symbol-description': [
      'error',
    ],
    'template-curly-spacing': [
      'error',
      'never',
    ],
    'template-tag-spacing': [
      'error',
      'never',
    ],
    'unicode-bom': [
      'error',
      'never',
    ],
    'use-isnan': 'error',
    'valid-typeof': 'off',
    'wrap-iife': [
      'error',
      'any',
      {
        functionPrototypeMethods: true,
      },
    ],
    'yield-star-spacing': [
      'error',
      'both',
    ],
    yoda: [
      'error',
      'never',
    ],
    'import/export': [
      'error',
    ],
    'import/first': [
      'error',
    ],
    'import/no-absolute-path': [
      'error',
      {
        esmodule: true,
        commonjs: true,
        amd: false,
      },
    ],
    'import/no-duplicates': [
      'error',
    ],
    'import/no-named-default': [
      'error',
    ],
    'import/no-webpack-loader-syntax': [
      'error',
    ],
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'comma',
          requireLast: true,
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      {
        allowArgumentsExplicitlyTypedAsAny: true,
      },
    ],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
    ],
    '@typescript-eslint/semi': [
      'error',
      'always',
    ],
    '@typescript-eslint/unified-signatures': 'error',
    'arrow-body-style': 'error',
    complexity: 'off',
    'guard-for-in': 'error',
    'id-blacklist': 'off',
    'id-match': 'off',
    'import/no-deprecated': 'warn',
    'max-classes-per-file': [
      'error',
      3,
    ],
    'max-len': [
      'error',
      {
        code: 160,
      },
    ],
    'no-bitwise': 'error',
    'no-console': 1,
    'no-empty': 'off',
    'no-invalid-this': 'off',
    'no-restricted-imports': [
      'error',
      'rxjs/Rx',
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-underscore-dangle': 'off',
    'no-unused-labels': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    radix: 'error',
    '@typescript-eslint/await-thenable': [
      'error',
    ],
    '@typescript-eslint/no-for-in-array': [
      'error',
    ],
    '@typescript-eslint/no-misused-promises': [
      'warn',
    ],
    '@typescript-eslint/no-unnecessary-type-assertion': [
      'error',
    ],
    '@typescript-eslint/prefer-includes': [
      'error',
    ],
    '@typescript-eslint/prefer-regexp-exec': [
      'error',
    ],
    '@typescript-eslint/prefer-string-starts-ends-with': [
      'error',
    ],
    'require-await': [
      'off',
    ],
    '@typescript-eslint/require-await': [
      'error',
    ],
    '@typescript-eslint/unbound-method': [
      'error',
      {
        ignoreStatic: true,
      },
    ],
    'no-var': [
      'error',
    ],
    'prefer-rest-params': [
      'error',
    ],
    'prefer-spread': [
      'error',
    ],
    '@typescript-eslint/adjacent-overload-signatures': [
      'error',
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
    ],
    '@typescript-eslint/ban-types': [
      'error',
    ],
    '@typescript-eslint/consistent-type-assertions': [
      'error',
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
    ],
    '@typescript-eslint/no-array-constructor': [
      'error',
    ],
    'no-empty-function': [
      'off',
    ],
    '@typescript-eslint/no-empty-interface': [
      'error',
    ],
    '@typescript-eslint/no-inferrable-types': [
      'error',
    ],
    '@typescript-eslint/no-misused-new': [
      'error',
    ],
    '@typescript-eslint/no-namespace': [
      'error',
    ],
    '@typescript-eslint/no-this-alias': [
      'error',
    ],
    '@typescript-eslint/no-var-requires': [
      'error',
    ],
    '@typescript-eslint/prefer-namespace-keyword': [
      'error',
    ],
    '@typescript-eslint/triple-slash-reference': [
      'error',
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'import/no-unresolved': 0,
  },
};
