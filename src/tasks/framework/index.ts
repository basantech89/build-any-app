import { TaskArgs } from '..'

import setupAbstractions from './abstractions'
import createStaticContent from './static-content'

import { readJsonFromRoot, writeObjToRoot, writeToRoot } from 'utils/fs'

const framework = ({ deps, devDeps, libs }: TaskArgs) => {
	const {
		useTs,
		useEslint,
		usePrettier,
		useJest,
		useCommitizen,
		useHusky,
		framework,
		uiLib,
		globalStateLib,
	} = libs

	if (framework === 'react') {
		deps.push(
			'react',
			'react-dom',
			'react-router-dom',
			'react-hook-form',
			'@hookform/resolvers',
			'yup',
			'classnames',
			'recoil'
		)

		if (useTs) {
			devDeps.push(
				'@types/react',
				'@types/react-dom',
				'@types/react-router-dom'
			)
		}

		readJsonFromRoot('package.json').then(pkgJson => {
			const rewireReactApp = uiLib === 'react-bootstrap'
			devDeps.push('react-scripts', 'sort-package-json', 'npm-run-all')

			let script = 'react-scripts'
			if (rewireReactApp) {
				// react-app-rewired used to use webpack's lazyStyleTag feature to import theme styles lazily
				script = 'react-app-rewired' // see config.overrides.js below
				devDeps.push(script)

				// to import theme styles.lazy.scss with a named variable in header module
				writeToRoot('src/declaration.d.ts', `declare module '*.scss'`)
				writeToRoot(
					'config-overrides.js',
					`
						${useEslint ? '// eslint-disable-next-line no-undef' : ''}
						module.exports = function override(config) {
							const loaders = config.module.rules[1].oneOf
							loaders.splice(
								7,
								1,
								{
									test: /\\.scss$/i,
									exclude: /\\.lazy\\.scss$/i,
									use: ['style-loader', 'css-loader', 'sass-loader']
								},
								{
									test: /\\.lazy\\.scss$/i,
									use: [
										{ loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
										'css-loader',
										'sass-loader'
									]
								}
							)

							return config
						}
					`
				)
			}

			pkgJson.scripts = {
				...pkgJson.scripts,
				start: `${script} start`,
				build: `${script} build`,
				eject: `${script} eject`,
				validate: `npm-run-all --parallel test:coverage ${
					useTs ? 'check-types' : ''
				} check-format`,
			}

			if (useCommitizen) {
				pkgJson.scripts.commit = 'git-cz'
				pkgJson.config = { commitizen: { path: './node_modules/cz-git' } }
			}

			if (global.publishPackage) {
				pkgJson.scripts['semantic-release'] = 'semantic-release'
				pkgJson.publishConfig = {
					access: global.privatePackage ? 'private' : 'public',
				}
			}

			if (useJest) {
				pkgJson.scripts['test:coverage'] = 'jest --coverage'
				pkgJson.scripts['test:watch'] = 'jest --watch'
				pkgJson.scripts.test = 'is-ci-cli test:coverage test:watch'
				pkgJson.scripts['test:debug'] =
					'node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --watch'
			}

			if (useTs) {
				pkgJson.scripts['check-types'] = 'tsc'
			}

			if (useEslint) {
				pkgJson.scripts.lint = `jest --config src/test-utils/jest.lint.${
					useTs ? 't' : 'j'
				}s`
				pkgJson.scripts['lint:fix'] = 'eslint --ext js,jsx,ts,tsx --fix .'
			}

			if (usePrettier) {
				pkgJson.scripts.prettier =
					'prettier --ignore-path .gitignore "**/*.+(js|jsx|ts|tsx)"'
				pkgJson.scripts.format = 'npm run prettier -- --write'
				pkgJson.scripts['check-format'] = 'npm run prettier -- --list-different'
			}

			pkgJson.browserslist = {
				production: ['>0.2%', 'not dead', 'not op_mini all'],
				development: [
					'last 1 chrome version',
					'last 1 firefox version',
					'last 1 safari version',
				],
			}

			if (global.user.name) {
				pkgJson.author = global.user.name
			}

			if (global.user.description) {
				pkgJson.description = global.user.description
			}

			if (global.license) {
				pkgJson.license = global.license.name
			}

			pkgJson.private = Boolean(global?.privatePackage)

			writeObjToRoot('package.json', pkgJson)
		})
	}

	writeToRoot(
		'src/atoms/toasts.ts',
		`
			import { atom } from 'recoil'

			declare interface Toast {
				bg: string
				msg: string
			}

			const toastState = atom<Toast[]>({
				key: 'toasts', // unique ID (with respect to other atoms/selectors)
				default: [] // default value (aka initial value)
			})

			export default toastState
		`
	)

	// to identify [s]css types
	writeToRoot(
		'src/react-app-env.d.ts',
		`
			/// <reference types="react-scripts" />
		`
	)

	const content = createStaticContent(
		useTs,
		useCommitizen,
		useJest,
		useEslint,
		usePrettier,
		useHusky,
		uiLib
	)
	content.public().gitignore().env().readme().license()

	const abstractions = setupAbstractions(useJest, globalStateLib)
	abstractions
		.routes()
		.utils(globalStateLib)
		.constants()
		.state(deps, globalStateLib)
}

framework.displayName = 'framework'
export default framework
