const commitTypes = require('./commitTypes')

const parserOpts = {
	headerPattern:
		/^(?::\w*:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\s(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))(?:\s\(?\)?)?$/,
}

const types = commitTypes.map(type => ({
	type: type.value,
	section: type.section,
	hidden: !!type.hidden,
}))

module.exports = {
	branches: [
		'+([0-9])?(.{+([0-9]),x}).x',
		'main',
		'next',
		'next-major',
		{
			name: 'alpha',
			prerelease: true,
			channel: 'alpha',
		},
		{
			name: 'beta',
			prerelease: true,
			channel: 'beta',
		},
	],
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'conventionalcommits',
				parserOpts,
				releaseRules: [
					{
						type: 'hotfix',
						release: 'patch',
					},
					{
						type: 'style',
						release: 'patch',
					},
					{
						type: 'module',
						release: 'minor',
					},
				],
			},
		],
		[
			'@semantic-release/release-notes-generator',
			{
				preset: 'conventionalcommits',
				parserOpts,
				presetConfig: { types },
			},
		],
		'@semantic-release/changelog',
		'@semantic-release/npm',
		[
			'@semantic-release/git',
			{
				message:
					'🔖 chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		'@semantic-release/github',
	],
}
