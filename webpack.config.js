const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = function () {
	return {
		target: 'node14',
		mode: 'production',
		bail: true,
		devtool: false,
		stats: {
			errorDetails: true,
		},
		entry: './src/index.ts',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist'),
		},
		resolve: {
			extensions: ['.ts', '.js', '.json'],
		},
		module: {
			rules: [
				{
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
			],
		},
		optimization: {
			minimizer: [new TerserPlugin()],
		},
	}
}
