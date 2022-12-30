const config = api => {
	const isTest = api.env('test')

	const presets = [
		[
			'@babel/preset-env',
			{
				modules: 'commonjs',
				targets: {
					node: '14',
				},
			},
		],
		'@babel/preset-typescript',
	]

	if (!isTest) {
		presets.push([
			'minify',
			{
				mangle: {
					topLevel: true,
				},
			},
		])
	}

	return {
		ignore: isTest
			? ['dist']
			: [
					'dist',
					'src/__tests__',
					'src/mocks',
					'src/global.d.ts',
					'src/enquirer.d.ts',
			  ],
		presets,
		plugins: [
			[
				require.resolve('babel-plugin-module-resolver'),
				{
					root: ['./src'],
					alias: {
						utils: './src/utils',
						tasks: './src/tasks',
					},
				},
			],
		],
	}
}

module.exports = config
