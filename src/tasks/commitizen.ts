import { TaskArgs } from '.'

import { writeToRoot } from 'utils/fs'

const commitizen = ({ devDeps }: TaskArgs) => {
	devDeps.push('cz-git', '@commitlint/cli', '@commitlint/config-conventional')

	writeToRoot(
		'commitlint.config.js',
		`
			/* eslint-disable no-undef */
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const { commitRegex, commitTypes } = require('./commitUtils')

			module.exports = {
				extends: ['@commitlint/config-conventional'],
				parserPreset: {
					parserOpts: { headerPattern: commitRegex },
				},
			  rules: {
			    "header-max-length": [2, "always", 150],
			    "type-enum": [
			      2,
			      "always",
			      commitTypes.map(type => type.value)
			    ],
			  },
			  prompt: {
			    alias: { fd: "docs: fix typos" },
			    messages: {
			      type: "Select the type of change that you're committing:",
			      scope: "Denote the SCOPE of this change (optional):",
			      customScope: "Denote the SCOPE of this change:",
			      subject: "Write a SHORT, IMPERATIVE tense description of the change:\\n",
			      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\\n',
			      breaking:
			        'List any BREAKING CHANGES (optional). Use "|" to break new line:\\n',
			      // footerPrefixsSelect: "Select the ISSUES type of changeList by this change (optional):",
			      // customFooterPrefixs: "Input ISSUES prefix:",
			      footer: "List any ISSUES by this change. E.g.: #31, #34:\\n",
			      confirmCommit: "Are you sure you want to proceed with the commit above?",
			    },
			    types: commitTypes.map((type) => ({
			      value: type.value,
			      name: type.name,
			      emoji: type.emoji,
			    })),
			    useEmoji: true,
			    emojiAlign: "left",
			    themeColorCode: "",
			    scopes: [
			      { name: "ui" },
			      { name: "ci" },
			      { name: "tests" },
			      { name: "core" },
			      { name: "tooling" },
			      { name: "style" },
			    ],
			    allowCustomScopes: true,
			    allowEmptyScopes: false,
			    customScopesAlign: "bottom",
			    customScopesAlias: "custom",
			    emptyScopesAlias: "empty",
			    upperCaseSubject: false,
			    markBreakingChangeMode: false,
			    allowBreakingChanges: ["feat", "fix", "hotfix", "module"],
			    breaklineNumber: 100,
			    breaklineChar: "|",
			    skipQuestions: [],
			    // issuePrefixs: [{ value: "closed", name: "closed:   ISSUES has been processed" }],
			    // customIssuePrefixsAlign: "top",
			    // emptyIssuePrefixsAlias: "skip",
			    // customIssuePrefixsAlias: "custom",
			    allowCustomIssuePrefixs: false,
			    allowEmptyIssuePrefixs: false,
			    confirmColorize: true,
			    maxHeaderLength: 150,
			    maxSubjectLength: Infinity,
			    minSubjectLength: 0,
			    scopeOverrides: undefined,
			    defaultBody: "",
			    defaultIssues: "",
			    defaultScope: "",
			    defaultSubject: "",
			  },
			}
		`
	)

	writeToRoot(
		'commitUtils.js',
		`
			const commitTypes = [
			  {
			    value: "feat",
			    name: "feat:     🎉  A new feature",
			    emoji: "🎉",
			    section: "🎉 Features",
			  },
			  {
			    value: "module",
			    name: "module:   ✨  A new module",
			    emoji: "✨",
			    section: "🎉 Features",
			  },
			  {
			    value: "fix",
			    name: "fix:      🐛  A bug fix",
			    emoji: "🐛",
			    section: "🐛 Bug Fixes",
			  },
			  {
			    value: "hotfix",
			    name: "hotfix:   🚑  Critical hotfix",
			    emoji: "🚑",
			    section: "🐛 Bug Fixes",
			  },
			  {
			    value: "docs",
			    name: "docs:     📝  Documentation only changes",
			    emoji: "📝",
			    section: "📝 Documentation",
			    hidden: true,
			  },
			  {
			    value: "style",
			    name: "style:    💄  Changes that do not affect the meaning of the code",
			    emoji: "💄",
			    section: "💄 Styles",
			    hidden: true,
			  },
			  {
			    value: "refactor",
			    name: "refactor: ♻️  A code change that neither fixes a bug nor adds a feature",
			    emoji: "♻️",
			    section: "♻️ Code Refactoring",
			    hidden: true,
			  },
			  {
			    value: "perf",
			    name: "perf:     🚀  A code change that improves performance",
			    emoji: "🚀",
			    section: "🚀 Performance Improvements",
			  },
			  {
			    value: "test",
			    name: "test:     ✅  Adding missing tests or correcting existing tests",
			    emoji: "✅",
			    section: "✅ Tests",
			    hidden: true,
			  },
			  {
			    value: "build",
			    name: "build:    👷  Changes that affect the build system or external dependencies",
			    emoji: "👷",
			    section: "👷 Build System",
			    hidden: true,
			  },
			  {
			    value: "ci",
			    name: "ci:       💚  Changes to our CI configuration files and scripts",
			    emoji: "💚",
			    section: "💚 Continuous Integration",
			    hidden: true,
			  },
			  {
			    value: "chore",
			    name: "chore:    🚚  Other changes that don't modify src or test files",
			    emoji: "🚚",
			    section: "🚚 Miscellaneous Chores",
			    hidden: true,
			  },
			  {
			    value: "revert",
			    name: "revert:   ⏪️ Reverts a previous commit",
			    emoji: "⏪️",
			    section: "⏪️ Reverts",
			  },
			  {
			    value: "wip",
			    name: "wip:      🚧  Work in progress",
			    emoji: "🚧",
			    section: "🚧 Work In Progress",
			    hidden: true,
			  },
			  {
			    value: "security",
			    name: "security: 🔒  Fixing security issues",
			    emoji: "🔒",
			    section: "🔒 Security Fixes",
			  },
			  {
					value: 'init',
					name: 'beers: 🍻  Initial commit',
					emoji: '🍻',
					section: '🚧 Work In Progress',
					hidden: true,
				},
			];
			
			const commitRegex =
				/^(?:(?:\\ud83c[\\udf00-\\udfff])|(?:\\ud83d[\\udc00-\\ude4f\\ude80-\\udeff])|[\\u2600-\\u2B55])\\s(?<type>\\w*)(?:\\((?<scope>.*)\\))?!?:\\s(?<subject>(?:(?!#).)*(?:(?!\\s).))(?:\\s\\(?\\)?)?$/
			
			const commitUtils = { commitTypes, commitRegex }

			// eslint-disable-next-line no-undef
			module.exports = commitUtils
		`
	)
}

commitizen.displayName = 'commitizen'
export default commitizen
