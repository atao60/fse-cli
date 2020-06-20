<h1 align="center">Welcome to @atao/fse-cli</h1>

<p>
  <a href="https://github.com/atao60/fse-cli#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/atao60/fse-cli/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/atao60/fse-cli/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/atao60/fse-cli" />
  </a>
</p>

<span style="font-size:3em;">🏗</span>A cli for [fs-extra](https://github.com/jprichardson/node-fs-extra). 

## 💡 Rational

Everyone needs simple file system operations like copy, remove, clean, ... that can be used from the terminal or via scripts. 

While there are many [Npm](https://www.npmjs.com/) packages that provide this, all are meant to be used as part of an application, and does not have a CLI.

This CLI is based on [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra). 

It is available as [Npm](https://www.npmjs.com/) package from [fse-cli](https://www.npmjs.com/package/@atao60/fse-cli).

The [available CLI commands](#-commands) are fully functional and tested. However it's still a work in progress:
* not all [fs-extra](https://github.com/jprichardson/node-fs-extra) functions are mapped yet,
* more tests, even if they will only concern the CLI part.

## 🏁 Quickstart

Add this package to a project:

```
npm install @atao60/fse-cli
```

Each function is available:
- either as a stand alone one, eg `fse-copy`,
- or as a sub command, eg `fse copy`.

The arguments are those of [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra) as far as possible.

For more details, see the [manual](MANUAL.md).

## 🎹 Commands

- [copy](MANUAL.md#'copy-file-or-directory'),
- [ensureDir](MANUAL.md#'creating-directories'), alias *mkdirs* or *mkdirp*
- [remove](MANUAL.md#'deleting-directories'), alias *rimraf*
- [emptyDir](MANUAL.md#'Cleaning-directories'),
- [ensureFile](MANUAL.md#'creating-files'), alias *touch*,
- [move](MANUAL.md#'move-file-or-directory').

## 🛠️ Development

See [Contributing](CONTRIBUTING.md).

## 🛡 License

See [MIT](LICENSE)

## 📜 Credits

Indeed [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra).

[node-fs-extra-cli](https://www.npmjs.com/package/fs-extra-cli) was very useful to start this project.
