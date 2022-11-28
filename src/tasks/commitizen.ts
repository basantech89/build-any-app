import { TaskArgs } from '.'

import { writeToRoot } from 'utils'

const commitizen = async ({ devDeps }: TaskArgs) => {
	devDeps.push('cz-git', '@commitlint/cli', '@commitlint/config-conventional')

	writeToRoot(
		'commitlint.config.js',
		`
			/* eslint-disable no-undef */
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const commitTypes = require("./commitTypes");

			module.exports = {
			  extends: ["gitmoji"],
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
		'commitTypes.js',
		`
			const commitTypes = [
			  {
			    value: "feat",
			    name: "feat:     🎉  A new feature",
			    emoji: ":tada:",
			    section: "🎉 Features",
			  },
			  {
			    value: "module",
			    name: "module:   ✨  A new module",
			    emoji: ":sparkles:",
			    section: "🎉 Features",
			  },
			  {
			    value: "fix",
			    name: "fix:      🐛  A bug fix",
			    emoji: ":bug:",
			    section: "🐛 Bug Fixes",
			  },
			  {
			    value: "hotfix",
			    name: "hotfix:   🚑  Critical hotfix",
			    emoji: ":ambulance:",
			    section: "🐛 Bug Fixes",
			  },
			  {
			    value: "docs",
			    name: "docs:     📝  Documentation only changes",
			    emoji: ":memo:",
			    section: "📝 Documentation",
			    hidden: true,
			  },
			  {
			    value: "style",
			    name: "style:    💄  Changes that do not affect the meaning of the code",
			    emoji: ":lipstick:",
			    section: "💄 Styles",
			    hidden: true,
			  },
			  {
			    value: "refactor",
			    name: "refactor: ♻️  A code change that neither fixes a bug nor adds a feature",
			    emoji: ":recycle:",
			    section: "♻️ Code Refactoring",
			    hidden: true,
			  },
			  {
			    value: "perf",
			    name: "perf:     🚀  A code change that improves performance",
			    emoji: ":rocket:",
			    section: "🚀 Performance Improvements",
			  },
			  {
			    value: "test",
			    name: "test:     ✅  Adding missing tests or correcting existing tests",
			    emoji: ":white_check_mark:",
			    section: "✅ Tests",
			    hidden: true,
			  },
			  {
			    value: "build",
			    name: "build:    👷  Changes that affect the build system or external dependencies",
			    emoji: ":construction_worker:",
			    section: "👷 Build System",
			    hidden: true,
			  },
			  {
			    value: "ci",
			    name: "ci:       💚  Changes to our CI configuration files and scripts",
			    emoji: ":green_heart:",
			    section: "💚 Continuous Integration",
			    hidden: true,
			  },
			  {
			    value: "chore",
			    name: "chore:    🚚  Other changes that don't modify src or test files",
			    emoji: ":truck:",
			    section: "🚚 Miscellaneous Chores",
			    hidden: true,
			  },
			  {
			    value: "revert",
			    name: "revert:   ⏪️ Reverts a previous commit",
			    emoji: ":rewind:",
			    section: "⏪️ Reverts",
			  },
			  {
			    value: "wip",
			    name: "wip:      🚧  Work in progress",
			    emoji: ":construction:",
			    section: "🚧 Work In Progress",
			    hidden: true,
			  },
			  {
			    value: "security",
			    name: "security: 🔒  Fixing security issues",
			    emoji: ":lock:",
			    section: "🔒 Security Fixes",
			  },
			];
			
			// eslint-disable-next-line no-undef
			module.exports = commitTypes
		`
	)
}

export default commitizen
