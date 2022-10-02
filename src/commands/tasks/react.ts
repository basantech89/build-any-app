import { TaskCommon } from './index'

declare interface TaskReact extends TaskCommon {
	useTs: boolean
}

const react = ({ deps, devDeps, useTs }: TaskReact) => {
	deps.push(
		'react',
		'react-dom',
		'react-router-dom',
		'react-hook-form',
		'classnames'
	)
	devDeps.push('react-scripts')

	if (useTs) {
		devDeps.push('@types/react', '@types/react-dom', '@types/react-router-dom')
	}
}

export default react
