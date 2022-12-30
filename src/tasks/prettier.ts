import { TaskArgs } from '.'

import { Options } from 'prettier'
import { writeObjToRoot } from 'utils/fs'

export const prettierConfig: Options = {
	arrowParens: 'avoid',
	bracketSpacing: true,
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxBracketSameLine: false,
	jsxSingleQuote: false,
	printWidth: 80,
	proseWrap: 'always',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'none',
	useTabs: true,
}

const prettier = ({ devDeps }: TaskArgs) => {
	devDeps.push('prettier')
	writeObjToRoot('prettier.config.js', prettierConfig)
}

prettier.displayName = 'prettier'
export default prettier
