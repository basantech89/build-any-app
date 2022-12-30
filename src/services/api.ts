import { urlMap } from './git'

import fetch, { RequestInit } from 'node-fetch'
import { GitProvider } from 'utils/prompts'

export const constructUrl = (url: string, provider?: GitProvider) => {
	let gitProvider = provider
	if (!gitProvider) {
		if (global.gitProvider && global.gitProvider !== 'None') {
			gitProvider = global.gitProvider
		} else {
			gitProvider = 'github'
		}
	}

	return `${urlMap.baseUrl[gitProvider]}/${url}`
}

const getHeaders = (token?: string) => {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	return headers
}

declare interface APICallOptions<D> {
	method: RequestInit['method']
	data?: D
	provider?: GitProvider
}

const apiService = (token?: string) => {
	async function apiCall<R, D = undefined>(
		url: string,
		options: APICallOptions<D>
	): Promise<R> {
		try {
			const headers = getHeaders(token)

			const fetchOptions: RequestInit = {
				method: options.method,
				headers,
			}

			if (options.data) {
				fetchOptions.body = JSON.stringify(options.data)
			}

			const response = await fetch(
				constructUrl(url, options.provider),
				fetchOptions
			)
			return await response.json()
		} catch (e) {
			throw new Error(e as string)
		}
	}

	const get = <R>(url: string, provider?: GitProvider) =>
		apiCall<R>(url, { method: 'GET', provider })

	const post = <R, D = unknown>(url: string, data: D, provider?: GitProvider) =>
		apiCall<R, D>(url, { method: 'POST', data, provider })

	const patch = <R, D = unknown>(
		url: string,
		data: D,
		provider?: GitProvider
	) => apiCall<R, D>(url, { method: 'PATCH', data, provider })

	const put = <R, D = unknown>(url: string, data: D, provider?: GitProvider) =>
		apiCall<R, D>(url, { method: 'PUT', data, provider })

	const remove = <R>(url: string, provider?: GitProvider) =>
		apiCall<R>(url, { method: 'DELETE', provider })

	return {
		get,
		post,
		patch,
		remove,
		put,
	}
}

export default apiService
