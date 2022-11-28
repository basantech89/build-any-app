import {
	frameworkPrompt,
	frameworks,
	globalStateLibPrompt,
	globalStates,
	uiLibPrompt,
	uiLibs,
} from './prompts'

import createTasks from 'tasks'
import { greenLogger, runCommandsIgnoreOp } from 'utils'
import { ArgumentsCamelCase } from 'yargs'

declare interface WebArguments {
	framework?: string
	ui?: string
	stateLibrary?: string
	staticTools: string[]
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

		const staticTools = args.staticTools

		const webTools = { framework, uiLib, globalStateLib }

		const tasks = createTasks([...staticTools, 'babel'], webTools)
		const { deps, devDeps } = tasks
			.framework()
			.eslint()
			.prettier()
			.jest()
			.babel()
			.typescript()
			.ui()
			.commitizen()
			.husky()
			.cicd()
			.publish()

		await runCommandsIgnoreOp(`yarn add ${deps.join(' ')}`)
		greenLogger.info('Installed dependencies')
		await runCommandsIgnoreOp(`yarn add -D ${devDeps.join(' ')}`)
		greenLogger.info('Installed dev dependencies')
		await runCommandsIgnoreOp(`yarn lint:fix`)
	},
}

export default webCommand
