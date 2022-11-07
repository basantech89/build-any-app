import { TaskArgs } from '.'

import { runCommands, writeObjToRoot, writeToRoot } from 'utils'

const husky = async ({ devDeps }: TaskArgs) => {
	devDeps.push('lint-staged')

	await runCommands('npx husky-init && yarn')

	writeToRoot(
		'.husky/commit-msg',
		`
      #!/bin/sh
      . "$(dirname "$0")/_/husky.sh"

      yarn commitlint --edit "$1" 
    `
	)

	writeToRoot(
		'.husky/pre-commit',
		`
      #!/bin/sh
      . "$(dirname "$0")/_/husky.sh"

      yarn lint-staged
    `
	)

	writeObjToRoot('.lintstagedrc.json', {
		'*.+(js|jsx|ts|tsx)': ['eslint'],
		'**/*.+(js|jsx|ts|tsx)': ['prettier --write'],
	})
}

export default husky
