import { TaskArgs } from '.'

import { runCommands } from 'utils/cli'
import { writeObjToRoot, writeToRoot } from 'utils/fs'

const husky = async ({ libs, devDeps }: TaskArgs) => {
	const { useCommitizen } = libs

	devDeps.push('lint-staged')

	await runCommands('npx husky-init')

	if (useCommitizen) {
		await writeToRoot(
			'.husky/commit-msg',
			`
      #!/usr/bin/env sh
      . "$(dirname "$0")/_/husky.sh"

      yarn commitlint --edit "$1" 
    `
		)
	}

	await writeToRoot(
		'.husky/pre-commit',
		`
      #!/usr/bin/env sh
      . "$(dirname "$0")/_/husky.sh"

      yarn lint-staged
    `
	)

	await writeObjToRoot('.lintstagedrc.json', {
		'*.+(js|jsx|ts|tsx)': ['eslint'],
		'**/*.+(js|jsx|ts|tsx)': ['prettier --write'],
	})
}

husky.displayName = 'husky'
export default husky
