Welcome to @atao/fse-cli
===
[![Github Version](https://img.shields.io/github/package-json/v/atao60/fse-cli?label=github&color=#0366d6)](https://github.com/atao60/fse-cli) [![Github Version](https://img.shields.io/github/issues/atao60/fse-cli)](https://github.com/atao60/fse-cli/issues) [![License: MIT](https://img.shields.io/github/license/atao60/fse-cli)](https://github.com/atao60/fse-cli/blob/master/LICENSE) [![NPM Version](https://img.shields.io/npm/v/@atao60/fse-cli?color=#0366d6)](https://www.npmjs.com/package/@atao60/fse-cli)

[![NPM](https://nodei.co/npm/@atao60/fse-cli.png?mini=true)](https://www.npmjs.com/package/@atao60/fse-cli)


<span style="font-size:3em;">🏗</span>A [CLI](https://en.wikipedia.org/wiki/Command-line_interface) for [fs-extra](https://github.com/jprichardson/node-fs-extra). 

## 💡 Rational

Everyone needs simple file system operations like copy, remove, clean, ... that can be used from the terminal or via scripts. 

There are many [Npm](https://www.npmjs.com/) packages that provide all or any of this:
- as an [API](https://en.wikipedia.org/wiki/Application_programming_interface) to be used as part of an application, but without associated [CLI](https://en.wikipedia.org/wiki/Command-line_interface),
- as [CLI](https://en.wikipedia.org/wiki/Command-line_interface) but in separate [Npm](https://www.npmjs.com/) packages such as [rimraf](https://www.npmjs.com/package/rimraf), [mkdirp](https://www.npmjs.com/package/mkdirp), [cpy-cli](https://www.npmjs.com/package/cpy-cli), ...
- or even as a full [shell](https://en.wikipedia.org/wiki/Shell_(computing)) with e.g. [shx](https://www.npmjs.com/package/shx) based on [shelljs](https://www.npmjs.com/package/shelljs), a [Unix shell](https://en.wikipedia.org/wiki/Unix_shell) commands for [Node.js](https://nodejs.org).

[This package](https://www.npmjs.com/package/@atao60/fse-cli) just provides many of them from a unique [CLI](https://en.wikipedia.org/wiki/Command-line_interface), without any pretention to be any kind of [shell](https://en.wikipedia.org/wiki/Shell_(computing)).

It is based on the `API` [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra). 

> If an `API` is needed, use [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra), **not** [@atao60/fse-cli](https://www.npmjs.com/package/@atao60/fse-cli). If only because the latter uses `npm-shrinkwrap.json`, not `package-lock.json`, see [shrinkwrap.json - A publishable lockfile](https://docs.npmjs.com/cli/v6/configuring-npm/shrinkwrap-json).


The [available CLI commands](#-commands) are fully functional and tested. However it's still a work in progress:
* Not all [fs-extra](https://github.com/jprichardson/node-fs-extra) functions are mapped yet. Please, feel free to open an [issue](https://github.com/atao60/fse-cli/issues) if there is something you would like supported.
* More tests to come, even if they will only concern the CLI part without overlapping [fs-extra](https://github.com/jprichardson/node-fs-extra)'s tests.

## 🏁 Quickstart


Each command is available:
- either as a stand alone one, i.e. `fse-<command>` or `fse-cli-<command>`,
- or as a sub command, i.e. `fse <command>` or `fse-cli <command>`.


Let's start with displaying the versions of both [@atao60/fse-cli](https://github.com/atao60/fse-cli) and [fs-extra](https://github.com/jprichardson/node-fs-extra):

- without installing the package:

```bash
npx @atao60/fse-cli version
```

- otherwise after installing the package either in global mode:

```
npm install --global @atao60/fse-cli

fse version
```

- or in a project:

```
npm install @atao60/fse-cli

fse version
```

The arguments and options are those of [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra) as far as possible.

## 🎹 Commands

- [copy](MANUAL.md#'copy-file-or-directory'),
- [ensureDir](MANUAL.md#'creating-directories'), alias *mkdirs* or *mkdirp*
- [remove](MANUAL.md#'deleting-files-and-directories'), alias *rimraf*
- [emptyDir](MANUAL.md#'Cleaning-directories'),
- [ensureFile](MANUAL.md#'creating-files'), alias *touch*,
- [move](MANUAL.md#'move-file-or-directory'),
- [help](MANUAL.md#'help'),
- [version](MANUAL.md#'version').

For more details, see the [manual](MANUAL.md).

## 🛠️ Development

See [Contributing](CONTRIBUTING.md).

## 🛡 License

See [MIT](LICENSE).

## 📜 Credits

Indeed the API [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra).

Furthermore [node-fs-extra-cli](https://www.npmjs.com/package/fs-extra-cli) was very useful to start this project.
