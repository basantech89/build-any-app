# Create App

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build](https://github.com/basantech89/create-app/actions/workflows/codecov.yml/badge.svg)](https://github.com/basantech89/create-app/actions/workflows/codecov.yml)
[![semantic-release: conventionalcommits](https://img.shields.io/badge/semantic--release-conventionalcommits-ff69b4?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)

Generate template of your app dynamically. 

Create-app can run in interactive mode with the option -i through which it prompts for an option if it's not provided.
Non-interactive mode can used in scripts.

# Prompts

Following common options can be provided for your application
    
    --name/-n:            Author Name
    --project-name/-p     Project Name
    --private             Is your project private
    --publish             Do you wish to publish your project
    --static-tools/-t     The static tools you want to use. Choices - typescript, eslint, prettier, jest, commitizen, huksy
    --cicd                The CI/CD tool you want to use. Choices - github-actions, circleci, None
    --interactive/-i      Run create-app in interactive mode

Following options can be provided for a web application
    
    --framework/-f       The framework you want to use for your web application. Choices - react
    --ui/-u              The UI library you want to use for your web application. Choices - react-bootstrap
    --stateLibrary/-s    The global state management library you want to use for your web application. Choices - redux, zustand

# Example

create-app web -i -n "John Smith" -p my-app

create-app web -n "John Smith" -p my-app --private --publish -i

create-app web -f react --cicd github-actions -n "John Doe" -p my-app -u react-bootstrap -s zustand -t typescript eslint jest prettier commitizen husky --private false