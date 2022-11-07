import { TaskArgs } from '.'

import { runCommands, writeObjToRoot } from 'utils'

const commitizen = async ({ devDeps }: TaskArgs) => {
	devDeps.push(
		'cz-customizable',
		'@commitlint/cli',
		'commitlint-config-gitmoji'
	)

	await runCommands('npx commitizen init cz-customizable --yarn --dev --exact')

	const config = {
		extends: ['gitmoji'],
		rules: {
			'header-max-length': [2, 'always', 100],
			'type-enum': [
				2,
				'always',
				[
					'feat',
					'fix',
					'hotfix',
					'docs',
					'style',
					'refactor',
					'perf',
					'test',
					'chore',
					'revert',
					'wip',
					'build',
					'ci',
					'security',
					'init',
				],
			],
		},
	}

	writeObjToRoot('commitlint.config.js', config)
}

export default commitizen
