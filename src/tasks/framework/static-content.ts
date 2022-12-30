import createPublicDir from './public'

import { writeToRoot } from 'utils/fs'

export declare interface StaticContent {
	public: () => StaticContent
	gitignore: () => StaticContent
	env: () => StaticContent
	readme: () => StaticContent
	license: () => StaticContent
}

const createStaticContent = (
	useTs: boolean,
	useCommitizen: boolean,
	useJest: boolean,
	useEslint: boolean,
	usePrettier: boolean,
	useHusky: boolean,
	uiLib?: string
): StaticContent => {
	const license = global.license
	const publishPackage = global.publishPackage
	const repoName = global.repoName
	const packageName = global?.user?.packageName
	const gitProvider = global.gitProvider
	const cicd = global.cicd

	writeToRoot(
		'CODE_OF_CONDUCT.md',
		`
# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, caste, color, religion, or sexual
identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

* Demonstrating empathy and kindness toward other people
* Being respectful of differing opinions, viewpoints, and experiences
* Giving and gracefully accepting constructive feedback
* Accepting responsibility and apologizing to those affected by our mistakes,
  and learning from the experience
* Focusing on what is best not just for us as individuals, but for the overall
  community

Examples of unacceptable behavior include:

* The use of sexualized language or imagery, and sexual attention or advances of
  any kind
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or email address,
  without their explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

Community leaders have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct, and will communicate reasons for moderation
decisions when appropriate.

## Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.
Examples of representing our community include using an official e-mail address,
posting via an official social media account, or acting as an appointed
representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at
[INSERT CONTACT METHOD].
All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the
reporter of any incident.

## Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining
the consequences for any action they deem in violation of this Code of Conduct:

### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed
unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing
clarity around the nature of the violation and an explanation of why the
behavior was inappropriate. A public apology may be requested.

### 2. Warning

**Community Impact**: A violation through a single incident or series of
actions.

**Consequence**: A warning with consequences for continued behavior. No
interaction with the people involved, including unsolicited interaction with
those enforcing the Code of Conduct, for a specified period of time. This
includes avoiding interactions in community spaces as well as external channels
like social media. Violating these terms may lead to a temporary or permanent
ban.

### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including
sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public
communication with the community for a specified period of time. No public or
private interaction with the people involved, including unsolicited interaction
with those enforcing the Code of Conduct, is allowed during this period.
Violating these terms may lead to a permanent ban.

### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community
standards, including sustained inappropriate behavior, harassment of an
individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within the
community.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.1, available at
[https://www.contributor-covenant.org/version/2/1/code_of_conduct.html][v2.1].

Community Impact Guidelines were inspired by
[Mozilla's code of conduct enforcement ladder][Mozilla CoC].

For answers to common questions about this code of conduct, see the FAQ at
[https://www.contributor-covenant.org/faq][FAQ]. Translations are available at
[https://www.contributor-covenant.org/translations][translations].

[homepage]: https://www.contributor-covenant.org
[v2.1]: https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
[Mozilla CoC]: https://github.com/mozilla/diversity
[FAQ]: https://www.contributor-covenant.org/faq
[translations]: https://www.contributor-covenant.org/translations

		`
	)

	writeToRoot(
		'CONTRIBUTING.md',
		`
# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request)

## Project setup

1.  Fork and clone the repo
2.  \`npm run setup\` to setup and validate your clone of the project
3.  Create a branch for your PR

> Tip: Keep your \`main\` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
${
	gitProvider !== 'None'
		? `
> \`\`\`
> git remote add upstream https://${gitProvider}.com/${user?.username}/${repoName}.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> \`\`\`
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local \`main\`
> branch to use the upstream main branch whenever you run \`git pull\`. Then you
> can make all of your pull request branches based on this \`main\` branch.
> Whenever you want to update your version of \`main\`, do a regular \`git pull\`.
`
		: ''
}

## Committing and Pushing changes

Please make sure to run the tests before you commit your changes. Make
sure to include changes (if they exist) in your commit.

### Tests

There are quite a few test scripts that run as part of a \`validate\` script in
this project:

${
	useEslint
		? `
- lint - ESLint stuff, pretty basic. Please fix any errors/warnings :)
`
		: ''
}
- build - This builds the \`${repoName}\`
${
	useJest
		? `
- test:coverage - This is primarily unit tests on the source code and accounts for
  most of the coverage. These tests live in \`src/__tests__\`
`
		: ''
}
${
	useTs
		? `
- check-types - This runs \`tsc\` on the codebase to make sure the type script
  definitions are correct for the \`ts\` files.
`
		: ''
}
${
	usePrettier
		? `
- check:format - This ensures the formatting for the files through prettier
`
		: ''
}

${
	useHusky
		? `
### git hooks

There are git hooks set up with this project that are automatically installed
when you install dependencies. They're really handy, and run when you commit
the changes. Following are the hooks

- pre-commit - This tries to fix any warnings/errors if any through eslint and prettier
${
	useCommitizen
		? `
- commit-msg - This ensures that your commit message adheres to our convention which is based on [conventional-changelog-conventionalcommits](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits).
    - Your commit message should start with a [gitmoji](https://gitmoji.dev/)
    - Other rules are similiar to [conventional-changelog-angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)
`
		: ''
}

`
		: ''
}

## Help needed

Please checkout the [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

[egghead]:
https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github
[all-contributors]: https://github.com/kentcdodds/all-contributors
${
	gitProvider !== 'None'
		? `
[issues]: https://${gitProvider}.com/${user?.username}/${repoName}/issues
`
		: ''
}

		`
	)

	return {
		public: createPublicDir,
		gitignore: function () {
			writeToRoot(
				'.gitignore',
				`
          # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

          # dependencies
          /node_modules
          /.pnp
          .pnp.js

          # testing
          /coverage
					/src/coverage

          # production
          /build

          # IDEs
          .idea
					.fleet

          # misc
          .DS_Store
          .env.local
          .env.development.local
          .env.test.local
          .env.production.local

          npm-debug.log*
          yarn-debug.log*
          yarn-error.log*
	      `
			)

			return this
		},
		env: function () {
			writeToRoot('.env', `REACT_APP_API_BASE=http://localhost:3001`)
			return this
		},
		license: function () {
			if (license) {
				writeToRoot('LICENSE', license.content, { ignorePrettier: true })
			}

			return this
		},
		readme: function () {
			writeToRoot(
				'README.md',
				`
# Getting Started with Build Any App
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors][all-contrib-badge]](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

${
	useCommitizen ? `[![Commitizen friendly][commitizen-badge]][commitizen]` : ''
}${cicd === 'github' ? `[![Build][build-badge]][build]` : ''}${
					useTs ? `![ts][ts-badge]` : ''
				}
[![Contributor Covenant][coc-badge]][coc]
[![PRs Welcome][prs-badge]][make-pr]${
					publishPackage
						? `[![downloads][downloads-badge]][npmcharts]
[![version][version-badge]][package]
[![semantic-release: conventionalcommits][semantic-release-badge]][semantic-release]`
						: ''
				}

This project was bootstrapped with [Create App](https://github.com/basantech89/create-app).

## Available Scripts

In the project directory, you can run:

### \`npm start\`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### \`npm test\`

Launches the test runner in the interactive watch mode if not running in ci, else provides coverage.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### \`npm run build\`

Builds the app for production to the \`build\` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### \`npm run eject\`

**Note: this is a one-way operation. Once you \`eject\`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can \`eject\` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except \`eject\` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use \`eject\`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### \`npm run validate\`

It validates the project by running test:coverage, ${
					!useTs ? 'and' : ''
				} check-format ${useTs ? 'and check-types' : ''} scripts in parallel.

${
	useCommitizen
		? `
### \`npm run commit\`

uses git-cz to commit to adhere to conventional-changelog-commits and used commitlint to enforce the commits with emojis.

Look at https://www.conventionalcommits.org/en/v1.0.0/ for more info.
Look at https://gitmoji.dev/ for all the emojis.
`
		: ''
}

${
	publishPackage
		? `
### \`npm run semantic-release\`

used in CI/CD environment to publish your package.

Look at https://semantic-release.gitbook.io/ for more info.
`
		: ''
}

${
	useJest
		? `
### \`npm run lint\`

Run the jest runner for eslint.

`
		: ''
}

${
	useEslint
		? `
### \`npm run lint:fix\`

Fix all the eslint auto-fixable issues.

`
		: ''
}

${
	usePrettier
		? `
### \`npm run format\`

Format the files using prettier.

`
		: ''
}

${
	usePrettier
		? `
### \`npm run check-format\`

Check if formatting is correct.

`
		: ''
}

## Libs

Following production dependencies are installed by Build Any App

	- react
	- react-dom 											
	- react-router-dom 	
	- react-hook-form 									To work with forms
	- @hookform/resolvers 								Form field validation with resolvers like yup/zod
	- yup 												Form field validation library
	- classnames 										Assign class names dynamically
	- recoil 											Internal state management library

${
	uiLib
		? `
## UI Lib

${uiLib} is used as the UI library.

${
	uiLib === 'react-bootstrap'
		? "react-app-rewired is used to change the webpack configuration to use webpack's lazyStyleTag feature so styles can be imported lazily. See config-overrides.js file and [lazyStyleTag](https://webpack.js.org/loaders/style-loader/#lazystyletag to know more)."
		: ''
}

`
		: ''
}		

## Learn More

You can learn more in the [Build Any App documentation](https://github.com/basantech89/create-app).

To learn React, check out the [React documentation](https://reactjs.org/).

# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/basantech89"><img src="https://avatars.githubusercontent.com/u/30287271?v=4?s=100" width="100px;" alt="Basant Soni"/><br /><sub><b>Basant Soni</b></sub></a><br /><a href="https://github.com/basantech89/create-app/issues?q=author%3Abasantech89" title="Bug reports">🐛</a> <a href="#blog-basantech89" title="Blogposts">📝</a> <a href="https://github.com/basantech89/create-app/commits?author=basantech89" title="Code">💻</a> <a href="#data-basantech89" title="Data">🔣</a> <a href="https://github.com/basantech89/create-app/commits?author=basantech89" title="Documentation">📖</a> <a href="#design-basantech89" title="Design">🎨</a> <a href="#example-basantech89" title="Examples">💡</a> <a href="#ideas-basantech89" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-basantech89" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/basantech89/create-app/pulls?q=is%3Apr+reviewed-by%3Abasantech89" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/basantech89/create-app/commits?author=basantech89" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

${
	license
		? `
# LICENSE

${license.name}
`
		: ''
}

[all-contrib-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[make-pr]: https://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg
[coc]: https://github.com/basantech89/build-any-app/blob/master/CODE_OF_CONDUCT.md
${
	useCommitizen
		? `
[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen]: http://commitizen.github.io/cz-cli/
`
		: ''
}

${
	useTs
		? `
[ts-badge]: https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label
`
		: ''
}

${
	publishPackage
		? `
[downloads-badge]: https://img.shields.io/npm/dm/${packageName}.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/${packageName}
[package]: https://www.npmjs.com/package/${packageName}
[version-badge]: https://img.shields.io/npm/v/${packageName}.svg?style=flat-square
[semantic-release-badge]: https://img.shields.io/badge/semantic--release-conventionalcommits-ff69b4?logo=semantic-release
[semantic-release]: https://github.com/semantic-release/semantic-release
`
		: ''
}

${
	cicd === 'github'
		? `
[build-badge]: https://github.com/${user?.username}/${repoName}/actions/workflows/build.yml/badge.svg
[build]: https://github.com/${user?.username}/${repoName}/actions/workflows/build.yml
`
		: ''
}

      `
			)

			return this
		},
	}
}

export default createStaticContent
