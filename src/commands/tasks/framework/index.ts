import { readJsonFromRoot, writeObjToRoot } from '../../../utils'
import { TaskArgs } from '..'

import createStaticContent from './static-content'
import setupAppStructure from './template'

const framework = ({ deps, devDeps, libs }: TaskArgs) => {
	const { useTs, useEslint, usePrettier, useJest, framework } = libs
	if (framework === 'react') {
		deps.push(
			'react',
			'react-dom',
			'react-router-dom',
			'react-hook-form',
			'@hookform/resolvers',
			'yup',
			'classnames'
		)
		devDeps.push('react-scripts')

		if (useTs) {
			devDeps.push(
				'@types/react',
				'@types/react-dom',
				'@types/react-router-dom'
			)
		}

		readJsonFromRoot('package.json').then(pkgJson => {
			pkgJson.scripts = {
				start: 'react-scripts start',
				build: 'react-scripts build',
				eject: 'react-scripts eject',
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
			}

			if (usePrettier) {
				pkgJson.scripts.prettier =
					'prettier --ignore-path .gitignore "**/*.+(js|json|ts|tsx|md)"'
				pkgJson.scripts.format = 'npm run prettier -- --write'
				pkgJson.scripts['check-format'] = 'npm run prettier -- --list-different'
			}

			writeObjToRoot('package.json', pkgJson)
		})
	}

	const content = createStaticContent()
	content.public().gitignore().env().readme()

	const structure = setupAppStructure(useJest)
	structure.routes().layouts().utils()
}

export default framework
