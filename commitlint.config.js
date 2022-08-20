module.exports = {
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
