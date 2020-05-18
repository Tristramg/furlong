module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'jsx-a11y/anchor-is-valid': [ 'error', {
      'components': [ 'Link' ],
      'specialLink': [ 'hrefLeft', 'hrefRight' ],
      'aspects': [ 'invalidHref', 'preferButton' ]
    }],
  },
};
