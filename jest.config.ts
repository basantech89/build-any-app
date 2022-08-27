import { Config } from '@jest/types'

const path = require('path')

const config: Config.InitialOptions = {
	moduleDirectories: ['node_modules', path.join(__dirname, '/src'), 'utils'],
	collectCoverageFrom: ['**/src/**/*.ts'],
	coverageThreshold: {
		global: {
			statements: 55,
			branches: 25,
			functions: 80,
			lines: 55,
		},
	},
}

module.exports = config
