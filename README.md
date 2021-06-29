Welcome to @atao/fse-cli
===
[![Github Version](https://img.shields.io/github/package-json/v/atao60/fse-cli?label=github&color=#0366d6)](https://github.com/atao60/fse-cli) [![Github Version](https://img.shields.io/github/issues/atao60/fse-cli)](https://github.com/atao60/fse-cli/issues) [![License: MIT](https://img.shields.io/github/license/atao60/fse-cli)](https://github.com/atao60/fse-cli/blob/master/LICENSE) [![NPM Version](https://img.shields.io/npm/v/@atao60/fse-cli?color=#0366d6)](https://www.npmjs.com/package/@atao60/fse-cli)

<img src="https://raw.githubusercontent.com/googlefonts/noto-emoji/v2018-08-10-unicode11/svg/emoji_u1f3d7.svg" width="40" /> A [CLI](https://en.wikipedia.org/wiki/Command-line_interface) for [fs-extra](https://github.com/jprichardson/node-fs-extra).

> Releases (0.0.x) will be the last ones to support LTS release [10](https://nodejs.org/download/release/v10.24.1/) of [Node.js](https://nodejs.org). Moreover the releases [11](https://nodejs.org/download/release/v11.15.0/) and [13](https://nodejs.org/download/release/v13.14.0/) are also no more supported. 
## 💡 Rational

Everyone needs simple file system operations like copy, remove, clean, ... that can be used from the terminal or via scripts. 

There are many [Npm](https://www.npmjs.com/) packages that provide all or any of this:
- as [API](https://en.wikipedia.org/wiki/Application_programming_interface) to be used as part of an application, but without associated [CLI](https://en.wikipedia.org/wiki/Command-line_interface),
- as [CLI](https://en.wikipedia.org/wiki/Command-line_interface) but in separate [Npm](https://www.npmjs.com/) packages such as [del-cli](https://www.npmjs.com/package/del-cli), [rimraf](https://www.npmjs.com/package/rimraf), [make-dir-cli](https://www.npmjs.com/package/make-dir-cli), [mkdirp](https://www.npmjs.com/package/mkdirp), [cpy-cli](https://www.npmjs.com/package/cpy-cli), [move-file-cli](https://www.npmjs.com/package/move-file-cli)...
- or even as full [shell](https://en.wikipedia.org/wiki/Shell_(computing)), e.g. [shx](https://www.npmjs.com/package/shx) based on [shelljs](https://www.npmjs.com/package/shelljs), both of them being [Unix shell](https://en.wikipedia.org/wiki/Unix_shell) commands for [Node.js](https://nodejs.org).

[This package](https://www.npmjs.com/package/@atao60/fse-cli) just provides many of them from a unique [CLI](https://en.wikipedia.org/wiki/Command-line_interface), without any pretention to be any kind of [shell](https://en.wikipedia.org/wiki/Shell_(computing)).

It is based on the [API](https://en.wikipedia.org/wiki/Application_programming_interface) **[Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra)**. 

> If an [API](https://en.wikipedia.org/wiki/Application_programming_interface) is needed, use [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra), **not** [@atao60/fse-cli](https://www.npmjs.com/package/@atao60/fse-cli). If only because the latter embeds a `npm-shrinkwrap.json` expunged from dev dependencies.


The [available CLI commands](#🎹-commands) are fully functional and tested. However it's still a work in progress:
* Not all [fs-extra](https://github.com/jprichardson/node-fs-extra) functions are mapped yet. Please, feel free to open an [issue](https://github.com/atao60/fse-cli/issues) if there is something you would like supported.
* More tests to come, even if they will only concern the [CLI](https://en.wikipedia.org/wiki/Command-line_interface) part without overlapping [fs-extra](https://github.com/jprichardson/node-fs-extra)'s tests.

## 🏁 Quickstart

[![NPM](https://nodei.co/npm/@atao60/fse-cli.png?mini=true)](https://www.npmjs.com/package/@atao60/fse-cli)

Each command is available:
- either as a stand alone one, i.e. `fse-<command>` or `fse-cli-<command>`,
- or as a sub command, i.e. `fse <command>` or `fse-cli <command>`.

> The arguments and options of each command are those of [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra) as far as possible, see the [manual](MANUAL.md).

Let's start with displaying the versions of both [@atao60/fse-cli](https://github.com/atao60/fse-cli) and [fs-extra](https://github.com/jprichardson/node-fs-extra):

- without installing the package:

```bash
npx @atao60/fse-cli version
```

- otherwise after installing the package either in global mode:

```bash
npm install --global @atao60/fse-cli

fse version
```

- or in a project:

```bash
npm install --save-dev @atao60/fse-cli # or `yarn add --dev @atao60/fse-cli`

fse version
```

## 🎹 Commands

- [copy](MANUAL.md#'copy-file-or-directory'),
- [ensureDir](MANUAL.md#'creating-directories'), alias *mkdirs* or *mkdirp*,
- [remove](MANUAL.md#'deleting-files-and-directories'), alias *rimraf*,
- [emptyDir](MANUAL.md#'Cleaning-directories'),
- [ensureFile](MANUAL.md#'creating-files'), alias *touch*,
- [move](MANUAL.md#'move-file-or-directory'),
- [help](MANUAL.md#'help'),
- [version](MANUAL.md#'version').

For more details, see the [manual](MANUAL.md).

## 🛠️ Development

See [Contributing](CONTRIBUTING.md).

## 🛡️ License

See [MIT](LICENSE).

Copyright &copy; 2020-2021 [Pierre Raoul](https://github.com/atao60).

## 📜 Credits

Indeed the API [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra).

Furthermore [node-fs-extra-cli](https://www.npmjs.com/package/fs-extra-cli) was very useful to start this project.
