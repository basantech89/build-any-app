import { describe, expect, test } from '@jest/globals'
import { runCli } from 'utils/cli'

describe('Help Output', () => {
	test('build-any-app command returns help output', async () => {
		const output = await runCli(['--help'])
		expect(output).toContain('build-any-app')
	})

	test('web command returns help output', async () => {
		const output = await runCli(['web', '--help'])
		expect(output).toContain('framework')
	})
})
