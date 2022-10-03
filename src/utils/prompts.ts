import enquirer from 'enquirer'

// @ts-ignore
const { Input, MultiSelect } = enquirer

export const staticToolsPrompt = new MultiSelect({
	name: 'staticTools',
	message: 'Pick the static tools you want for your application',
	choices: [
		'typescript',
		'eslint',
		'prettier',
		'jest',
		'husky',
		'commitizen',
		'commitlint',
	],
})

export const projectNamePrompt = new Input({
	type: 'input',
	name: 'projectName',
	message: 'Project Name',
	required: true,
})
