import { gracefullyExit } from './handlers'

import { EnquirerOptions, PromptRunner } from 'enquirer'
import fs from 'fs-extra'
import sodium from 'libsodium-wrappers'

export async function setArgument<T>(
	argName: string,
	prompt:
		| ((validate?: EnquirerOptions<T>['validate']) => PromptRunner<T>)
		| PromptRunner<T>,
	arg: T | undefined,
	validate?: EnquirerOptions<T>['validate']
): Promise<T> {
	if (typeof arg === 'undefined') {
		if (global.interactive) {
			arg =
				typeof prompt === 'function'
					? await prompt(validate).run()
					: await prompt.run()
		} else {
			gracefullyExit(new Error(`${argName} is not provided`))
		}
	} else if (validate) {
		const isValueCorrect = await validate(arg)
		if (typeof isValueCorrect === 'string') {
			gracefullyExit(new Error(isValueCorrect))
		}
	}

	return arg as T
}

export const pathExist = async (repoName: string) => {
	const pathString = `${process.cwd()}/${repoName}`
	const pathExist = await fs.pathExists(pathString)
	if (pathExist) {
		return `Path ${pathString} already exist.`
	}

	return true
}

export const encryptSecret = async (key: string, secret: string) => {
	return sodium.ready.then(() => {
		// Convert Secret & Base64 key to Uint8Array.
		const binKey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
		const binSec = sodium.from_string(secret)

		//Encrypt the secret using LibSodium
		const encBytes = sodium.crypto_box_seal(binSec, binKey)

		// Convert encrypted Uint8Array to Base64
		return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
	})
}

const isObject = (obj: any) => {
	if (typeof obj === 'object' && obj !== null) {
		if (typeof Object.getPrototypeOf === 'function') {
			const prototype = Object.getPrototypeOf(obj)
			return prototype === Object.prototype || prototype === null
		}

		return Object.prototype.toString.call(obj) === '[object Object]'
	}

	return false
}

type TUnionToIntersection<U> = (
	U extends any ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never

export const deepMerge = <T extends Record<string, any>[]>(
	...objects: T
): TUnionToIntersection<T[number]> =>
	objects.reduce((result, current) => {
		Object.keys(current).forEach(key => {
			if (Array.isArray(result[key]) && Array.isArray(current[key])) {
				result[key] = Array.from(new Set(result[key].concat(current[key])))
			} else if (isObject(result[key]) && isObject(current[key])) {
				result[key] = deepMerge(result[key], current[key])
			} else {
				result[key] = current[key]
			}
		})

		return result
	}, {}) as any

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
	? `${T}${Capitalize<SnakeToCamelCase<U>>}`
	: S

export type SnakeKeysToCamel<T extends Record<string, any>> = {
	[K in keyof T as SnakeToCamelCase<Extract<K, string>>]: T[K]
}

export const camelCase = (str: string) =>
	str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())

export function toCamelCaseKeys<T extends Record<string, any>>(
	o: T
): SnakeKeysToCamel<T>
export function toCamelCaseKeys<T extends Record<string, any>[]>(
	o: T
): SnakeKeysToCamel<T>[]
export function toCamelCaseKeys<
	T extends Record<string, any> | Record<string, any>[]
>(o: T): SnakeKeysToCamel<T>[] | SnakeKeysToCamel<T> {
	if (o instanceof Array) {
		return o.map(function (value) {
			if (typeof value === 'object') {
				value = toCamelCaseKeys(value)
			}
			return value as SnakeKeysToCamel<T>
		})
	} else {
		const newO: Record<string, any> = {}

		let origKey, newKey, value
		for (origKey in o) {
			if (Object.prototype.hasOwnProperty.call(o, origKey)) {
				newKey = camelCase(origKey)
				value = o[origKey]
				if (
					value instanceof Array ||
					(value !== null && value.constructor === Object)
				) {
					value = toCamelCaseKeys(value)
				}
				newO[newKey] = value
			}
		}
		return newO as SnakeKeysToCamel<T>
	}
}
