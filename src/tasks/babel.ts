import { TaskArgs } from '.'

import { writeToRoot } from 'utils/fs'

const babel = ({ devDeps, libs }: TaskArgs) => {
	const { useTs } = libs
	devDeps.push(
		'@babel/cli',
		'@babel/core',
		'@babel/preset-env',
		'@babel/preset-react'
	)
	if (useTs) {
		devDeps.push('@babel/preset-typescript')
	}

	writeToRoot(
		'.babelrc.js',
		`
			const isTest = String(process.env.NODE_ENV) === 'test'

			module.exports = {
				presets: [
					[
						'@babel/preset-env',
						{
							modules: isTest ? 'commonjs' : false,
							targets: {
								node: '16'
							}
						}
					],
					'@babel/preset-react',
					'@babel/preset-typescript'
				]
			}
	`
	)
}

babel.displayName = 'babel'
export default babel
