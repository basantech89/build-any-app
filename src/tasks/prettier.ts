import { TaskArgs } from '.'

import { Options } from 'prettier'
import { writeObjToRoot } from 'utils'

export const prettierConfig: Options = {
	arrowParens: 'avoid',
	bracketSpacing: true,
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxBracketSameLine: false,
	jsxSingleQuote: false,
	printWidth: 100,
	proseWrap: 'always',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'none',
	useTabs: false,
}

const prettier = ({ devDeps }: TaskArgs) => {
	devDeps.push('prettier')
	writeObjToRoot('prettier.config.js', prettierConfig)
}

export default prettier
