import createApp from './create-app'

import { isBinaryExist } from 'utils'
import { gracefullyExit } from 'utils/handlers'

const currentNodeVersion = process.version
const semver = currentNodeVersion.split('.')
const major = +semver[0]

if (major < 14) {
	console.error(
		`You are running TS Node ${currentNodeVersion}\n
    Create App requires TS Node 14 or higher.\n
    Please update your version of TS Node.`
	)
	process.exit(1)
}

// on CTRL + C
process.on('SIGINT', gracefullyExit)

// when process cancelled
process.on('SIGTERM', gracefullyExit)

process.on('uncaughtException', gracefullyExit)

const checkPrerequisites = async () => {
	const notExists = await isBinaryExist('npx', 'git', 'node')
	if (notExists.length > 0) {
		gracefullyExit(new Error(`Not found: ${notExists.join(' ')}`))
	}
}

checkPrerequisites().then(() => {
	const parser = createApp()
	parser.argv
})
