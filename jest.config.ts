import { Config } from '@jest/types'

const path = require('path')

const config: Config.InitialOptions = {
	testEnvironment: 'jest-environment-node',
	moduleDirectories: ['node_modules', path.join(__dirname, 'src'), 'utils'],
	detectOpenHandles: true,
	modulePathIgnorePatterns: ['dist'],
	setupFilesAfterEnv: ['<rootDir>/src/mocks/index.ts'],
	collectCoverageFrom: ['**/src/**/*.ts'],
	coverageThreshold: {
		global: {
			statements: 15,
			branches: 4,
			functions: 5,
			lines: 15,
		},
	},
}

module.exports = config
