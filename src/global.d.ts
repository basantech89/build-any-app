/* eslint-disable no-var */
import { License, User } from './services/git'
import { BaseArguments } from './create-app'

import { UserInfo } from 'utils/prompts'

declare global {
	var rootDir: string
	var cicd: string | undefined
	var useTs: boolean
	var interactive: boolean
	var repoName: string
	var privatePackage: boolean | undefined
	var privateRepo: boolean | undefined
	var publishPackage: boolean | undefined
	var gitProvider: NonNullable<BaseArguments['provider']>
	var user: (User & UserInfo) | undefined
	var license: License | undefined
	var repoSSHUrl: string | undefined
	var debug: boolean | undefined
}

export {}
