import { warmLogger } from '.'

import { pathExistsSync, removeSync } from 'fs-extra'

export const cleanup = () => {
	try {
		warmLogger.warn('Cleaning up.')
		const dir = `${global.rootDir}/`
		const dirExist = pathExistsSync(dir)
		if (dirExist) {
			warmLogger.warn(`Removing the directory ${dir}`)
			removeSync(dir)
		}
	} catch (e) {
		console.log('Error', e)
	}
}

export const gracefullyExit = (e: Error, command?: string) => {
	const info: Record<string, string> = { message: e.stack || e.message }
	if (command) {
		info.command = command
	}

	warmLogger.error(info)
	cleanup()
	process.exit(1)
}
