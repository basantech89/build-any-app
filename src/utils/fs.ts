import { transformAsync } from '@babel/core'
import { copy, outputFile, readJson, WriteFileOptions } from 'fs-extra'
import { format } from 'prettier'
import { prettierConfig } from 'tasks/prettier'
import { inspect } from 'util'
import { deepMerge } from 'utils/index'
import { greenLogger, warmLogger } from 'utils/logger'

export const writeObjToRoot = async (
	filepath: string,
	obj: Record<string, unknown>,
	options = 'utf-8'
) => {
	try {
		const inspectedObj = inspect(obj, {
			sorted: true,
			compact: false,
			depth: 20,
		})

		const fileExtension = filepath.split('.').at(-1)
		const formattedObj = format(inspectedObj, {
			...prettierConfig,
			parser: fileExtension === 'js' ? 'json5' : 'json-stringify',
		})

		const file = `${global.rootDir}/${filepath}`

		await outputFile(
			file,
			fileExtension === 'js'
				? `
			// eslint-disable-next-line no-undef
			module.exports = ${formattedObj}
			`
				: formattedObj,
			options
		)
		if (global.debug) {
			greenLogger.success(`Successfully wrote ${file}`)
		}
	} catch (err) {
		warmLogger.error(`Received error on writing ${filepath}: ${err}`)
	}
}

export const getFileAssets = (fileLoc: string) => {
	const pathArray = fileLoc.split('/')
	const file = pathArray.at(-1) as string
	const dotIdx = file.lastIndexOf('.')

	const isNoExtension = dotIdx <= 0

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
	const extToParser = {
		txt: 'sh',
		md: 'mdx',
		css: 'css',
		scss: 'scss',
		less: 'less',
		ts: 'typescript',
		tsx: 'typescript',
		js: 'babel',
		jsx: 'babel',
		html: 'html',
		yml: 'yaml',
		yaml: 'yaml',
	}

	if (!extension) {
		prettierConfig.parser = 'sh'
	} else if (extension in extToParser) {
		prettierConfig.parser = extToParser[extension as keyof typeof extToParser]
	} else {
		prettierConfig.filepath = filepath
	}

	return format(content, prettierConfig)
}

declare type Option = {
	ignorePrettier?: boolean
} & WriteFileOptions

export const writeToRoot = async (
	tsFilepath: string,
	content: string,
	options?: Option
) => {
	try {
		const defaultOptions = { encoding: 'utf-8', ignorePrettier: false }
		const mergedOptions = deepMerge(defaultOptions, options || {})

		const { filepath, extension } = getFileAssets(tsFilepath)
		if (!global.useTs && (extension === 'js' || extension === 'jsx')) {
			content = await getTranspiledContent(content, tsFilepath)
		}

		const { ignorePrettier, ...rest } = mergedOptions
		if (!ignorePrettier) {
			content = prettyFormat(filepath, extension, content)
		}

		const file = `${global.rootDir}/${filepath}`
		await outputFile(file, content, rest)
		if (global.debug) {
			greenLogger.success(`Successfully wrote ${file}`)
		}
	} catch (err) {
		warmLogger.error(`Received error on writing ${tsFilepath}: ${err}`)
	}
}

export const readJsonFromRoot = (filepath: string) => {
	const file = `${global.rootDir}/${filepath}`
	return readJson(file)
		.then(jsonObj => jsonObj)
		.catch(err => {
			warmLogger.error(
				`Could not read from file ${file}.\nReceived error, ${err}`
			)
		})
}

export const copyToRoot = (
	srcPath: string,
	dest: string,
	absDest?: boolean
) => {
	const destPath = absDest ? dest : `${global.rootDir}/${dest}`
	return copy(srcPath, destPath)
		.then(() => {
			if (global.debug) {
				greenLogger.success(`Successfully copied ${srcPath} to ${destPath}`)
			}
		})
		.catch(e => {
			warmLogger.error(`Could not copy ${srcPath} to ${destPath}`)
		})
}
