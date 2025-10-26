module.exports = function (api) {
  api.cache(true);

  const presets = [
        ['@babel/preset-env', { targets: { node: 'current' } }]
    ];
  const plugins = [ 'babel-plugin-transform-import-meta' ];

  return {
    presets,
    plugins
  };
}