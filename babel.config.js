module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'wp.element.createElement',
        pragmaFrag: 'wp.element.Fragment',
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
};
