const config = api => {
	const isTest = api.env('test')

	return {
		ignore: isTest
			? ['dist']
			: ['src/__tests__', 'src/mocks', 'src/global.d.ts'],
		presets: [
			[
				'@babel/preset-env',
				{
					modules: isTest ? 'commonjs' : false,
					targets: {
						node: 'current',
					},
				},
			],
			'@babel/preset-typescript',
		],
		plugins: [
			[
				'module-resolver',
				{
					root: ['./src'],
					alias: {
						utils: './src/utils',
					},
				},
			],
		],
	}
}

module.exports = config
