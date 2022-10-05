import { getFileAssets, isBinaryExist } from 'utils'

import { describe, expect, test } from '@jest/globals'

describe('which', () => {
	test("isBinaryExist returns binaries that doesn't exist", async () => {
		const noExists = await isBinaryExist('not-exists')
		expect(noExists).toEqual(expect.arrayContaining(['not-exists']))
	})

	test('isBinaryExist returns binaries that exist', async () => {
		const noExists = await isBinaryExist('git')
		expect(noExists).toEqual(expect.arrayContaining([]))
	})
})

describe('getFileAssets', () => {
	test('normal file checks', () => {
		expect(getFileAssets('test.txt')).toMatchObject({
			extension: 'txt',
			filepath: 'test.txt',
		})
		expect(getFileAssets('dir1/dir2/test.txt')).toMatchObject({
			extension: 'txt',
			filepath: 'dir1/dir2/test.txt',
		})
		expect(getFileAssets('.dir1/dir2/test.txt')).toMatchObject({
			extension: 'txt',
			filepath: '.dir1/dir2/test.txt',
		})
		expect(getFileAssets('.dir1/dir2/.test.txt')).toMatchObject({
			extension: 'txt',
			filepath: '.dir1/dir2/.test.txt',
		})
	})

	test('special file checks', () => {
		expect(getFileAssets('.gitignore')).toMatchObject({
			extension: '',
			filepath: '.gitignore',
		})
		expect(getFileAssets('/.dir/.dir2/.test')).toMatchObject({
			extension: '',
			filepath: '/.dir/.dir2/.test',
		})
		expect(getFileAssets('/.dir/.dir2/.test.txt')).toMatchObject({
			extension: 'txt',
			filepath: '/.dir/.dir2/.test.txt',
		})
	})

	test('js files', () => {
		expect(getFileAssets('test.js')).toMatchObject({
			extension: 'js',
			filepath: 'test.js',
		})
		expect(getFileAssets('./dir1/.dir2/test.js')).toMatchObject({
			extension: 'js',
			filepath: './dir1/.dir2/test.js',
		})
		expect(getFileAssets('/./dir1/.dir2/test.js')).toMatchObject({
			extension: 'js',
			filepath: '/./dir1/.dir2/test.js',
		})
		expect(getFileAssets('test.ts')).toMatchObject({
			extension: 'js',
			filepath: 'test.js',
		})
		expect(
			getFileAssets('/mnt/d/repos/tests/cra-test/src/containers/AppRoutes.jsx')
		).toMatchObject({
			extension: 'jsx',
			filepath: '/mnt/d/repos/tests/cra-test/src/containers/AppRoutes.jsx',
		})
		expect(getFileAssets('src/layouts/AuthLayout/index.jsx')).toMatchObject({
			extension: 'jsx',
			filepath: 'src/layouts/AuthLayout/index.jsx',
		})
	})

	test('ts file', () => {
		const origUseTs = global.useTs
		global.useTs = true

		expect(getFileAssets('/./dir1/.dir2/test.js')).toMatchObject({
			extension: 'js',
			filepath: '/./dir1/.dir2/test.js',
		})

		expect(getFileAssets('test.ts')).toMatchObject({
			extension: 'ts',
			filepath: 'test.ts',
		})

		global.useTs = origUseTs
	})
})
