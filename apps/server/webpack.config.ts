import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules', './src'],
  },
  plugins: [new NodemonPlugin()],
  externals: [
    nodeExternals({
      additionalModuleDirs: ['../../node_modules'],
      allowlist: ['normalize-url'],
    }),
  ],
  externalsPresets: { node: true },
};

export default config;
