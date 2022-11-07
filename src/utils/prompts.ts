import enquirer from 'enquirer'

const { Input, MultiSelect, AutoComplete, Confirm } = enquirer

export const namePrompt = new Input({
	name: 'name',
	message: 'What is your name?',
	initial: 'John Doe',
})

export const staticToolChoices = [
	'typescript',
	'eslint',
	'prettier',
	'jest',
	'commitizen',
	'husky',
]
export const staticToolsPrompt = new MultiSelect({
	name: 'staticTools',
	message: 'Pick the static tools you want for your application',
	choices: staticToolChoices,
})

export const projectNamePrompt = new Input({
	name: 'projectName',
	message: 'Project Name',
	required: true,
})

const cicdChoices = ['github-actions', 'circleci', 'None']
export const cicdPrompt = new AutoComplete({
	name: 'cicd',
	message: 'The CI-CD you want to use for your application?',
	choices: cicdChoices,
})

export const privateProjectPrompt = new Confirm({
	name: 'privateProject',
	message: 'Is your project private?',
})
