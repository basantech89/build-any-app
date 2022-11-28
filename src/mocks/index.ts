import { afterAll, beforeAll, jest } from '@jest/globals'
import * as utils from 'utils'

jest
	.spyOn(utils, 'setArgument')
	.mockReturnValueOnce(Promise.resolve('John Doe'))
	.mockReturnValueOnce(Promise.resolve('test'))
	.mockReturnValueOnce(Promise.resolve(false))
	.mockReturnValueOnce(Promise.resolve(false))
	.mockReturnValueOnce(Promise.resolve(['eslint', 'jest']))
	.mockReturnValueOnce(Promise.resolve('github-actions'))

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
