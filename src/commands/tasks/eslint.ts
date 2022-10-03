import { writeObjToRoot } from './../../utils/index'
import { TaskArgs } from '.'

const eslint = ({ devDeps, libs }: TaskArgs) => {
	const { usePrettier, useJest, useTs } = libs

	const eslintConfig: Record<string, any> = {
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			ecmaFeatures: {
				jsx: true,
			},
		},
		plugins: ['simple-import-sort'],
		extends: ['eslint:recommended'],
		rules: {
			strict: ['error', 'never'],
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// Internal packages.
						['^(@|components)(/.*|$)'],
						// Side effect imports.
						['^\\u0000'],
						// Parent imports. Put `..` last.
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						// Other relative imports. Put same-folder imports and `.` last.
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
					],
				},
			],
			'simple-import-sort/exports': 'error',
		},
		env: {
			es6: true,
			browser: true,
		},
	}

	devDeps.push('eslint', 'eslint-plugin-simple-import-sort')

	if (useTs) {
		eslintConfig.parser = '@typescript-eslint/parser'
		eslintConfig.parserOptions.project = './tsconfig.json'
		eslintConfig.plugins.push('@typescript-eslint/eslint-plugin')
		eslintConfig.extends.push(
			'plugin:@typescript-eslint/eslint-recommended',
			'plugin:@typescript-eslint/recommended'
		)
		devDeps.push(
			'@typescript-eslint/eslint-plugin',
			'@typescript-eslint/parser'
		)
	}

	if (useJest) {
		eslintConfig.env.jest = true
	}

	if (usePrettier) {
		devDeps.push('eslint-config-prettier', 'eslint-plugin-prettier')
		eslintConfig.extends.push('plugin:prettier/recommended')
	}

	writeObjToRoot('eslint.config.js', eslintConfig)
}

export default eslint
