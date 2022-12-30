import { writeToRoot } from 'utils/fs'

const setupTestUtils = (
	useEslint: boolean,
	useTs: boolean,
	globalStateLib?: string
) => {
	const useRedux = globalStateLib === 'redux'

	writeToRoot(
		'src/test-utils/jest-common.ts',
		`
      import { Config } from '@jest/types'
      import path from 'path'

      const config: Config.InitialOptions = {
        rootDir: path.join(__dirname, '../'),
        moduleDirectories: ['node_modules', path.join(__dirname, '..'), __dirname],
        modulePathIgnorePatterns: ['dist'],
        coveragePathIgnorePatterns: ['../mocks', '../test-utils', '../coverage'],
        watchPlugins: [
          'jest-watch-select-projects',
          'jest-watch-typeahead/filename',
          'jest-watch-typeahead/testname',
          'jest-runner-eslint/watch-fix'
        ]
      }

      module.exports = config
    `
	)

	writeToRoot(
		'src/test-utils/jest.client.ts',
		`
      import { Config } from '@jest/types'

      const config: Config.InitialOptions = {
        ...require('./jest-common'),
        displayName: 'client',
        testEnvironment: 'jest-environment-jsdom',
        testMatch: [
          '**/__tests__/**/*.[jt]s?(x)',
          '**/?(*.)+(spec|test).[jt]s?(x)',
          '!**/utils/__tests__/*.(ts|tsx)'
        ],
        moduleNameMapper: {
          "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test-utils/fileMock.${
						useTs ? 't' : 'j'
					}s",
          '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
        },
        setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.ts'],
      }

      module.exports = config
    `
	)

	writeToRoot(
		'src/test-utils/fileMock.ts',
		`
			export default 'test-file-stub'
		`
	)

	writeToRoot(
		'src/test-utils/jest.utils.ts',
		`
      import { Config } from '@jest/types'
   
      const config: Config.InitialOptions = {
        ...require('./jest-common'),
        displayName: 'utils',
        testEnvironment: 'jest-environment-node',
        testMatch: ['**/utils/__tests__/*.(ts|tsx)'],
      }

      module.exports = config
    `
	)

	writeToRoot(
		'src/test-utils/jest.lint.ts',
		`
      import { Config } from '@jest/types'

      const config: Config.InitialOptions = {
        ...require('./jest-common'),
        displayName: 'lint',
        runner: 'jest-runner-eslint',
        testMatch: ['<rootDir>/**/*.[jt]s?(x)']
      }

      module.exports = config
    `
	)

	writeToRoot(
		'src/test-utils/setupTests.ts',
		`
      import '@testing-library/jest-dom/extend-expect'
      import 'jest-axe/extend-expect'
      import 'whatwg-fetch'

      import { server } from 'mocks/server'

      // Establish API mocking before all tests.
      beforeAll(() => server.listen())

      // Reset any request handlers that we may add during the tests,
      // so they don't affect other tests.
      afterEach(() => server.resetHandlers())

      // Clean up after the tests are finished.
      afterAll(() => server.close())
    `
	)

	writeToRoot(
		'src/test-utils/index.tsx',
		`
    import { render as rtlRender, RenderOptions } from '@testing-library/react'
    import React, { FC, ReactElement } from 'react'
    ${useRedux ? "import { Provider } from 'react-redux'" : ''}
    import { MemoryRouter } from 'react-router-dom'
    import { RecoilRoot } from 'recoil'
    ${useRedux ? "import store from 'store'" : ''}

      const render = (
        ui: ReactElement,
        options?: Omit<RenderOptions, 'wrapper'> & { route?: string }
      ) => {
        const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
          return (
            ${useRedux ? '<Provider store={store}>' : ''}
              <RecoilRoot>
                <MemoryRouter initialEntries={[options?.route || '/']}>{children}</MemoryRouter>
              </RecoilRoot>
            ${useRedux ? '</Provider>' : ''}
          )
        }

        return rtlRender(ui, { wrapper: AllTheProviders, ...options })
      }

      export * from '@testing-library/react'
      export default render
    `
	)

	writeToRoot(
		'jest.config.ts',
		`
      import { Config } from '@jest/types'

      const config: Config.InitialOptions = {
        ...require('./src/test-utils/jest-common.ts'),
        coverageThreshold: {
          global: {
            statements: 50,
            branches: 25,
            functions: 30,
            lines: 55
          }
        },
        projects: [
          '<rootDir>/test-utils/jest.client.ts',
          '<rootDir>/test-utils/jest.utils.ts',
          '<rootDir>/test-utils/jest.lint.ts'
        ]
      }

      module.exports = config
    `
	)

	if (useEslint) {
		writeToRoot(
			'jest-runner-eslint.config.ts',
			`
        export default {
        cliOptions: {
          ignorePath: './.gitignore',
          cache: true
          }
        }
      `
		)
	}
}

export default setupTestUtils
