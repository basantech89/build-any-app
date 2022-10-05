import { TaskArgs } from '../index'

import setupUI from './setup'

const uiTask = ({ deps, devDeps, libs }: TaskArgs) => {
	const ui = setupUI()
	ui.layouts()
}

export default uiTask
