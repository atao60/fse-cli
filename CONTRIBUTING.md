# atao60/fse-cli - Contributing

Welcome!

:tada::+1: First, thank you for considering contributing to `fse-cli`! :tada::+1:

**Table of Content**

- [Guidelines](#guidelines)
  - [Code of Conduct](#code-of-conduct)
  - [Coding Rules](#coding-rules)
  - [Commit and Release Guidelines](#commit-and-release-guidelines)
  - [License](#license)
- [Roadmap](#roadmap)
- [Code Overview](#code-overview)
  - [Tools](#tools)
  - [Design](#design)
- [Prerequisites](#Prerequisites)
- [Development](#development)
  - [Fork](#fork)
  - [Scripts](#scripts)
  - [Cross Platform Concerns](#cross-platform-concerns)
  - [Watch changes](#watch-changes)
  - [Iterate tests over main versions of Node.js](#iterate-tests-over-main-versions-of-node.js)
  - [Check package locally](#check-package-locally)
  - [Analyse dependencies](#analyse-dependencies)
  - [Commit](#commit)
  - [Pull Request](#pull-request)
    - [Submit a pull request](#submit-a-pull-request)
    - [Check a submitted pull request](#check-a-submitted-pull-request)
  - [Publish](#publish)
    - [Size optimization](#size-optimization)
    - [NPM public registry & Github Packages](#npm-public-registry-&-github-packages)
    - [Do it](#do-it)
    - [Check the published package runs fine](#check-the-published-package-runs-fine)
    - [Microsoft Git Credential Manager Core configuration](#microsoft-git-credential-manager-core-configuration)
## Guidelines

We'd like to emphasize these points:

  1. Be Respectful
     * We appreciate contributions to `fse-cli` and we ask you to respect one another.
  2. Be Responsible
     * You are responsible for your Pull Request submission.
  3. Give Credit
     * If any submissions or contributions are built upon other work (e.g. research papers, open sourced projects, public code), please cite or attach any information about the original source. People should be credited for the work they've done.

### Code of Conduct

This project is driven by the [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

### Coding Rules

Before each commit, a static analysis of the code is done with:
* typescript compiler,
* eslint.

Both **must** pass.

Moreover, even if it's not mandatory, it is expected this analysis will not rise any warning. 

### Commit and Release Guidelines

The project uses [Semantic Versioning 2.0.0](https://semver.org/#semantic-versioning-200).

The [changelog file](CHANGELOG.md) is updated with [standard-version](https://github.com/conventional-changelog/standard-version#readme) using [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). See [`@commitlint/config-conventional` types](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum).

### License

By contributing to `fse-cli`, you agree that your contributions will be licensed under its [MIT](LICENSE) license.

## Roadmap

* add other functions from fs-extra
* add functions other than from fs-extra, e.g. [tree-cli](https://www.npmjs.com/package/tree-cli)
* add i18n

## Code Overview

### Tools

This project uses:
- [Typescript](https://www.typescriptlang.org/) as far as possible, otherwise [ES2018](https://www.ecma-international.org/ecma-262/9.0/index.html),
- [Babel7](https://babeljs.io/blog/2018/08/27/7.0.0) as compiler (°).
- [ESLint](https://eslint.org/) **and** [TSLint](https://palantir.github.io/tslint/) as static code analyzers,
- [Npm](https://www.npmjs.com/) as package manager,
- [Docker](https://www.docker.com/) to run tests locally with specific versions of [Node.js](https://nodejs.org).

> (°) There are four TypeScript features that do not compile in Babel due to its single-file emit architecture, see § `It's not a perfect marriage` of [TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typescript-babel/).

### Design

Much documentation can be replaced with highly readable code and tests. In a world of evolutionary architecture, however, it's important to record certain design decisions for the benefit of future team members as well as for external oversight. This project uses Architecture Decision Records (ADR) for capturing important architectural decisions along with their context and consequences. They are gathered under folder `./doc/adr`.

Otherwise, below are some broad design rules.

Each main `fs-extra` function is wrapped in a `task`, each one with a dedicated sub-folder under [src/tasks](src/tasks).

When a `fse-cli <command>` is launched, only the required task is loaded through a dynamic import.

Aliases are defined in the associative array `jobLinks` inside [src/config.ts](src/config.ts).

> ⚠️ Don't forget to update the section `bin` of [package.json](package.json) for any change of `jobLinks` ⚠️ 

Each `task` is tested without duplicating [fs-extra](https://github.com/jprichardson/node-fs-extra) tests.

At the moment, CI/Build is splitted between:
- NPM publishing driven locally by [Husky](https://github.com/typicode/husky#readme),
- Github releasing and publishing done with [Github Actions](https://docs.github.com/en/actions).

A [code analysis](#coding-rules) and a full test + build are done before each push on the [github repository](https://github.com/atao60/fse-cli).

## Prerequisites 

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) - *at least version 12.20*
* [Npm](https://www.npmjs.com/) - *comes with Node.js*
* [Npx](https://github.com/npm/npx#readme) - *comes with Node.js*
* [Docker](https://www.docker.com/)
* [nvm](https://github.com/nvm-sh/nvm) - *optional*

and possibly:
* a [GitHub account](https://github.com/)

The shell used here is [Bash](https://www.gnu.org/software/bash/) under [Linux](https://www.linuxfoundation.org/). However it should be straightforward to work under any other usual OS, see [Cross Platform Concerns](#cross-platform-concerns).

Check prerequisites' status:
```bash

npm doctor # show information about git, node, npm... for the current user

git --version

docker --version # check if BuildKit can be used, i.e. with Docker 18.09 or higher

nvm --version # required only if you need to install Node with at least version 12.20 or higher

npm list -g --depth 0 2>&1 | grep fse-cli # (°°)

```

> (°°) replace `2>&1 | grep ...` by its counterpart under [Windows](https://www.microsoft.com/windows/),
[Mac OS](https://www.apple.com/macos), ... Or simply use `npm list -g --depth 0` and check if `fse-cli` is present.

## Development

### Fork

```bash
node --version ### check Node.js is installed with at least version 12.20

sudo npm uninstall -g @atao60/fse-cli ### if needed; required to avoid any issue with `npm link`, see below

git clone https://github.com/atao60/fse-cli.git atao60-fse-cli

cd atao60-fse-cli

npm install

npm run fullcheck ### Check if the app code is fine (°)

# npm outdated

# npm audit

# npx depcheck  ### good to detect missing dependencies,
                #   but many false errors about unused dependencies such as e.g. runtime ones (tslib, @babel/runtime)

### `cost-of-modules` gives install time required for each package.
# npm run rimraf -- ./node_modules_bak && npx cost-of-modules

```

> (°) The first time the timeout of 2s may not be enough. Just run again the full checking.

### Scripts

The main available scripts are:

- `npm start` - alias for `npm test`,
- `npm test` - rerun build and test after any code changes and made them available through `npm link`,
- `npm run build` - create a production ready build,
- `npm run commit` - commit, instead of `git commit`,
- `npm run release` - run test, lint and build before creating a new release version,
- `npm run cli:publish` - publish on npm and github registries, instead of `npm publish`,
- `npm run clean` - remove temporary folders as dist, .build, ...
- `npm run refresh` - remove node modules, package-lock.json, dist, ... and re-installs upgraded dependencies,
- `npm run lint` - check of code,
- `npm run fullcheck` - run test and lint,
- `npm run analyse` - check dependencies and publish content.

It's also possible to iterate the tests over each main version of [Node.js](https://nodejs.org), using [Docker](https://www.docker.com/):
- `./make.sh nodecheckall`.

### Cross Platform Concerns

##### Code

Libraries such as [graceful-fs](https://www.npmjs.com/package/graceful-fs) and [cross-spawn](https://www.npmjs.com/package/cross-spawn) have been used to improve Windows support.

##### Scripts

All the scripts in package.json are cross-platform, at least under [Linux](https://www.linuxfoundation.org/) ([Bash](https://www.gnu.org/software/bash/)), [Windows](https://www.microsoft.com/windows/) and [Mac OS X](https://www.apple.com/macos).

To make sure your npm scripts work across different platforms, you cannot rely on environment specific tools. This can be solved by using a task runner to hide the differences. Alternately, you can use a collection of npm packages which expose small CLI interface. The list below contains several of them (src: [survivejs.com](https://survivejs.com/maintenance/packaging/building/#cross-platform-concerns)):

* [cross-env]() - Set environment variables.
* [npm-run-all](https://www.npmjs.com/package/npm-run-all) or [concurrently](https://www.npmjs.com/package/concurrently) - Running npm scripts in series and parallel is problematic as there’s no native support for that and you have to rely on OS level semantics. npm-run-all solves this problem by hiding it behind a small CLI interface. Example: npm-run-all clean build:*.

Not forgetting, of course...:

* [cpy-cli](https://www.npmjs.com/package/cpy-cli) - Copy files and folders.
* [mkdirp](https://www.npmjs.com/package/mkdirp) - mkdirp equals to Unix mkdir -p <path> which creates all directories given to it. A normal mkdir <path> would fail if any of the parents are missing. -p stands for --parents.
* [rimraf](https://www.npmjs.com/package/rimraf) - rimraf equals to rm -rf <path> which in Unix terms removes the given path and its contents without any confirmation. The command is both powerful and dangerous.

> A special case here with [rimraf](https://www.npmjs.com/package/rimraf): it can't be used under [Windows](https://www.microsoft.com/windows/) to delete folder `./node_modules`. See the script `./scripts/rmdir.js`.

### Watch changes

```bash

npm start ### will rebuild and test after each code change

```
### Iterate tests over main versions of Node.js

To ensure this package `@atao60/fse-cli` is compatible with all major versions of [Node.js](https://nodejs.org), a [Docker](https://www.docker.com/)(°) image with the last release of each of them is used to run the tests:

```bash
./make.sh nodecheckall
```
The checked releases of [Node.js](https://nodejs.org) are from 12 to last available one as long as a version compatible with [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) is available(°°).

> (°) As soon as [Docker](https://www.docker.com/) is installed, some Bourne shell or compatible one should be available, allowing cross-platform running of `make.sh`.

> (°°) Already reached [EOL](https://en.wikipedia.org/wiki/End-of-life_product) of [Node.js' Releases](https://github.com/nodejs/Release) are:
>- 10: 30th April 2021,
>- 13: 1st of june 2020,
>- 15: 1st of june 2021.  
>  
>As release 15 is compatible with `ESM`, it's not been removed from checking yet.

> Don't forget to regularly check and clean up disk space used by [Docker](https://www.docker.com/): `docker system df` and `docker system prune` are your friends here!

### Check package locally

Create a symbol link in npm global installation and watch any changes:

```bash

cd <path to @atao60/fse-cli folder>

npm link   ### or `npm install --global .`
# [...]
#
# audited 1025 packages in 6.743s
#
# 69 packages are looking for funding
#   run `npm fund` for details
#
# found 0 vulnerabilities
#
# ~/.nvm/versions/node/v12.18.3/bin/fse -> ~/.nvm/versions/node/v12.18.3/lib/node_modules/@atao60/fse-cli/bin/fse
# ~/.nvm/versions/node/v12.18.3/bin/fse-cli -> ~/.nvm/versions/node/v12.18.3/lib/node_modules/@atao60/fse-cli/bin/fse
# [...]
# ~/.nvm/versions/node/v12.18.3/bin/fse-cli-move -> ~/.nvm/versions/node/v12.18.3/lib/node_modules/@atao60/fse-cli/bin/fse
# ~/.nvm/versions/node/v12.18.3/lib/node_modules/@atao60/fse-cli -> [...]/atao60-fse-cli

```

Try it from an other console (°), e.g.:

```bash

fse version
# @atao60/fse-cli 0.0.30 (fs-extra 9.0.1)

```

> (°) In fact under any wished location, even under the folder of `atao60-fse-cli` itself. 

Or try it as a dependency:

```bash

cd <path to the using project folder>

npm link @atao60/fse-cli
# <path to the using project folder>/node_modules/@atao60/fse-cli -> ~/.nvm/versions/node/v12.18.3/lib/node_modules/@atao60/fse-cli -> <path to atao60-fse-cli folder>

npm install -D @atao60/fse-cli ### (°°)
# npm notice created a lockfile as package-lock.json. You should commit this file.
# [...]
#
# audited 126 packages in 7.741s
#
# 72 packages are looking for funding
#   run `npm fund` for details
#
# found 0 vulnerabilities

```

> (°°) If the linked package has same version as one published on NPM Registry, 
then `npm install -D @atao60/fse-cli` will replace the link with a copy of the release under `node_modules`. 
Not what is expected. 

When the link becomes useless, remove it:

```bash
cd <path to @atao60/fse-cli folder>

npm unlink   ### or `npm uninstall --global .`
```

### Analyse dependencies

To get dependencies tree and packaging details:

```bash
npm run analyse 
```

To get only first level production dependencies:

```bash
npm run analyse -- --depth=0 --prod
```


### Commit

Don't use `git commit` but `npm run commit`:


1. Stage modified files using:
```bash
git add .
```
2. Commit the files using git-cz package:
```bash
npm run commit
```
Answer questions:
  *  Choose the type of the commit (feat, refactor, fix, etc.), see [`@commitlint/config-conventional` types](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum).
  *  (Optional) Provide a scope.
  *  Provide a short description of the commit.
  *  (Optional) Provide a longer description.
  *  Determine whether the commit is a BREAKING CHANGES or not (by answering `y` and fill up BREAKING CHANGES descriptions in the CLI).
  *  (Optional) Mention the issues in the [issue tracking system](https://en.wikipedia.org/wiki/Issue_tracking_system), here [Github issues](https://github.com/atao60/fse-cli/issues), (by answering `y` and fill up the issue descriptions in the CLI).

> Any change can be released and published as soon as committed. See [below](#publish).
But any uncommitted changes will prevent a release.
On the other hand, a publishing can be done with uncommitted changes, ignoring them.

### Pull Request

#### Submit a pull request

```bash

git branch ### checking if current user is in 'master' branch before creating a new one for pull request
# * master

git checkout -b my-branch
```

Do here the wanted changes.

```bash

git add --all

npm run commit

git push origin my-branch

```
Lastly open this branch on the Github fork and create a pull request.

Once the pull request merged, delete this branch.

#### Check a submitted pull request

See [GitHub Docs - Checking out pull requests locally](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/checking-out-pull-requests-locally).

### Publish

#### Size optimization

`atao60/fse-cli` is published with a embedded npm-shrinkwrap.json expunged from dev deps. This is done through a "shrink" step before publishing. See `./tools/prepublish'.

#### NPM public registry & Github Packages

Each release (i.e. a tag whose label begins with `v`) is published on both [NPM public registry](https://www.npmjs.com/) and [Github Packages registry](https://github.com/atao60/fse-cli/packages).
To do it, you must be an administrator with access rights for:
- the package on the [npm](https://www.npmjs.com/) public registry, i.e. [@atao60/fse-cli](https://www.npmjs.com/package/@atao60/fse-cli),
- the repository on [Github](https://github.com), i.e. [atao60/fse-cli](https://github.com/atao60/fse-cli),
- the API of [Github](https://github.com), i.e. [GitHub REST API](https://docs.github.com/en/rest).

At the moment:
- NPM Registry login is done manually,
- Github access is done automatically (see [MS - GCMC](#microsoft-git-credential-manager-core-configuration) below).

#### Do it

Don't use `npm publish` but `npm run cli:publish`:

```bash

git checkout master

git merge my-branch

npm run release # push a new version in `package.json` and a new tag with this version as label.

npm login

npm run cli:publish

npm logout

git branch -D my-branch
```

#### Check the published package runs fine

In fact the package on [NPM public registry](https://www.npmjs.com/):

```bash
cd <your local repository for @atao60/fse-cli>

npm unlink @atao60/fse-cli ### remove existing link

cd <any suitable folder, even your local repository>

npm -g un @atao60/fse-cli ### to force access to the npm registry

npx @atao60/fse-cli version  ### or any other fse-cli command

```
#### Microsoft Git Credential Manager Core configuration

Microsoft [Git Credential Manager Core](https://github.com/microsoft/Git-Credential-Manager-Core) is now available on [Windows](https://www.microsoft.com/windows/), [Mac OS](https://www.apple.com/macos) **and** [Linux](https://www.linuxfoundation.org/).

So `@atao60/fse` uses it to hide project's Github secrets. A configuration file `./.gitconfig-gcmc` is provided to help doing it. It must be included either in `./.git/config` or in `~/.gitconfig`.
