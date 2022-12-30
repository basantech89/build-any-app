import { copyToRoot } from 'utils/fs'

const cwd = process.cwd()

const buildDir = 'dist'

copyToRoot(
	`${cwd}/src/tasks/framework/public/favicon.ico`,
	`${cwd}/${buildDir}/tasks/framework/public/favicon.ico`,
	true
)
copyToRoot(
	`${cwd}/src/tasks/framework/public/logo192.png`,
	`${cwd}/${buildDir}/tasks/framework/public/logo192.png`,
	true
)
copyToRoot(
	`${cwd}/src/tasks/framework/public/logo512.png`,
	`${cwd}/${buildDir}/tasks/framework/public/logo512.png`,
	true
)
copyToRoot(
	`${cwd}/src/tasks/ui/setup/assets/icons`,
	`${cwd}/${buildDir}/tasks/ui/setup/assets/icons`,
	true
)
copyToRoot(
	`${cwd}/src/tasks/ui/setup/assets/logos`,
	`${cwd}/${buildDir}/tasks/ui/setup/assets/logos`,
	true
)
