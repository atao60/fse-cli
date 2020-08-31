# atao60/fse-cli - Contributing

Welcome!

:tada::+1: First, thank you for considering contributing to `fse-cli`! :tada::+1:

**Table of Content**

- [Guidelines](#guidelines)
  - [Code of Conduct](#code-of-conduct)
  - [Coding Rules](#coding-rules)
  - [Commit Guidelines](#commit-guidelines)
  - [License](#license)
- [Roadmap](#roadmap)
- [Code Overview](#code-overview)
- [Prerequisites](#Prerequisites)
- [Development](#development)
  - [Main Scripts](#main-scripts)
  - [Fork](#fork)
  - [Watch changes](#watch-changes)
  - [Usage](#usage)
  - [Pull Request](#pull-request)
    - [Submit a pull request](#submit-a-pull-request)
    - [Check a submitted pull request](#check-a-submitted-pull-request)
  - [Publish](#publish)

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

### Commit Guidelines

The [changelog file](CHANGELOG.md) is updated with [standard-version](https://github.com/conventional-changelog/standard-version#readme) using [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). See [`@commitlint/config-conventional` types](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/HEAD/versions/2.1.0/README.md#types).

### License

By contributing to `fse-cli`, you agree that your contributions will be licensed under its [MIT](LICENSE) license.

## Roadmap

* add a full help
* add other functions from fs-extra
* add functions other than from fs-extra, eg [tree-cli](https://www.npmjs.com/package/tree-cli)

## Code Overview

This project uses:
- [Typescript](https://www.typescriptlang.org/) as far as possible, otherwise [ES2018](https://www.ecma-international.org/ecma-262/9.0/index.html),
- [Babel7](https://babeljs.io/blog/2018/08/27/7.0.0) as compiler (°).
- [ESLint](https://eslint.org/) **and** [TSLint](https://palantir.github.io/tslint/) as static code analysers,
- [Npm](https://www.npmjs.com/) as package manager.

> (°) There are four TypeScript features that do not compile in Babel due to its single-file emit architecture, see § `It’s not a perfect marriage` of [TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typescript-babel/).

Each main `fs-extra` function is wrapped in a `task`, each one with a dedicated sub-folder under [src/tasks](src/tasks).

Aliases are defined in the associative array `jobLinks` inside [src/config.ts](src/config.ts).

> ⚠️ Don't forget to update the section `bin` of [package.json](package.json) for any change of `jobLinks` ⚠️ 

Each `task` is tested without duplicating [fs-extra](https://github.com/jprichardson/node-fs-extra) tests.

At the moment there is no CI/Build configuration on [Github](https://github.com) side. But thanks to [Husky](github.com/typicode/husky#readme), a [code analysis](#coding-rules) and a full test + build are done before each push on the [github repository](https://github.com/atao60/fse-cli).

## Prerequisites 

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/download/)
* [Npm](https://www.npmjs.com/) - comes with Node.js
* [Npx](https://github.com/npm/npx#readme) - comes with Node.js

and possibly:
* a [GitHub account](https://github.com/)

The shell used here is [Bash](https://www.gnu.org/software/bash/) under [Linux](https://www.linuxfoundation.org/). However it should be straightforward to work under any other usual OS as [Windows](https://www.microsoft.com/windows/) or [Mac OS X](https://www.apple.com/macos).

Check prerequisites' status:
```bash
npm doctor # will show information about git, node, npm... for the current user
git --version
npm list -g --depth 0 2>&1 | grep fse-cli # (°)
```

> (°) replace `2>&1 | grep ...` by its counterpart under [Windows](https://www.microsoft.com/windows/),
[Mac OS X](https://www.apple.com/macos), ... Or simply use `npm list -g --depth 0` and check if `fse-cli` is present.

## Development

### Main Scripts

The main available scripts are:

- `npm start` - alias for `npm run test`
- `npm run test` - rerun build and test after any code changes and made them available through `npm link`,
- `npm run build` - create a production ready build,
- `npm run release` - run test, lint and build before pushing with the new version
- `npm run clean` - remove temporary folders as dist, .build, ...
- `npm run refresh` - remove node modules, package-lock.json, dist, ... and re-installs upgraded dependencies,
- `npm run lint` - check of code,
- `npm run fullcheck` - run test and lint.

### Fork

```bash
npm uninstall -g @atao60/fse-cli ### if needed; required to avoid any issue with `npm link`, see below

git clone https://github.com/atao60/fse-cli.git atao60-fse-cli

cd atao60-fse-cli

npm install

# npm outdated

# npm audit

# npx depcheck

```

### Watch changes

```bash

sudo npm link

npm start ### will rebuild and test after each code change
```

### Usage

Doing it from an other console (°), use package from local repository, eg:

```bash

fse mkdirp my_new_folder

```

> (°) Under any wished location, even the directory `atao60-fse-cli` above. 

### Pull Request

#### Submit a pull request

```bash

pwd  ### checking if in the forked project folder
# <path to>/atao60-fse-cli

git branch ### checking if current user is in 'master' branch before creating the new one for pull request
# * master

git checkout -b my-branch

### do here the wanted changes

git add --all

git commit -m "<closing pull request message>"

git push origin my-branch

```
Lastly open this branch on the Github fork and create a pull request.

Once the pull request merged, delete this branch.

#### Check a submitted pull request

See [GitHub Docs - Checking out pull requests locally](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/checking-out-pull-requests-locally).

### Publish

To publish on [npm](https://www.npmjs.com/) public registry, you must be an administor with access rights for:
- the package on the [npm](https://www.npmjs.com/) public registry, ie [@atao60/fse-cli](https://www.npmjs.com/package/@atao60/fse-cli),
- the repository on [Github](https://github.com), ie [atao60/fse-cli](https://github.com/atao60/fse-cli).

> The script `npm run version` will push a new version in `package.json` and a new tag with this version as label.

```bash

git checkout master

git merge my-branch

npm run release

npm publish

git branch -D my-branch

### check the published package runs fine:

cd <any suitable folder, even your local repository>

npx @atao60/fse-cli

```
