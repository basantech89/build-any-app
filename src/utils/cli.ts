import createApp from '../create-app'

import execa, { ExecaChildProcess } from 'execa'
import { gracefullyExit } from 'utils/handlers'
import { greenLogger } from 'utils/logger'
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
		const isProdEnv =
			process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test'
		const debugMode = global.debug

		const subprocess = await execa(command, {
			shell: true,
			cwd: global.rootDir,
			stdio: isProdEnv && !debugMode ? 'ignore' : 'pipe',
		})

		if (!isProdEnv || debugMode) {
			greenLogger.success({ command, message: subprocess.stdout })
		}
	} catch (e) {
		gracefullyExit(new Error((e as { stderr: string })?.stderr), command)
	}
}

export const runCommandNoExit = async (
	...commands: string[]
): Promise<execa.ExecaChildProcess> => {
	const command = commands.join(' && ')
	try {
		const isProdEnv =
			process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test'
		const debugMode = global.debug

		return await execa(command, {
			shell: true,
			cwd: global.rootDir,
			stdio: isProdEnv && !debugMode ? 'ignore' : 'pipe',
		})
	} catch (e) {
		return e as ExecaChildProcess
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
