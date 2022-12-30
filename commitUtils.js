const commitTypes = [
	{
		value: 'feat',
		name: 'feat:     🎉  A new feature',
		emoji: '🎉',
		section: '🎉 Features',
	},
	{
		value: 'module',
		name: 'module:   ✨  A new module',
		emoji: '✨',
		section: '🎉 Features',
	},
	{
		value: 'fix',
		name: 'fix:      🐛  A bug fix',
		emoji: '🐛',
		section: '🐛 Bug Fixes',
	},
	{
		value: 'hotfix',
		name: 'hotfix:   🚑  Critical hotfix',
		emoji: '🚑',
		section: '🐛 Bug Fixes',
	},
	{
		value: 'docs',
		name: 'docs:     📝  Documentation only changes',
		emoji: '📝',
		section: '📝 Documentation',
		hidden: true,
	},
	{
		value: 'style',
		name: 'style:    💄  Changes that do not affect the meaning of the code',
		emoji: '💄',
		section: '💄 Styles',
		hidden: true,
	},
	{
		value: 'refactor',
		name: 'refactor: ♻️  A code change that neither fixes a bug nor adds a feature',
		emoji: '♻️',
		section: '♻️ Code Refactoring',
		hidden: true,
	},
	{
		value: 'perf',
		name: 'perf:     🚀  A code change that improves performance',
		emoji: '🚀',
		section: '🚀 Performance Improvements',
	},
	{
		value: 'test',
		name: 'test:     ✅  Adding missing tests or correcting existing tests',
		emoji: '✅',
		section: '✅ Tests',
		hidden: true,
	},
	{
		value: 'build',
		name: 'build:    👷  Changes that affect the build system or external dependencies',
		emoji: '👷',
		section: '👷 Build System',
		hidden: true,
	},
	{
		value: 'ci',
		name: 'ci:       💚  Changes to our CI configuration files and scripts',
		emoji: '💚',
		section: '💚 Continuous Integration',
		hidden: true,
	},
	{
		value: 'chore',
		name: "chore:    🚚  Other changes that don't modify src or test files",
		emoji: '🚚',
		section: '🚚 Miscellaneous Chores',
		hidden: true,
	},
	{
		value: 'revert',
		name: 'revert:   ⏪️ Reverts a previous commit',
		emoji: '⏪️',
		section: '⏪️ Reverts',
	},
	{
		value: 'wip',
		name: 'wip:      🚧  Work in progress',
		emoji: '🚧',
		section: '🚧 Work In Progress',
		hidden: true,
	},
	{
		value: 'security',
		name: 'security: 🔒  Fixing security issues',
		emoji: '🔒',
		section: '🔒 Security Fixes',
	},
	{
		value: 'init',
		name: 'beers:    🍻  Initial commit',
		emoji: '🍻',
		section: '🚧 Work In Progress',
		hidden: true,
	},
]

// TESTED here as well - https://regex101.com/r/It64B6/1
const commitRegex =
	/^(?:(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\s(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))(?:\s\(?\)?)?$/

const commitUtils = { commitTypes, commitRegex }

module.exports = commitUtils
