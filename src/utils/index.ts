import createApp from '../create-app'
import { WebArguments } from '../commands/web'
import { ArgumentsCamelCase } from 'yargs'

const runCli = async (args: string | ReadonlyArray<string>) => {
	const parser = createApp()
	return await new Promise(resolve => {
		parser.parse(
			args,
			(
				err: Error | undefined,
				argv: ArgumentsCamelCase<WebArguments>,
				output: string
			) => {
				resolve(output)
			}
		)
	})
}

export { runCli }
