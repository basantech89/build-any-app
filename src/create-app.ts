import webCommand from './commands/web'

import { greenLogger, runCommandsIgnoreOp, setArgument } from 'utils'
import {
	cicdPrompt,
	namePrompt,
	privateProjectPrompt,
	projectNamePrompt,
	publishProjectPrompt,
	staticToolsPrompt,
} from 'utils/prompts'
import yargs from 'yargs'
import { ArgumentsCamelCase } from 'yargs'
import { hideBin } from 'yargs/helpers'

declare type BaseArguments = {
	name?: string
	projectName?: string
	staticTools?: string[]
	t?: string[]
	cicd?: string
	interactive?: boolean
	private?: boolean
	publish?: boolean
}

const program = yargs(hideBin(process.argv))

const createApp = () => {
	return program
		.scriptName('build-any-app')
		.usage('Usage: $0 <command> [options]')
		.example(
			'$0 web -f react -u awesome-ui -s redux my-app',
			'Create a web application with react, awesome-ui and redux.'
		)
		.option('--name', {
			alias: 'n',
			describe: 'Your name',
			type: 'string',
		})
		.option('--project-name', {
			alias: 'p',
			describe: 'Project name',
			type: 'string',
		})
		.option('--interactive', {
			alias: 'i',
			describe: 'Ask prompts interactively',
			type: 'boolean',
		})
		.option('--cicd', {
			describe: 'CI-CD',
			type: 'string',
		})
		.option('--private', {
			describe: 'Is your project private?',
			type: 'boolean',
		})
		.option('--publish', {
			describe: 'Do you wish to publish your project?',
			type: 'boolean',
		})
		.option('--static-tools', {
			alias: 't',
			describe: 'The static tools you want to use for your web application.',
			type: 'array',
			global: true,
		})
		.middleware(async (argv: ArgumentsCamelCase<BaseArguments>) => {
			global.interactive = !!argv.interactive

			const name = await setArgument<string>(
				'Author Name',
				namePrompt,
				argv.name
			)

			const projectName = await setArgument<string>(
				'Project Name',
				projectNamePrompt,
				argv.projectName
			)

			const privateProject = await setArgument<boolean>(
				'Private option',
				privateProjectPrompt,
				argv.private
			)

			const publishProject = await setArgument<boolean>(
				'Publish project option',
				publishProjectPrompt,
				argv.publish
			)

			const staticTools =
				(await setArgument<string[]>(
					'Static Tools',
					staticToolsPrompt,
					argv.t
				)) || []

			const cicd = await setArgument<string>(
				'Ci-CD Tool',
				cicdPrompt,
				argv.cicd
			)

			argv.projectName = projectName
			argv.staticTools = staticTools

			// const rootDir = path.join(__dirname, projectName as string)
			const rootDir = `/mnt/d/repos/tests/${projectName as string}`

			greenLogger.info(`Initializing a git repo ${projectName}`)
			await runCommandsIgnoreOp(
				`git init ${rootDir}`,
				`cd ${rootDir}`,
				'npm init -y'
			)

			global.author = name
			global.rootDir = rootDir
			global.cicd = cicd
			global.privateProject = privateProject
			global.publishProject = publishProject
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
