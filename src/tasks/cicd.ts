import { TaskArgs } from 'tasks/index'
import { writeToRoot } from 'utils/fs'
import { greenLogger } from 'utils/logger'

const cicd = ({ libs }: TaskArgs) => {
	const cicdTool = global.cicd

	if (cicdTool === 'github-actions') {
		if (libs.useCodecov) {
			greenLogger.info(
				'Add repository secret CODECOV_TOKEN to upload code coverage to codecov'
			)
		}

		if (libs.useCodeClimate) {
			greenLogger.info(
				'Add repository secret CC_TEST_REPORTER_ID to upload code coverage to code climate'
			)
		}

		writeToRoot(
			'.github/workflows/build.yml',
			`
name: Build
on: pull_request

jobs:
  build:
    name: Build
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
      - name: Test
        run: yarn test
      ${
				libs.useCodecov
					? `
      - name: Codecov Upload
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info # optional
          flags: unittests # optional
          name: codecov-umbrella # optional
          fail_ci_if_error: true # optional (default = false)
          verbose: true # optional (default = false)
      `
					: ''
			}
      ${
				libs.useCodecov
					? `
      - name: Send coverage to Code Climate
        uses: paambaati/codeclimate-action@v3.0.0
        env:
          CC_TEST_REPORTER_ID: \${{ secrets.CC_TEST_REPORTER_ID }}
        with:
          debug: true
          coverageCommand: yarn test
          coverageLocations: |
            \${{github.workspace}}/coverage/lcov.info:lcov
      `
					: ''
			}
			${
				global.publishPackage
					? `
      - name: NPM Release Dry Run
        env:
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: yarn semantic-release --dry-run
			`
					: ''
			}
      `
		)
	} else if (cicdTool === 'circleci') {
		writeToRoot(
			'.circleci/build.yaml',
			`
version: 2.1
orbs:
  codecov: codecov/codecov@3.2.2

jobs:
  build:
    docker:
      - image: 'circleci/node:latest'
    environment:
      BRANCHES: /main|next|next-major|alpha|beta/
    steps:
      - checkout
      - run:
          name: Dependencies Installation
          command: yarn install --prefer-offline
      - when:
          condition:
            not:
              matches:
                pattern: "main|next|next-major|beta|alpha"
                value: << pipeline.git.branch >>
          steps:
          ${
						libs.useCodeClimate
							? `
            - run:
                name: Setup Code Climate test-reporter
                command: |
                  # download test reporter as a static binary
                  curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
                  chmod +x ./cc-test-reporter
                  ./cc-test-reporter before-build      
          `
							: ''
					}
            - run:
	              name: Test runner
                command: yarn test
          ${
						libs.useCodecov
							? `
            - codecov/upload:
                file: './coverage/lcov.info'                
          `
							: ''
					}
					${
						libs.useCodeClimate
							? `
            - run:
                name: Send coverage to Code Climate
                command: ./cc-test-reporter after-build --coverage-input-type lcov --exit-code $?
					`
							: ''
					}
            - run:
                name: Dry Release Dry Run
                command: yarn semantic-release --dry-run
workflows:
  version: 2
  deploy:
    jobs:
      - build
      `
		)
	}
}

cicd.displayName = 'cicd'
export default cicd
