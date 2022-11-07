export declare type PromptRunner<T> = {
	run: () => Promise<T>
}

declare type Options<T> = {
	name: string
	message: string
	initial?: T
	required?: boolean
	choices?: string[]
}

declare type Prompt<T> = {
	new (options: Options<T>): PromptRunner<T>
}

declare module 'enquirer' {
	export const AutoComplete: Prompt<string>
	export const Input: Prompt<string>
	export const MultiSelect: Prompt<Array<string>>
	export const Confirm: Prompt<boolean>
}

export {}
