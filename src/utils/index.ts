import createApp from '../create-app'

import { prettierConfig } from './../commands/tasks/prettier'
import { gracefullyExit } from './handlers'
import { greenLogger, warmLogger } from './logger'

import { transformAsync } from '@babel/core'
import execa from 'execa'
import fs from 'fs-extra'
import prettier from 'prettier'
import { inspect } from 'util'
import which from 'which'
import { ArgumentsCamelCase } from 'yargs'

export const runCli = async (args: string | ReadonlyArray<string>) => {
	const parser = createApp()
	return await new Promise(resolve => {
		parser.parse(
			args,
			(err: Error | undefined, argv: ArgumentsCamelCase, output: string) => {
				resolve(output)
			}
		)
	})
}

export const runCommands = async (...commands: string[]) => {
	const command = commands.join(' && ')
	try {
		const subprocess = await execa(command, {
			shell: true,
			cwd: global.rootDir,
		})
		greenLogger.success({ command, message: `${subprocess.stdout}` })
	} catch (e) {
		gracefullyExit(new Error((e as { stderr: string })?.stderr), command)
	}
}

export const isBinaryExist = async (
	...programs: string[]
): Promise<string[]> => {
	const notExists = []

	for (const program of programs) {
		try {
			await which(program)
		} catch {
			notExists.push(program)
		}
	}

	return notExists
}

export const writeObjToRoot = (
	filepath: string,
	obj: Record<string, unknown>,
	options = 'utf-8'
) => {
	const inspectedObj = inspect(obj, {
		sorted: true,
		compact: false,
		depth: 20,
	})

	const fileExtension = filepath.split('.').at(-1)
	const formattedObj = prettier.format(inspectedObj, {
		...prettierConfig,
		parser: fileExtension === 'js' ? 'json5' : 'json-stringify',
	})

	const file = `${global.rootDir}/${filepath}`
	fs.outputFile(
		file,
		fileExtension === 'js' ? `module.exports = ${formattedObj}` : formattedObj,
		options
	)
		.then(() => greenLogger.success(`Successfully wrote ${file}`))
		.catch(err => warmLogger.error(`Received error on writing ${file}: ${err}`))
}

export const getFileAssets = (fileLoc: string) => {
	const pathArray = fileLoc.split('/')
	const file = pathArray.at(-1) as string
	const dotIdx = file.lastIndexOf('.')

	const isNoExtension = dotIdx === 0
	if (isNoExtension) {
		return { filepath: fileLoc, extension: '' }
	}

	let extension = file.substring(dotIdx + 1)
	if (!global.useTs && (extension === 'ts' || extension === 'tsx')) {
		extension = `j${extension?.substring(1)}`
		const path = pathArray.slice(0, pathArray.length - 1).join('/')
		const filename = path
			? `${path}/${file.substring(0, dotIdx)}`
			: file.substring(0, dotIdx)

		return { extension, filepath: `${filename}.${extension}` }
	}

	return { filepath: fileLoc, extension }
}

export const getTranspiledContent = async (
	content: string,
	filepath: string
) => {
	const transpiled = await transformAsync(content, {
		sourceType: 'module',
		root: '../',
		generatorOpts: {
			retainLines: true,
			compact: false,
		},
		parserOpts: {
			strictMode: true,
		},
		filename: filepath,
		presets: ['@babel/preset-typescript'],
	})

	return transpiled?.code || ''
}

export const prettyFormat = (
	filepath: string,
	extension: string,
	content: string
) => {
	const useShParser = !extension || extension === 'txt'
	if (useShParser) {
		prettierConfig.parser = 'sh'
	} else if (extension === 'md') {
		prettierConfig.parser = 'mdx'
	} else if (['css', 'scss', 'less'].includes(extension)) {
		prettierConfig.parser = extension
	} else if (extension === 'ts' || extension === 'tsx') {
		prettierConfig.parser = 'typescript'
	} else if (extension === 'js' || extension === 'jsx') {
		prettierConfig.parser = 'babel'
	} else {
		prettierConfig.filepath = filepath
	}

	return prettier.format(content, prettierConfig)
}

export const writeToRoot = async (
	tsFilepath: string,
	content: string,
	options = 'utf-8'
) => {
	const { filepath, extension } = getFileAssets(tsFilepath)
	if (!global.useTs && (extension === 'js' || extension === 'jsx')) {
		content = await getTranspiledContent(content, tsFilepath)
	}

	content = prettyFormat(filepath, extension, content)

	const file = `${global.rootDir}/${filepath}`
	fs.outputFile(file, content, options)
		.then(() => greenLogger.success(`Successfully wrote ${file}`))
		.catch(err => warmLogger.error(`Received error on writing ${file}: ${err}`))
}

export const readJsonFromRoot = (filepath: string) => {
	const file = `${global.rootDir}/${filepath}`
	return fs
		.readJson(file)
		.then(jsonObj => jsonObj)
		.catch(err => {
			warmLogger.error(
				`Could not read from file ${file}.\nReceived error, ${err}`
			)
		})
}

export { greenLogger, warmLogger }
