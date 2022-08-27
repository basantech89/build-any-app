#!/usr/bin/env ts-node

import yargs from 'yargs/yargs'

import { hideBin } from 'yargs/helpers'

const program = yargs(hideBin(process.argv))

const createApp = () =>
	program
		.scriptName('create-app')
		.usage('Usage: $0 <command> [options]')
		.example('$0 web -f react -u awesome-ui -s redux my-app')
		.option('--project-name', {
			alias: 'p',
			demandOption: true,
			describe: 'Project name',
			type: 'string',
		})
		.demandCommand(1)
		.commandDir('commands', {
			extensions: process.env.NODE_ENV !== 'production' ? ['js', 'ts'] : ['js'],
		})
		.recommendCommands()
		.wrap(120)
		.alias('version', 'v')
		.alias('h', 'help')
		.help()
		.strict()

export default createApp
