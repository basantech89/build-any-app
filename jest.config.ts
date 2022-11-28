import { Config } from '@jest/types'

const path = require('path')

const config: Config.InitialOptions = {
	testEnvironment: 'jest-environment-node',
	moduleDirectories: [
		'node_modules',
		path.join(__dirname, 'src'),
		'utils',
		'utils/prompts',
	],
	modulePathIgnorePatterns: ['dist'],
	setupFilesAfterEnv: ['<rootDir>/src/mocks/index.ts'],
	collectCoverageFrom: ['**/src/**/*.ts'],
	coverageThreshold: {
		global: {
			statements: 20,
			branches: 5,
			functions: 10,
			lines: 20,
		},
	},
}

module.exports = config
