#!/usr/bin/env ts-node

export declare interface WebArguments {
	framework: 'react'
	ui: 'awesome-ui' | 'material-ui' | 'chakra' | 'reactstrap' | 'react-bootstrap'
	stateLibrary: 'redux'
}

export const command = 'web [framework] [ui] [stateLibrary]'
export const desc = 'Create a web application'
export const builder = {
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
}

export function handler(args: WebArguments) {
	console.log('web command args', args)
}
