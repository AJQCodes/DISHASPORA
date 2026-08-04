module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // worklets plugin (reanimated v4) MUST be listed last
    plugins: ['react-native-worklets/plugin'],
  };
};
