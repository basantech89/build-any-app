import { afterAll, beforeAll, jest } from '@jest/globals'

jest.mock('utils/prompts', () => ({
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
	jest.clearAllMocks()
})
