# @atao/fse-cli

<span style="font-size:3em;">🏗</span>A cli for [fs-extra](https://github.com/jprichardson/node-fs-extra). 

## 💡 Rational

Everyone needs simple file system operations like copy, remove, clean, ... that can be used from the terminal or via [npm](https://www.npmjs.com) scripts. 

While there are many [Node.js](https://nodejs.org) utils that provide this, all are meant to be used as part of an app, and does not have a CLI.

This CLI is based on [fs-extra](https://github.com/jprichardson/node-fs-extra). It is available as [Node.js](https://nodejs.org) package from [Node.js: fs-extra](https://www.npmjs.com/package/fs-extra).

> Note. It's a work in progress:
* not all functions are mapped yet, see [Commands](#Commands) below;
* more tests still to be created, even if they will only cover the cli part.

## 🏁 Quickstart

Add this package to a project:

```
npm install @atao60/fse-cli
```

Each function is available:
- either as a stand alone one, eg `fse-copy`,
- or as a sub command, eg `fse copy`.

The arguments are those of [fs-extra](https://github.com/jprichardson/node-fs-extra) as far as possible.

For more details, see the [manual](MANUAL.md).

## 🎹 Commands

- [copy](MANUAL.md#'Copy-file-or-directory'),
- [ensureDir](MANUAL.md#'Creating-directories'), alias mkdirs or mkdirp
- [remove](MANUAL.md#'Deleting-directories'), alias rimraf
- [emptyDir](MANUAL.md#'Cleaning-directories'),
- [ensureFile](MANUAL.md#'Creating-files'), alias touch,
- [move](MANUAL.md#'Move-file-or-directory').

## 🛠️ Development

See [Contributing](CONTRIBUTING.md).

## 🛡 License

[MIT](LICENSE)

## 📜 Credits

Indeed [node-fs-extra](https://github.com/jprichardson/node-fs-extra).

Amongst several dead attempts to create a CLI : [node-fs-extra-cli](https://www.npmjs.com/package/fs-extra-cli).

