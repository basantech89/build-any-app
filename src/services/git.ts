import apiService from './api'

import { simpleGit } from 'simple-git'
import { runCommands } from 'utils/cli'
import { gracefullyExit } from 'utils/handlers'
import { encryptSecret } from 'utils/index'

declare interface URLMap {
	list: {
		gitlab: (userId: number) => string
		github: (page: number, per_page: number) => string
	}
	user: {
		gitlab: string
		github: string
	}
	repo: {
		gitlab: (projectId: number) => string
		github: (username: string, repoName: string) => string
	}
	baseUrl: {
		gitlab: string
		github: string
	}
	create: {
		gitlab: (userId: number) => string
		github: string
	}
	repoSecret: {
		github: (owner: string, repoName: string, secretName: string) => string
		gitlab: (projectId: string) => string
	}
	getPublicKey: {
		github: (owner: string, repoName: string) => string
	}
	licenses: {
		gitlab: string
	}
	deleteRepo: {
		github: (owner: string, repoName: string) => string
		gitlab: (projectId: string) => string
	}
}

export const urlMap: URLMap = {
	baseUrl: {
		gitlab: 'https://gitlab.com/api/v4',
		github: 'https://api.github.com',
	},
	list: {
		gitlab: userId => `users/${userId}/projects`,
		github: (page, per_page = 30) =>
			`user/repos?page=${page}&per_page=${per_page}`,
	},
	user: {
		gitlab: 'user',
		github: 'user',
	},
	repo: {
		gitlab: projectId => `user/${projectId}`,
		github: (username, repoName) => `repos/${username}/${repoName}`,
	},
	licenses: {
		gitlab: 'templates/licenses',
	},
	create: {
		github: 'user/repos',
		gitlab: userId => `projects/user/${userId}`,
	},
	getPublicKey: {
		github: (owner: string, repoName: string) =>
			`repos/${owner}/${repoName}/actions/secrets/public-key`,
	},
	repoSecret: {
		github: (owner: string, repoName: string, secretName: string) =>
			`repos/${owner}/${repoName}/actions/secrets/${secretName}`,
		gitlab: projectId => `projects/${projectId}/variables`,
	},
	deleteRepo: {
		github: (owner: string, repoName: string) => `repos/${owner}/${repoName}`,
		gitlab: projectId => `projects/${projectId}`,
	},
}

declare type Repo = {
	id: string
	name: string
	full_name: string
	http_url: string
	ssh_url: string
	web_url: string
	default_branch: string
	private: boolean
}

declare type GithubRepo = {
	id: string
	name: string
	full_name: string
	clone_url: string
	ssh_url: string
	html_url: string
	default_branch: string
	private: boolean
}

declare type GitlabRepo = {
	id: string
	name: string
	path_with_namespace: string
	http_url_to_repo: string
	ssh_url_to_repo: string
	web_url: string
	default_branch: string
	visibility: string
}

export declare type License = {
	key: string
	name: string
	html_url: string
	source_url: string | null
	description: string
	conditions: string[]
	permissions: string[]
	limitations: string[]
	content: string
}

declare type GithubPublicKey = {
	key_id: string
	key: string
}

declare type Provider = 'github' | 'gitlab'

export declare type User = {
	id: number
	username: string
	name: string
	avatar_url: string
	web_url: string
	email: string
}

declare type GithubUser = {
	login: User['username']
	html_url: User['web_url']
} & Omit<User, 'username' | 'web_url'>

declare type GitlabUser = User

const mapGithubUser = (user: GithubUser): User => {
	return {
		...user,
		username: user.login,
		web_url: user.html_url,
	}
}

const mapGitlabUser = (user: GitlabUser): User => user

const mapGithubRepo = (repo: GithubRepo): Repo => ({
	id: repo.id,
	name: repo.name,
	full_name: repo.full_name,
	http_url: repo.clone_url,
	ssh_url: repo.ssh_url,
	web_url: repo.html_url,
	default_branch: repo.default_branch,
	private: repo.private,
})

const mapGitlabRepo = (repo: GitlabRepo): Repo => ({
	id: repo.id,
	name: repo.name,
	full_name: repo.path_with_namespace,
	http_url: repo.http_url_to_repo,
	ssh_url: repo.ssh_url_to_repo,
	web_url: repo.web_url,
	default_branch: repo.default_branch,
	private: repo.visibility === 'private',
})

const gitService = (gitProvider: Provider, token?: string) => {
	const api = apiService(token)
	let user: User
	let repos: Repo[]
	let repo: Repo
	let licenses: License[]

	const getUser = async () => {
		const data = await api.get<any>(urlMap.user[gitProvider])
		if (gitProvider === 'github') {
			return mapGithubUser(data)
		}

		return mapGitlabUser(data)
	}

	const mapRepo = (repo: any) => {
		if (gitProvider === 'github') {
			return mapGithubRepo(repo)
		} else if (gitProvider === 'gitlab') {
			return mapGitlabRepo(repo)
		}
		return mapGithubRepo(repo)
	}

	const listRepos = async () => {
		let localRepos = []

		if (gitProvider === 'github') {
			const githubUrl = urlMap.list.github(1, 100)
			localRepos = await api.get<Repo[]>(githubUrl)
		} else {
			if (!user?.id) {
				user = await getUser()
			}

			const gitlabUrl = urlMap.list.gitlab(user.id)
			localRepos = await api.get<Repo[]>(gitlabUrl)
		}

		localRepos = localRepos.map(mapRepo)

		repos = localRepos
		return localRepos
	}

	const getRepo = async (repoName: string) => {
		if (!user?.id) {
			user = await getUser()
		}

		if (gitProvider === 'github') {
			const url = urlMap.repo.github(user.username, repoName)
			const repo = await api.get<Repo>(url)
			return mapRepo(repo)
		} else {
			const repos = await listRepos()
			return repos.find(repo => repo.name === repoName)
		}
	}

	const repoExist = async (repoName: string) => {
		const repo = await getRepo(repoName)
		return !!repo?.name
	}

	const getLicenses = async () => {
		const url = urlMap.licenses.gitlab
		licenses = await api.get<License[]>(url, 'gitlab')
		return licenses
	}

	const getLicense = async (licenseKey: string) => {
		if (!(licenses || [])?.length) {
			await getLicenses()
		}
		return (licenses || []).find(license => license.key === licenseKey)
	}

	const createRepo = async () => {
		const userInfo = global.user
		const options: any = { name: global.repoName }

		if (gitProvider === 'github') {
			options.private = Boolean(global?.privatePackage)
		} else {
			options.user_id = userInfo.user_id
			options.visibility = global?.privatePackage ? 'private' : 'public'
		}

		if (userInfo && 'description' in userInfo) {
			options.description = userInfo.description
		}

		const url =
			gitProvider === 'github'
				? urlMap.create.github
				: urlMap.create.gitlab(userInfo.use)
		const data = await api.post(url, options)
		repo = mapRepo(data)
		return repo
	}

	const initialize = async () => {
		try {
			const repo = await createRepo()

			const [port, suffix] = repo.http_url.split('://')
			const remote = `${port}://${token}@${suffix}`

			await simpleGit(global.rootDir)
				.addRemote('origin', remote)
				.push(['-u', 'origin', 'main'])

			return repo
		} catch (e) {
			gracefullyExit(e as Error)
		}
	}

	const getPublicKey = (repoName: string) =>
		api.get<GithubPublicKey>(
			urlMap.getPublicKey.github(user.username, repoName)
		)

	const createRepoSecret = async (secretName: string, secret: string) => {
		const repoName = repo.name
		if (gitProvider === 'github') {
			const publicKey = await getPublicKey(repoName)
			const encryptedValue = await encryptSecret(publicKey.key, secret)
			return api.put(
				urlMap.repoSecret.github(user.username, repoName, secretName),
				{
					owner: user.username,
					repo: repoName,
					secret_name: secretName,
					encrypted_value: encryptedValue,
					key_id: publicKey.key_id,
				}
			)
		} else {
			return api.post(urlMap.repoSecret.gitlab(repo.id), {
				key: secretName,
				value: secret,
			})
		}
	}

	const deleteRepo = () => {
		if (gitProvider === 'github') {
			return api.remove(urlMap.deleteRepo.github(user.username, repo.name))
		} else {
			return api.remove(urlMap.deleteRepo.gitlab(repo.id))
		}
	}

	return {
		getUser,
		listRepos,
		repoExist,
		getRepo,
		getLicenses,
		getLicense,
		createRepo,
		initialize,
		createRepoSecret,
		deleteRepo,
	}
}

export default gitService
