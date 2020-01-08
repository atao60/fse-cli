# @atao/fse-cli

<span style="font-size:3em;">🏗</span>A cli for [node-fs-extra](https://github.com/jprichardson/node-fs-extra). 

## 💡 Rational

Everyone needs simple file system operations like copy, remove, clean, ... that can be used from the terminal or via [npm(https://www.npmjs.com)] scripts. 

While there are many [Node.js](https://nodejs.org) utils that provide this, all are meant to be used as part of an app, and does not have a CLI.

Ths CLI is based on [fs-extra](https://github.com/jprichardson/node-fs-extra).

Note: it's a work in progress. Not all functions are mapped yet. See [Commands](#Commands) below

## 🏁 Quickstart

```
npm install @atao/fse-cli
```

Each function is available:
- either as a stand alone one, eg `fse-copy`,
- or as a sub command, eg `fse copy`.

The arguments are those of [fs-extra](https://github.com/jprichardson/node-fs-extra) as far as possible.

For more details, see the [manual](MANUAL.md).

## ⚙ Commands

- [copy](MANUAL.md#'Copy-files-or-folders'),
- [ensureDir](MANUAL.md#'Creating-directories'), alias mkdirs or mkdirp
- [remove](MANUAL.md#'Deleting-directories'), alias rimraf
- [emptyDir](MANUAL.md#'Cleaning-directories').

## 🛠️ Development

See [Contributing](CONTRIBUTING.md).

## 🛡 License

[MIT](LICENSE)

## 

