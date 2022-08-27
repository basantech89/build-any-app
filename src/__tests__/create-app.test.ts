import { runCli } from 'utils'

import { describe, expect, test } from '@jest/globals'

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
