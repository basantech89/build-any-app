import { runCommands } from 'utils'

const publish = async () => {
	await runCommands('npx semantic-release-cli setup')
}
