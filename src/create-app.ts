import webCommand from './commands/web'

import { greenLogger, runCommands } from 'utils'
import { projectNamePrompt, staticToolsPrompt } from 'utils/prompts'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const program = yargs(hideBin(process.argv))

const createApp = () => {
	return program
		.scriptName('create-app')
		.usage('Usage: $0 <command> [options]')
		.example(
			'$0 web -f react -u awesome-ui -s redux my-app',
			'Create a web application with react, awesome-ui and redux.'
		)
		.option('--project-name', {
			alias: 'p',
			describe: 'Project name',
			type: 'string',
		})
		.option('--static-tools', {
			alias: 't',
			describe: 'The static tools you want to use for your web application.',
			type: 'array',
			global: true,
		})
		.middleware(async argv => {
			let projectName = argv.projectName
			if (!projectName) {
				projectName = await projectNamePrompt.run()
			}

			let staticTools = argv.t as string[]
			if (!staticTools) {
				staticTools = await staticToolsPrompt.run()
			}

			argv.projectName = projectName
			argv.staticTools = staticTools

			// const rootDir = path.join(__dirname, projectName as string)
			const rootDir = `/mnt/d/repos/tests/${projectName as string}`

			greenLogger.info(`Initializing a git repo ${projectName}`)
			await runCommands(`git init ${rootDir}`, `cd ${rootDir}`, 'npm init -y')

			global.rootDir = rootDir
			global.useTs = staticTools.includes('typescript')
		})
		.command(webCommand)
		.demandCommand(1)
		.recommendCommands()
		.wrap(120)
		.alias('version', 'v')
		.alias('h', 'help')
		.help()
		.strict()
}

export default createApp
