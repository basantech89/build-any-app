import { frameworkPrompt, globalStateLibPrompt, uiLibPrompt } from './prompts'
import createTasks from './tasks'

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
			choices: ['react'],
			alias: 'f',
			describe: 'The framework you want to use for your web application.',
		},
		ui: {
			choices: [
				'awesome-ui',
				'material-ui',
				'chakra',
				'reactstrap',
				'react-bootstrap',
			],
			alias: 'u',
			describe: 'The UI library you want to use for your web application.',
		},
		stateLibrary: {
			choices: ['redux'],
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

		const extraTools = { framework, uiLib, globalStateLib }

		const tasks = createTasks([...staticTools, 'babel'], extraTools)
		const { deps, devDeps } = tasks
			.framework()
			.eslint()
			.prettier()
			.jest()
			.babel()
			.typescript()
			.ui()

		// await runCommands(`yarn add ${deps.join(' ')}`)
		// await runCommands(`yarn add -D ${devDeps.join(' ')}`)
	},
}

export default webCommand
