import { TaskArgs } from '..'

import setupUI from './setup'

const uiTask = ({ deps, devDeps, libs }: TaskArgs) => {
	const { uiLib, globalStateLib, useJest } = libs

	if (uiLib === 'react-bootstrap') {
		deps.push('bootstrap', 'react-bootstrap', 'react-bootstrap-icons')
		devDeps.push('sass')
	}

	const ui = setupUI()
	ui.layouts()
		.components()
		.pages(useJest, globalStateLib)
		.assets(uiLib)
		.containers()
}

uiTask.displayName = 'uiTask'
export default uiTask
