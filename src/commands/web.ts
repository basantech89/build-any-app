#!/usr/bin/env ts-node

import { ArgumentsCamelCase, string } from 'yargs'

declare interface WebArguments {
	framework: string
	ui: string
	stateLibrary: string
}

exports.command = 'web [framework] [ui] [stateLibrary]'
exports.desc = 'Create a web application'
exports.builder = {
	framework: {
		choices: ['react'] as const,
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
}

exports.handler = function (args: ArgumentsCamelCase<WebArguments>) {
	console.log('web command args', args)
}
