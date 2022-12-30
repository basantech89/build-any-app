import { WebArguments } from '../commands/web'

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

import contribution from 'tasks/contribution'
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
		useHusky: boolean
		useCodecov: boolean
		useCodeClimate: boolean
		framework?: string
		uiLib?: string
		globalStateLib?: string
	}
}

declare interface Task {
	(props: TaskArgs): Promise<void> | void
	displayName: string
}

const createTasks = (
	staticTools: NonNullable<WebArguments['staticTools']>,
	codeQualityTools: NonNullable<WebArguments['codeQualityTools']>,
	frameworkUsed: WebArguments['framework'],
	uiLib: WebArguments['ui'],
	globalStateLib: WebArguments['stateLibrary']
): { tasks: ReturnType<Task>[]; deps: string[]; devDeps: string[] } => {
	const deps: string[] = []
	const devDeps: string[] = []

	const libs = {
		useTs: staticTools.includes('typescript'),
		useEslint: staticTools.includes('eslint'),
		useJest: staticTools.includes('jest'),
		usePrettier: staticTools.includes('prettier'),
		useBabel: true,
		useCommitizen: staticTools.includes('commitizen'),
		useHusky: staticTools.includes('husky'),
		useCodecov: codeQualityTools.includes('codecov'),
		useCodeClimate: codeQualityTools.includes('code-climate'),
		framework: frameworkUsed,
		uiLib,
		globalStateLib,
	}

	const tasksToPerform = ['babel', 'contribution']

	if (!staticTools.includes('None')) {
		tasksToPerform.push(...staticTools)
	}

	if (
		global.gitProvider !== 'None' &&
		global.cicd !== 'None' &&
		!codeQualityTools.includes('None')
	) {
		tasksToPerform.push('cicd')
		if (global.publishPackage) {
			tasksToPerform.push('publish')
		}
	}

	if (frameworkUsed) {
		tasksToPerform.push('framework')
	}

	if (uiLib) {
		tasksToPerform.push('uiTask')
	}

	const tasks = [
		framework,
		eslint,
		prettier,
		jestTask,
		babel,
		typescript,
		uiTask,
		commitizen,
		husky,
		cicd,
		publish,
		contribution,
	]

	const filterTasks = (task: Task) => tasksToPerform.includes(task.displayName)

	return {
		tasks: tasks.filter(filterTasks).map(task => task({ libs, deps, devDeps })),
		deps,
		devDeps,
	}
}

export default createTasks
