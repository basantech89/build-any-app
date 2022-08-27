#!/usr/bin/env node

import createApp from './create-app'

const currentNodeVersion = process.version
const semver = currentNodeVersion.split('.')
const major = +semver[0]

if (major < 14) {
	console.error(
		`You are running TS Node ${currentNodeVersion}\n
    Create Web App requires TS Node 14 or higher.\n
    Please update your version of TS Node.`
	)
	process.exit(1)
}

const parser = createApp()
parser.argv
