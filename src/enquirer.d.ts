export declare type PromptRunner<T> = {
	run: () => Promise<T>
}

type OptionalPromise<T> = Promise<T> | T

export declare type EnquirerOptions<T = string> = {
	name: string
	message?: string
	initial?: T
	required?: boolean
	choices?: T
	type?: string
	validate?: (value: T) => OptionalPromise<boolean | string>
	result?: (value?: T) => T | undefined
	fields?: Array<EnquirerOptions<T>>
	template?: string
}

declare type Prompt<T> = {
	new (options: EnquirerOptions<T>): PromptRunner<T>
}

declare module 'enquirer' {
	export class AutoComplete<T> {
		constructor(options: EnquirerOptions<T>) {}
		run: () => Promise<T[number]>
	}
	export class Snippet<T> {
		constructor(options: EnquirerOptions) {}
		run: () => Promise<T>
	}
	export const Input: Prompt<string>
	export class MultiSelect<T> {
		constructor(options: EnquirerOptions<T>) {}
		run: () => Promise<T[number][]>
	}
	export const Confirm: Prompt<boolean>
	export const Password: Prompt<string>
}

export {}
