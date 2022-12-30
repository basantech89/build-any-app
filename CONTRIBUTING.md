# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request)

## Project setup

1.  Fork and clone the repo
2.  `npm run setup` to setup and validate your clone of the project
3.  Create a branch for your PR

> Tip: Keep your `main` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/basantech89/create-app.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `main`
> branch to use the upstream main branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `main` branch.
> Whenever you want to update your version of `main`, do a regular `git pull`.

## Committing and Pushing changes

Please make sure to run the tests before you commit your changes. Make
sure to include changes (if they exist) in your commit.

### Tests

There are quite a few test scripts that run as part of a `validate` script in
this project:

- lint - ESLint stuff, pretty basic. Please fix any errors/warnings :)
- build - This builds the `build-any-app`
- test:coverage - This is primarily unit tests on the source code and accounts for
  most of the coverage. These tests live in `src/__tests__`
- check-types - This runs `tsc` on the codebase to make sure the type script
  definitions are correct for the `ts` files.
- check:format - This ensures the formatting for the files through prettier

### git hooks

There are git hooks set up with this project that are automatically installed
when you install dependencies. They're really handy, and run when you commit
the changes. Following are the hooks

- pre-commit - This tries to fix any warnings/errors if any through eslint and prettier
- commit-msg - This ensures that your commit message adheres to our convention which is based on [conventional-changelog-conventionalcommits](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits).
    - Your commit message should start with a [gitmoji](https://gitmoji.dev/)
    - Other rules are similiar to [conventional-changelog-angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)


## Help needed

Please checkout the [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

[egghead]:
https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github
[all-contributors]: https://github.com/kentcdodds/all-contributors
[issues]: https://github.com/basantech89/create-app/issues