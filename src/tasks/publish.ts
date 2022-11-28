import { TaskArgs } from 'tasks/index'
import { greenLogger, writeObjToRoot, writeToRoot } from 'utils/index'

const publish = async ({ libs, devDeps }: TaskArgs) => {
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
			const commitTypes = require("./commitTypes");

			const parserOpts = {
			  headerPattern:
			    /^(?::\\w*:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\\s(?<type>\\w*)(?:\\((?<scope>.*)\\))?!?:\\s(?<subject>(?:(?!#).)*(?:(?!\\s).))(?:\\s\\(?\\)?)?$/
			};
			
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
	).then(() => {
		greenLogger.info(
			'Please add a Repository secret "NPM_TOKEN" to your Github Settings for semantic-release to publish a release.'
		)
	})
}

export default publish
