import { License } from '../services/git'

import enquirer, { EnquirerOptions } from 'enquirer'

const { Input, MultiSelect, AutoComplete, Password, Confirm } = enquirer

export const repoNamePrompt = (validate: EnquirerOptions<string>['validate']) =>
	new Input({
		name: 'repoName',
		message: 'The Repo/Directory name you want to use for your project?',
		required: true,
		initial: 'my-app',
		result: (value?: string) => value?.trim(),
		validate,
	})

export const publishPackagePrompt = new Confirm({
	name: 'publishPackage',
	message: 'Do you want to publish your package?',
	required: true,
})

export const privateRepoPrompt = new Confirm({
	name: 'privateRepo',
	message: 'Do you want your repository to be private?',
	required: true,
})

export const privatePackagePrompt = new Confirm({
	name: 'privatePackage',
	message: 'Do you want your package to be private?',
	required: true,
})

export const gitProviderChoices = ['github', 'gitlab', 'None'] as const
export type NullableGitProvider = typeof gitProviderChoices[number]
export type GitProvider = Exclude<NonNullable<NullableGitProvider>, 'None'>
export const gitProviderPrompt = new AutoComplete<typeof gitProviderChoices>({
	name: 'gitProvider',
	message: 'The GIT provider you want to use?',
	choices: gitProviderChoices,
})

export const staticToolChoices = [
	'typescript',
	'eslint',
	'prettier',
	'jest',
	'commitizen',
	'husky',
	'None',
] as const
export type StaticTools = Array<typeof staticToolChoices[number]>
export const staticToolsPrompt = new MultiSelect({
	name: 'staticTools',
	message: 'Pick the static tools you want for your application',
	choices: staticToolChoices,
})

export const codeQualityToolsChoices = [
	'codecov',
	'code-climate',
	'None',
] as const
export type CodeQualityTools = Array<typeof codeQualityToolsChoices[number]>
export const codeQualityToolsPrompt = new MultiSelect({
	name: 'codeQualityTools',
	message:
		'Pick the code quality tools you want to integrate with your application',
	choices: codeQualityToolsChoices,
})

export const cicdChoices = ['github-actions', 'circleci', 'None'] as const
export const cicdPrompt = new AutoComplete<typeof cicdChoices>({
	name: 'cicd',
	message: 'The CI-CD you want to use for your application?',
	choices: cicdChoices,
})

export const licenseChoicePrompt = (licenses: License['name'][]) =>
	new AutoComplete<string[]>({
		name: 'licenses',
		message: 'Choose the license for your project',
		choices: licenses,
	})

export const tokenPrompt = new Password({
	name: 'token',
	message: 'Provide your PAT(Personal Access Token) for your GIT Provider',
})

export const npmTokenPrompt = new Password({
	name: 'npmToken',
	message: 'Provide your NPM Token',
})
