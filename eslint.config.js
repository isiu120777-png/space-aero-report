// eslint.config.js - ESLint Flat Config
module.exports = [
  {
    ignores: [
      'node_modules/**',
      'hwpx_extracted/**',
      'assets/**'
    ]
  },
  {
    files: ['server.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'semi': ['error', 'always']
    }
  },
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        THREE: 'readonly',
        anime: 'readonly',
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'semi': ['error', 'always']
    }
  }
];
