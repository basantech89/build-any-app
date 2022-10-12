import { TaskArgs } from '../index'

import setupUI from './setup'

const uiTask = ({ libs }: TaskArgs) => {
	const { ui: uiLib } = libs

	const ui = setupUI()
	ui.layouts().components().pages().assets(uiLib)
}

export default uiTask
