import regex from '../constants/regex'

import { describe, expect, test } from '@jest/globals'
import { isBinaryExist } from 'utils/cli'
import { getFileAssets } from 'utils/fs'
import { toCamelCaseKeys } from 'utils/index'

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
		expect(getFileAssets('.husky/commit-msg')).toMatchObject({
			extension: '',
			filepath: '.husky/commit-msg',
		})
		expect(getFileAssets('.github/workflows/build.yml')).toMatchObject({
			extension: 'yml',
			filepath: '.github/workflows/build.yml',
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

describe('regex', () => {
	test('email regex', () => {
		const emailRegex = regex.email
		expect(emailRegex.test('abc@test.com')).toBe(true)
		expect(emailRegex.test('abcccc@test.c')).toBe(true)
		expect(emailRegex.test('abcccc@test')).toBe(false)
		expect(emailRegex.test('abcccc@test.')).toBe(false)
		expect(emailRegex.test('abcccc@')).toBe(false)
		expect(emailRegex.test('abcccc')).toBe(false)
	})

	test('space regex', () => {
		const spaceRegex = regex.space
		expect(spaceRegex.test(' ')).toBe(true)
		expect(spaceRegex.test('    ')).toBe(true)
		expect(spaceRegex.test('  ')).toBe(true)
		expect(spaceRegex.test('      ')).toBe(true)
		expect(spaceRegex.test('test spaces')).toBe(true)
		expect(spaceRegex.test('test spaces ')).toBe(true)
		expect(spaceRegex.test('testspaces    ')).toBe(true)
		expect(spaceRegex.test('')).toBe(false)
		expect(spaceRegex.test('abc')).toBe(false)
	})

	test('commit regex', () => {
		const commitRegex =
			/^(?:(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\s(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))(?:\s\(?\)?)?$/

		expect(commitRegex.test("build-any-app - Initial commit'")).toBe(false)
		expect(commitRegex.test("pkg-json: build-any-app - Initial commit'")).toBe(
			false
		)
		expect(
			commitRegex.test("init(pkg-json): build-any-app - Initial commit'")
		).toBe(false)
		expect(
			commitRegex.test("🍻 pkg-json: build-any-app - Initial commit'")
		).toBe(false)
		expect(commitRegex.test('🍻 init(pkg-json)')).toBe(false)
		expect(
			commitRegex.test("🍻 init(pkg-json): build-any-app - Initial commit'")
		).toBe(true)
	})
})

describe('case keys', () => {
	const obj = {
		static_tools: ['tool1', 'tool2'],
		'code-quality-tools': ['tool3', 'tool4'],
		obj2: {
			obj3: {
				obj4: {
					new_tools: ['tool5', 'tool6'],
					'misc-tools': ['tool5', 'tool6'],
				},
			},
		},
	}

	const expected = {
		staticTools: ['tool1', 'tool2'],
		codeQualityTools: ['tool3', 'tool4'],
		obj2: {
			obj3: {
				obj4: {
					newTools: ['tool5', 'tool6'],
					miscTools: ['tool5', 'tool6'],
				},
			},
		},
	}

	test('toCamelCaseKeys', () => {
		expect(toCamelCaseKeys(obj)).toMatchObject(expected)
	})
})
