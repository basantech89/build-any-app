import babel from './babel'
import cicd from './cicd'
import commitizen from './commitizen'
import eslint from './eslint'
import framework from './framework'
import husky from './husky'
import jestTask from './jest'
import prettier from './prettier'
import typescript from './typescript'
import uiTask from './ui'

import publish from 'tasks/publish'

export interface TaskCommon {
	deps: string[]
	devDeps: string[]
}

export declare interface TaskArgs extends TaskCommon {
	libs: {
		useTs: boolean
		useJest: boolean
		usePrettier: boolean
		useEslint: boolean
		useBabel: boolean
		useCommitizen: boolean
		framework?: string
		uiLib?: string
		globalStateLib?: string
	}
}

declare type Task<T> = () => T
declare type TaskFn = (tools: TaskArgs) => void

declare type Tasks = {
	framework: Task<Tasks>
	eslint: Task<Tasks>
	jest: Task<Tasks>
	prettier: Task<Tasks>
	babel: Task<Tasks>
	typescript: Task<Tasks>
	ui: Task<Tasks>
	commitizen: Task<Tasks>
	husky: Task<Tasks>
	cicd: Task<Tasks>
	publish: Task<Tasks>
} & TaskCommon

declare type ExtraTools = {
	framework?: string
	uiLib?: string
	globalStateLib?: string
}

const createTasks = (tools: string[], extraTools: ExtraTools): Tasks => {
	const deps: string[] = []
	const devDeps: string[] = []

	const libs = {
		useTs: tools.includes('typescript'),
		useEslint: tools.includes('eslint'),
		useJest: tools.includes('jest'),
		usePrettier: tools.includes('prettier'),
		useBabel: true || tools.includes('babel'),
		useCommitizen: tools.includes('commitizen'),
		...extraTools,
	}

	const tasks = {
		uiTask: extraTools.uiLib,
		jestTask: tools.includes('jest'),
		framework: extraTools.framework,
		cicd: global.cicd !== 'None',
		publish: global.publishProject,
	}

	function createTask(taskFn: TaskFn): () => Tasks {
		const taskName = taskFn.name
		const isTaskAllowed =
			tools.includes(taskName) ||
			(taskName in tasks && !!tasks[taskName as keyof typeof tasks])

		return function (this: Tasks) {
			if (isTaskAllowed) {
				taskFn({ deps, devDeps, libs })
			}

			return this
		}
	}

	return {
		deps,
		devDeps,
		eslint: createTask(eslint),
		jest: createTask(jestTask),
		prettier: createTask(prettier),
		babel: createTask(babel),
		typescript: createTask(typescript),
		framework: createTask(framework),
		ui: createTask(uiTask),
		commitizen: createTask(commitizen),
		husky: createTask(husky),
		cicd: createTask(cicd),
		publish: createTask(publish),
	}
}

export default createTasks
