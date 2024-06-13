module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'ci', 'build'],
    ],
    'header-max-length': [1, 'always', 120],
    'body-max-length': [0, 'always', 120],
    'body-max-line-length': [0, 'always', 120],
    'scope-enum': [
      1,
      'always',
      ['app', 'api', 'shared', 'infra', 'dev', 'release', 'deps', 'config', 'nx'],
    ],
  },
};
