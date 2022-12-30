import { simpleGit } from 'simple-git'
import { runCommands } from 'utils/cli'
import { readJsonFromRoot, writeObjToRoot } from 'utils/fs'

const push = async () => {
	const pkgJson = await readJsonFromRoot('package.json')
	pkgJson.scripts.postinstall = 'sort-package-json'
	await writeObjToRoot('package.json', pkgJson)

	await runCommands('yarn sort-package-json')

	const sshOrigin = global.repoSSHUrl

	if (sshOrigin) {
		await simpleGit(global.rootDir)
			.checkoutLocalBranch('build-any-app')
			.add('.')
			.commit(
				'💚 ci(template): build-any-app - add basic building blocks to the app'
			)
			.push(['-u', 'origin', 'build-any-app'])
			.removeRemote('origin')
			.addRemote('origin', sshOrigin)
	}
}

export default push
