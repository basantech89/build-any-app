import { TaskArgs } from 'tasks/index'
import { writeObjToRoot, writeToRoot } from 'utils/fs'

const publish = ({ libs, devDeps }: TaskArgs) => {
	const { useCommitizen } = libs
	devDeps.push('semantic-release')

	if (useCommitizen) {
		devDeps.push(
			'@semantic-release/git',
			'conventional-changelog-conventionalcommits'
		)

		writeToRoot(
			'.releaserc.js',
			`
			const { commitTypes, commitRegex } = require('./commitUtils')

			const parserOpts = {
				headerPattern: commitRegex,
			}
			
			const types = commitTypes.map((type) => ({
			  type: type.value,
			  section: type.section,
			  hidden: !!type.hidden
			}));
			
			module.exports = {
			  branches: [
			    "+([0-9])?(.{+([0-9]),x}).x",
			    "main",
			    "next",
			    "next-major",
			    {
			      name: "alpha",
			      prerelease: true,
			      channel: "alpha"
			    },
			    {
			      name: "beta",
			      prerelease: true,
			      channel: "beta"
			    }
			  ],
			  plugins: [
			    [
			      "@semantic-release/commit-analyzer",
			      {
			        preset: "conventionalcommits",
			        parserOpts,
			        releaseRules: [
			          {
			            type: "hotfix",
			            release: "patch"
			          },
			          {
			            type: "style",
			            release: "patch"
			          },
			          {
			            type: "module",
			            release: "minor"
			          }
			        ]
			      }
			    ],
			    [
			      "@semantic-release/release-notes-generator",
			      {
			        preset: "conventionalcommits",
			        parserOpts,
			        presetConfig: { types }
			      }
			    ],
			    "@semantic-release/changelog",
			    "@semantic-release/npm",
	        [
			      "@semantic-release/git",
			      {
			        message:
			          "🔖 chore(release): \${nextRelease.version} [skip ci]\\n\\n\${nextRelease.notes}"
			      }
			    ],
			    "@semantic-release/github"
			  ]
			}
		`
		)
	} else {
		writeObjToRoot('.releaserc.js', {
			branches: [
				'+([0-9])?(.{+([0-9]),x}).x',
				'main',
				'next',
				'next-major',
				{
					name: 'alpha',
					prerelease: true,
					channel: 'alpha',
				},
				{
					name: 'beta',
					prerelease: true,
					channel: 'beta',
				},
			],
			plugins: [
				'@semantic-release/commit-analyzer',
				'@semantic-release/release-notes-generator',
				'@semantic-release/changelog',
				'@semantic-release/npm',
				'@semantic-release/git',
				'@semantic-release/github',
			],
		})
	}

	if (global.cicd === 'github') {
		writeToRoot(
			'.github/workflows/release.yml',
			`
name: Release
on:
  push:
    branches:
      - main
      - next
      - next-major
      - beta
      - alpha
jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 'lts/*'
          cache: 'yarn'
      - name: Dependencies Installation
        run: yarn install --prefer-offline
      - name: Build
        run: yarn build
      - name: NPM Release
        env:
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: yarn semantic-release
    `
		)
	} else if (global.cicd === 'circleci') {
		writeToRoot(
			'.circleci/release.yml',
			`
version: 2.1
orbs:
  codecov: codecov/codecov@3.2.2

jobs:
  release:
    docker:
      - image: 'circleci/node:latest'
    environment:
      BRANCHES: /main|next|next-major|alpha|beta/
    steps:
      - checkout
      - when:
          condition:
            matches:
              pattern: "main|next|next-major|beta|alpha"
              value: << pipeline.git.branch >>
          steps:
			      - run:
		          name: Dependencies Installation
		          command: yarn install --prefer-offline
			      - run:
		          name: Build
		          command: yarn build
            - run:
              name: NPM Release
              command: yarn semantic-release
workflows:
  version: 2
  deploy:
    jobs:
      - release
			`
		)
	}
}

publish.displayName = 'publish'
export default publish
