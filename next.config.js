const { withPlugins } = require('next-compose-plugins')
// const withReactSvg = require('next-react-svg')
const { resolve } = require('path')
const { mergeDeepRight } = require('ramda')
// // const { PHASE_PRODUCTION_BUILD } = require('next/constants')
// const dotenvLoad = require('dotenv-load')
// const nextEnv = require('next-env')

// const { NODE_ENV } = process.env
// const withNextEnv = nextEnv()

// if (NODE_ENV === 'production') {
//   dotenvLoad('production')
// } else {
//   dotenvLoad()
// }

// dotenvLoad('default')

// const nextConfig = {
//   [PHASE_PRODUCTION_BUILD]: { target: 'serverless' },
// }

const buildWebpackConfig = (nextConfig, webpackConfig, webpackOptions) => {
  return typeof nextConfig.webpack === 'function'
    ? nextConfig.webpack(webpackConfig, webpackOptions)
    : webpackConfig
}

const withCustomAliases = alias => nextConfig => ({
  ...nextConfig,
  webpack(previousWebpackConfig, webpackOptions) {
    const webpackConfig = mergeDeepRight(previousWebpackConfig, {
      resolve: {
        alias,
      },
    })

    return buildWebpackConfig(nextConfig, webpackConfig, webpackOptions)
  },
})

module.exports = withPlugins([
  withCustomAliases({
    '~': resolve('src'),
    '@types': resolve('types'),
  }),
])
