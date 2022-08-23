#!/usr/bin/env ts-node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

module.exports = function () {
	yargs(hideBin(process.argv))
		.scriptName('create-app')
		.usage('Usage: $0 <command> [options]')
		.example('$0 web -f react -u awesome-ui -s redux my-app')
		.option('--project-name', {
			alias: 'p',
			demandOption: true,
			describe: 'Project name',
			type: 'string',
		})
		.handler.demandCommand(1)
		.commandDir('commands', {
			extensions:
				process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js'],
		})
		.recommendCommands()
		.wrap(120)
		.alias('version', 'v')
		.alias('h', 'help')
		.help()
		.strict().argv
}
