import { describe, expect, test } from '@jest/globals'
import { runCli } from 'utils'

describe('Help Output', () => {
	test('create-app command returns help output', async () => {
		const output = await runCli(['--help'])
		expect(output).toContain('create-app')
	})

	test('web command returns help output', async () => {
		const output = await runCli(['web', '--help'])
		expect(output).toContain('framework')
	})
})
