import webCommand from './commands/web'
import gitService from './services/git'

import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs-extra'
import { simpleGit } from 'simple-git'
import { deepMerge, pathExist, setArgument } from 'utils'
import { runCommands } from 'utils/cli'
import { gracefullyExit } from 'utils/handlers'
import { greenLogger, warmLogger } from 'utils/logger'
import {
	cicdChoices,
	cicdPrompt,
	CodeQualityTools,
	codeQualityToolsChoices,
	codeQualityToolsPrompt,
	gitProviderChoices,
	gitProviderPrompt,
	licenseChoicePrompt,
	npmTokenPrompt,
	NullableGitProvider,
	privatePackagePrompt,
	privateRepoPrompt,
	publishPackagePrompt,
	repoNamePrompt,
	staticToolChoices,
	StaticTools,
	staticToolsPrompt,
	tokenPrompt,
} from 'utils/prompts'
import { getUserInfo } from 'utils/userInfoPrompt'
import yargs, { ArgumentsCamelCase } from 'yargs'
import { hideBin } from 'yargs/helpers'

export declare type BaseArguments = {
	name?: string
	packageName?: string
	repoName?: string
	staticTools?: StaticTools
	t?: StaticTools
	codeQualityTools?: CodeQualityTools
	c?: CodeQualityTools
	cicd?: typeof cicdChoices[number]
	interactive?: boolean
	privatePackage?: boolean
	privateRepo?: boolean
	publish?: boolean
	provider?: NullableGitProvider
	token?: string
	npmToken?: string
	description?: string
	license?: string
	debug?: boolean
}

export declare interface UserInfo {
	description?: string
	license?: string
	email: string
	name: string
	packageName: string
	privateRepo: boolean
	privatePackage: boolean
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
		.option('name', {
			alias: 'n',
			describe: 'Author name',
			type: 'string',
		})
		.option('repo-name', {
			alias: 'r',
			describe: 'Repository name',
			type: 'string',
		})
		.option('description', {
			alias: 'd',
			describe: 'Project description',
			type: 'string',
		})
		.option('package-name', {
			alias: 'p',
			describe: 'Package name',
			type: 'string',
		})
		.option('interactive', {
			alias: 'i',
			describe: 'Ask prompts interactively',
			type: 'boolean',
		})
		.option('cicd', {
			describe: 'CI-CD',
			choices: cicdChoices,
		})
		.option('private-package', {
			alias: 'private-pkg',
			describe: 'Is your package private?',
			type: 'boolean',
		})
		.option('private-repo', {
			describe: 'Is your repo private?',
			type: 'boolean',
		})
		.option('publish', {
			describe: 'Do you wish to publish your project?',
			type: 'boolean',
		})
		.option('debug', {
			describe: 'Run the app in debug mode?',
			type: 'boolean',
		})
		.option('provider', {
			describe: 'Git Provider',
			choices: gitProviderChoices,
		})
		.option('license', {
			alias: 'l',
			describe: 'Project License',
			type: 'string',
		})
		.option('token', {
			describe: 'Git provider token',
			type: 'string',
		})
		.option('npmToken', {
			describe: 'NPM Token',
			type: 'string',
		})
		.option('static-tools', {
			alias: 't',
			describe: 'The static tools you want to use for your web application.',
			type: 'array',
			choices: staticToolChoices,
		})
		.option('code-quality-tools', {
			alias: 'c',
			describe: 'The static tools you want to use for your web application.',
			type: 'array',
			choices: codeQualityToolsChoices,
		})
		.middleware(async (argv: ArgumentsCamelCase<BaseArguments>) => {
			const explorer = cosmiconfigSync('build-any-app')
			const configInfo = explorer.search()
			let config = argv
			if (configInfo && !configInfo.isEmpty) {
				greenLogger.silly(
					'Config file found, merging the config options with cli options.'
				)
				config = deepMerge(configInfo.config, argv)
			}

			global.interactive = !!config.interactive
			global.debug = !!config.debug

			const gitProvider = await setArgument(
				'Git Provider',
				gitProviderPrompt,
				config.provider
			)

			const repoName = await setArgument(
				'Repository Name',
				repoNamePrompt,
				config.repoName,
				pathExist
			)

			global.gitProvider = gitProvider
			global.repoName = repoName

			const rootDir = `${process.cwd()}/${repoName}`
			global.rootDir = rootDir

			await fs.ensureDir(rootDir)
			await runCommands('npm init -y')
			await simpleGit(rootDir)
				.init(false, {
					'--quiet': null,
					'--initial-branch': 'main',
				})
				.add('.')
				.commit('🍻 init(pkg-json): build-any-app - Initial commit')

			if (gitProvider !== 'None') {
				const token = await setArgument('Token', tokenPrompt, config.token)

				const git = gitService(gitProvider, token)
				let user = await git.getUser()

				if (!config.license) {
					if (interactive) {
						const licenses = await git.getLicenses()
						const licensePrompt = licenseChoicePrompt(
							licenses.map(license => license.name)
						)
						const licenseName = await licensePrompt.run()
						global.license = await git.getLicense(licenseName)
					} else {
						warmLogger.warn(
							'option --license is optional and not provided. Run the app in interactive mode to choose a license.'
						)
					}
				} else {
					global.license = await git.getLicense(config.license)
				}

				const repoExist = await git.repoExist(repoName)
				if (repoExist) {
					gracefullyExit(
						new Error(
							`Repo ${repoName} already exists on ${gitProvider}, Try a different repo name.`
						)
					)
				}

				const privateRepo = await setArgument(
					'Private repo option',
					privateRepoPrompt,
					config.privateRepo
				)

				const cicd = await setArgument('Ci-CD Tool', cicdPrompt, config.cicd)

				let npmToken = ''
				let publishPackage = false
				if (cicd !== 'None') {
					publishPackage = await setArgument(
						'Publish project option',
						publishPackagePrompt,
						config.publish
					)

					if (publishPackage) {
						const privatePackage = await setArgument(
							'Private package option',
							privatePackagePrompt,
							config.privatePackage
						)

						npmToken = await setArgument(
							'NPM Token',
							npmTokenPrompt,
							config.npmToken
						)

						const authorName = config.name || user.name

						const info: Partial<UserInfo> = {
							name: authorName,
							description: config.description,
							packageName: config.packageName,
						}

						const userInfo = await getUserInfo(info, publishPackage)
						user = { ...user, ...userInfo }

						global.privatePackage = privatePackage
						global.publishPackage = publishPackage
					}

					argv.codeQualityTools = await setArgument(
						'Code Quality Tools',
						codeQualityToolsPrompt,
						config.c
					)
				}

				git.initialize().then(repo => {
					global.repoSSHUrl = repo?.ssh_url
					global.repoHTTPUrl = repo?.http_url
					global.repoWebUrl = repo?.web_url
					if (publishPackage && npmToken) {
						// repo secret can only be created once the repo has been created on the git provider
						git.createRepoSecret('NPM_TOKEN', npmToken)
					}
				})

				global.user = user
				global.cicd = cicd
				global.privateRepo = privateRepo
			}

			const staticTools = await setArgument(
				'Static Tools',
				staticToolsPrompt,
				config.t
			)

			argv.repoName = repoName
			argv.staticTools = staticTools

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
