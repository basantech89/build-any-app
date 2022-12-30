import regex from '../constants/regex'

import enquirer, { EnquirerOptions } from 'enquirer'
import { runCommandNoExit } from 'utils/cli'

const { Snippet } = enquirer

export declare interface UserInfo {
	name: string
	description?: string
	packageName: string
}

export const getUserInfo = async <T>(
	info: Partial<UserInfo>,
	publishPackage: boolean
): Promise<UserInfo> => {
	const fields: EnquirerOptions<string>['fields'] = []
	let template = ''

	if (!info.name) {
		fields.push({
			name: 'name',
			initial: 'John Doe',
			result: (value?: string) => value?.trim(),
			required: true,
		})

		template += `"Author Name": "\${name}"\n`
	}

	if (!info.description) {
		fields.push({
			name: 'description',
			result: (value?: string) => value?.trim(),
			initial: 'A build-any-app project.',
		})

		template += `"Description(optional)" "\${description}"\n`
	}

	if (publishPackage) {
		if (!info.packageName) {
			fields.push({
				name: 'packageName',
				message: 'unique-package-name',
				required: true,
				result: (value?: string) => value?.trim(),
				validate: async (value: string) => {
					if (regex.space.test(value)) {
						return 'Package name cannot contain spaces.'
					}

					const output = await runCommandNoExit(`npm view ${value}`)
					if (output?.exitCode === 0) {
						return 'Package already exist on npm registry, try a different package name.'
					}

					return true
				},
			})

			template += `"Package Name": "\${packageName}"\n`
		}
	}

	if (fields.length === 0) {
		return info as UserInfo
	}

	const userInfoPrompt = new Snippet<{ values: UserInfo; result: string }>({
		name: 'userInfo',
		message: 'Fill out below fields',
		fields,
		template,
	})

	return userInfoPrompt.run().then(data => ({ ...info, ...data.values }))
}
