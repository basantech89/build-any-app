import { User } from '../services/git'

import { writeObjToRoot } from 'utils/fs'
import { greenLogger, warmLogger } from 'utils/logger'
import { UserInfo } from 'utils/userInfoPrompt'

const config = (user: User & UserInfo) => ({
	projectName: user.packageName,
	projectOwner: user.username,
	repoType: global.gitProvider,
	repoHost: `https://${global.gitProvider}.com`,
	files: ['README.md'],
	imageSize: 100,
	commit: false,
	commitConvention: 'gitmoji',
	commitTemplate:
		"<%= prefix %> docs(contribution): <%= (newContributor ? 'Add' : 'Update') %> @<%= username %> as a contributor [skip ci]",
	contributors: [
		{
			login: user.username,
			name: user.name,
			avatar_url: user.avatar_url,
			profile: user.web_url,
			contributions: [
				'bug',
				'blog',
				'code',
				'data',
				'doc',
				'design',
				'example',
				'ideas',
				'infra',
				'review',
				'test',
			],
		},
	],
	contributorsPerLine: 7,
	linkToUsage: true,
})

const contribution = () => {
	const user = global.user
	if (user) {
		writeObjToRoot('.all-contributorsrc', config(user))
		greenLogger.silly(
			'You can use all contributors bot or cli to add contributors, visit https://allcontributors.org to know more'
		)
	} else {
		warmLogger.warning(
			'User info is not found. Ensure that a git provider is provided to fetch the user info.'
		)
	}
}

contribution.displayName = 'contribution'
export default contribution
