module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'wp.element.createElement',
        pragmaFrag: 'wp.element.Fragment',
      },
    ],
  ],
};
