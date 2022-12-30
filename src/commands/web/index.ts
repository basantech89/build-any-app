import { BaseArguments } from '../../create-app'

import {
	frameworkPrompt,
	frameworks,
	globalStateLibPrompt,
	globalStates,
	uiLibPrompt,
	uiLibs,
} from './prompts'

import createTasks from 'tasks'
import push from 'tasks/push'
import { runCommands } from 'utils/cli'
import { greenLogger, warmLogger } from 'utils/logger'
import { ArgumentsCamelCase } from 'yargs'

export declare interface WebArguments
	extends Pick<BaseArguments, 'staticTools' | 'codeQualityTools'> {
	framework?: string
	ui?: string
	stateLibrary?: string
}

const webCommand = {
	command: 'web [framework] [ui] [stateLibrary] [staticTools...]',
	desc: 'Create a web application',
	builder: {
		framework: {
			choices: frameworks,
			alias: 'f',
			describe: 'The framework you want to use for your web application.',
		},
		ui: {
			choices: uiLibs,
			alias: 'u',
			describe: 'The UI library you want to use for your web application.',
		},
		stateLibrary: {
			choices: globalStates,
			alias: 's',
			describe:
				'The global state management library you want to use for your web application.',
		},
	},
	handler: async function (args: ArgumentsCamelCase<WebArguments>) {
		let framework = args.framework
		if (!framework) {
			framework = await frameworkPrompt.run()
		}

		let uiLib = args.ui
		if (!uiLib) {
			uiLib = await uiLibPrompt.run()
		}

		let globalStateLib = args.stateLibrary
		if (!globalStateLib) {
			globalStateLib = await globalStateLibPrompt.run()
		}

		const staticTools = args.staticTools || []
		const codeQualityTools = args.codeQualityTools || []

		const { tasks, deps, devDeps } = createTasks(
			staticTools,
			codeQualityTools,
			framework,
			uiLib,
			globalStateLib
		)

		Promise.all(tasks)
			.then(() => {
				greenLogger.info('Installing dependencies...')
				const addDeps = runCommands(`yarn add ${deps.join(' ')}`)
				const addDevDeps = runCommands(`yarn add -D ${devDeps.join(' ')}`)
				Promise.all([addDeps, addDevDeps]).then(async () => {
					greenLogger.info('Running eslint...')
					await runCommands(`yarn lint:fix`)
					greenLogger.info(`Pushing to ${global.gitProvider}...`)
					await push()
					greenLogger.silly('Done, duh!')
				})
			})
			.catch(warmLogger.error)
	},
}

export default webCommand
