const path = require('path');
let BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  return {
    entry: './demo/index.tsx',
    output: {
      path: path.resolve(__dirname, 'public', 'build'),
      filename: 'scheduler.js',
      clean: true,
    },
    devtool: env.dev ? 'source-map' : false,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css'],
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/i,
          exclude: /.*node_modules.*/,
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            env.dev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
    plugins: [].concat(
      env.dev
        ? []
        : [
            new MiniCssExtractPlugin(),
            new BundleAnalyzerPlugin({
              analyzerMode: 'disabled',
              generateStatsFile: true,
              statsOptions: { source: false },
            }),
          ],
    ),
  };
};
