// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true, // ← absolument nécessaire !
});

module.exports = withNativeWind(config, { input: './styles/global.css' });
