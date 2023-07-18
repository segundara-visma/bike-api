module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "ignorePatterns": [
        "node_modules",
        "public",
        "dist"
    ],
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "requireConfigFile": false,
        "babelOptions": {
          "plugins": [
            '@babel/plugin-syntax-import-assertions'
          ],
        },
        "sourceType": "module",
        "ecmaVersion": 13
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "no-empty": [
            "error"
        ],
        "camelcase": ["error", {
            "properties": "always",
            "ignoreDestructuring": false
        }],
        "comma-dangle": ["error", "never"],
        "no-multiple-empty-lines": ["error", {
            "max": 2
        }],
        "no-var": ["warn"],
        "eol-last": ["error"],
        "no-unused-vars": ["error"],
        "no-trailing-spaces": ["error"],
        "no-use-before-define": ["error"],
        "prefer-const": ["error"],
        "func-call-spacing": ["error", "never"],
        "space-before-function-paren": ["error", "always"],
        "semi": ["error", "never"]
    }
}
