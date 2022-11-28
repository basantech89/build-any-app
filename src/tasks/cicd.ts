import { greenLogger, writeToRoot } from 'utils'

const cicd = async () => {
	const cicdTool = global.cicd
	const isPrivateProject = global.privateProject

	if (cicdTool === 'github-actions') {
		greenLogger.info(
			'Add repository secret CODECOV_TOKEN to upload code coverage to codecov'
		)
		greenLogger.info(
			'Add repository secret CC_TEST_REPORTER_ID to upload code coverage to code climate'
		)

		writeToRoot(
			'.github/workflows/coverage.yml',
			`
        name: Coverage
        on: pull_request

        jobs:
          coverage:
            name: Code Coverage
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
              - name: Test
                run: yarn test
              - name: Codecov Upload
                uses: codecov/codecov-action@v3
                with:
                  ${
										isPrivateProject
											? 'token: ${{ secrets.CODECOV_TOKEN }} # not required for public repos'
											: ''
									}
                  files: ./coverage/lcov.info # optional
                  flags: unittests # optional
                  name: codecov-umbrella # optional
                  fail_ci_if_error: true # optional (default = false)
                  verbose: true # optional (default = false)
              - name: Send coverage to Code Climate
                uses: paambaati/codeclimate-action@v3.0.0
                env:
                  CC_TEST_REPORTER_ID: \${{ secrets.CC_TEST_REPORTER_ID }}
                with:
                  debug: true
                  coverageCommand: yarn test
                  coverageLocations: |
                    \${{github.workspace}}/coverage/lcov.info:lcov
              - name: NPM Release Dry Run
				        env:
				          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
				          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
				        run: yarn semantic-release --dry-run
      `
		)
	} else if (cicdTool === 'circleci') {
		writeToRoot(
			'.circleci/coverage.yaml',
			`
        version: 2.1
        orbs:
          codecov: codecov/codecov@3.2.2

        jobs:
          coverage:
            docker:
              - image: 'circleci/node:latest'
            environment:
              BRANCHES: /main|next|next-major|alpha|beta/
            steps:
              - checkout
              - run:
                  name: Installation
                  command: npm install
              - when:
                  condition:
                    not:
                      matches:
                        pattern: "main|next|next-major|beta|alpha"
                        value: << pipeline.git.branch >>
                  steps:
                    - run:
                        name: Setup Code Climate test-reporter
                        command: |
                          # download test reporter as a static binary
                          curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
                          chmod +x ./cc-test-reporter
                          ./cc-test-reporter before-build      
                    - run:
                        name: Test runner
                        command: npm run test:report
                    - codecov/upload:
                        file: './coverage/lcov.info'
                    - run:
                        name: Send coverage to Code Climate
                        command: ./cc-test-reporter after-build --coverage-input-type lcov --exit-code $?
              - when:
                  condition:
                    matches:
                      pattern: "main|next|next-major|beta|alpha"
                      value: << pipeline.git.branch >>
                  steps:
                    - run:
                        name: Release
                        command: npm run semantic-release
        workflows:
          version: 2
          deploy:
            jobs:
              - coverage
      `
		)
	}
}

export default cicd
