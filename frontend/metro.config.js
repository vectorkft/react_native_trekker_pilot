/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

const {
  createSentryMetroSerializer,
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },

  watchFolders: [path.resolve(__dirname, '..')],
  projectRoot: path.resolve(__dirname),

  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};
