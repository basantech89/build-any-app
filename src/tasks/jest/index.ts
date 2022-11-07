import { TaskArgs } from '..'

import setupMSW from './msw'
import setupTestUtils from './test-utils'

const jestTask = ({ devDeps, libs }: TaskArgs) => {
	const { useTs, useEslint, globalStateLib } = libs
	devDeps.push(
		'jest',
		'jest-axe',
		'is-ci-cli',
		'@testing-library/jest-dom',
		'@testing-library/react',
		'@testing-library/user-event',
		'jest-environment-jsdom',
		'@jest/globals',
		'jest-watch-select-projects',
		'jest-watch-typeahead',
		'msw',
		'whatwg-fetch',
		'ts-node'
	)
	if (useTs) {
		devDeps.push('@types/jest', '@types/jest', '@types/jest-axe')
	}

	if (useEslint) {
		devDeps.push('jest-runner-eslint')
	}

	setupTestUtils(useEslint, useTs, globalStateLib)
	setupMSW()
}

export default jestTask
