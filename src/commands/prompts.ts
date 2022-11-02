import enquirer from 'enquirer'

// @ts-ignore
const { AutoComplete } = enquirer

export const frameworks = ['react']
export const frameworkPrompt = new AutoComplete({
	name: 'framework',
	message: 'The framework you want to use for your web application?',
	choices: frameworks,
})

export const uiLibs = [
	'awesome-ui',
	'material-ui',
	'chakra',
	'reactstrap',
	'react-bootstrap',
]
export const uiLibPrompt = new AutoComplete({
	name: 'ui',
	message: 'The UI library you want to use for your web application?',
	choices: uiLibs,
})

export const globalStates = ['redux', 'zustand']
export const globalStateLibPrompt = new AutoComplete({
	name: 'stateLibrary',
	message:
		'The global state management library you want to use for your web application?',
	choices: globalStates,
})
