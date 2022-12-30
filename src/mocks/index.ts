import { afterAll, beforeAll, jest } from '@jest/globals'
import * as utils from 'utils'

jest.mock('fs-extra', () => ({
	ensureDir: (dirName: string) => {},
	pathExistsSync: (dirName: string) => {},
}))

jest.mock('simple-git', () => {
	const obj = {
		init: (bare: boolean, options: any) => obj,
		add: (files: string) => obj,
		commit: (msg: string) => obj,
	}

	return { simpleGit: (rootDir?: string) => obj }
})

jest
	.spyOn(utils, 'setArgument')
	.mockReturnValueOnce(Promise.resolve('None'))
	.mockReturnValueOnce(Promise.resolve('test'))
	.mockReturnValueOnce(Promise.resolve(['eslint', 'jest']))

jest.mock('utils/prompts', () => ({
	namePrompt: { run: () => Promise.resolve('John Doe') },
	projectNamePrompt: { run: () => Promise.resolve('test') },
	staticToolsPrompt: { run: () => Promise.resolve(['eslint', 'prettier']) },
}))

jest.mock('utils/logger', () => ({
	greenLogger: { info: () => {} },
	warmLogger: { info: () => {}, error: () => {}, warn: () => {} },
}))

beforeAll(() => {
	jest.spyOn(process, 'exit').mockImplementation(() => {})
})

afterAll(() => {
	// @ts-ignore
	process.exit.mockRestore()
	// @ts-ignore
	utils.setArgument.mockRestore()
	jest.clearAllMocks()
})
