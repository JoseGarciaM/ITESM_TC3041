/* eslint-disable @typescript-eslint/no-var-requires */
const runtimeCaching = require('next-pwa/cache');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const nextTranslate = require('next-translate');

module.exports = withPlugins(
    [
      [withPWA, {
        pwa: {
          dest: 'public',
          runtimeCaching,
        },
      }],
      [nextTranslate],
    ],
    {
      env: {

      },
      future: {webpack5: true},
      images: {
        domains: [

        ],
      },
      webpack: (config, {dev, isServer}) => {
        if (!dev && !isServer) {
          Object.assign(config.resolve.alias, {
            'react': 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
          });
        }

        return config;
      },
    },
);
