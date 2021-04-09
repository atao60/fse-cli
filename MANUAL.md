# 🏗  File system extra CLI - Manual

## 🏁 Quickstart

Each command is available:
- either as a stand alone one, e.g. `fse-copy` or `fse-cli-copy`,
- or as a sub command, e.g. `fse copy` or `fse-cli copy`.

The options and arguments are the same as those of [Node.js: fs-extra](https://www.npmjs.com/package/fs-extra) unless otherwise stated.

## 🎹 Commands

When launching a job with prompting, by default the user is asked the arguments for which there is no default or inline value. 
To force prompting for all the arguments, add the option '--all'.

### Version

Display [@atao60/fse-cli](https://www.npmjs.com/package/@atao60/fse-cli) version (and [Node.js: fs-extra](https://www.npmjs.com/package/fs-extra) version).

```
fse version
```

### Help

Display the present manual.

```
fse help
```

### Copy file or directory

From the [fs-extra documentation](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md):

"Copy a file or directory. The directory can have contents. Like cp -r."

*Follow the prompts*

```
fse copy
```

*Power user style*

```
fse copy --all --keepExisting --errorOnExist --dereference --preserveTimestamps <source path> <destination path>
```

> Note. `--keepExisting` behaves as the opposite of `fs-extra`'s `--overwrite`.

### Creating directories

From the [fs-extra documentation](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md):

"Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p."

Aliases: ***ensureDir***, ***mkdirs***, ***mkdirp***

*Follow the prompts*

```
fse mkdirp
```

*Power user style*

```
fse mkdirp --mode <integer> <new directory's path>
```

### Cleaning directories

From the [fs-extra documentation](https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir.md):

"Ensures that a directory is empty. Deletes directory contents if the directory is not empty. If the directory does not exist, it is created. The directory itself is not deleted."

*Follow the prompts*

```
fse emptyDir
```

*Power user style*

```
fse emptyDir <directory's path>
```

### Deleting files and directories

From the [fs-extra documentation](https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md):

"Removes a file or directory. The directory can have contents. If the path does not exist, silently does nothing. Like rm -rf."

Aliases: ***remove***, ***rimraf***

*Follow the prompts*

```
fse remove
```

*Power user style*

```
fse remove <directory's path>
```

### Creating files

From the [fs-extra documentation](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md):

"Ensures that the file exists. If the file that is requested to be created is in directories that do not exist, these directories are created. If the file already exists, it is NOT MODIFIED."

Aliases: ***ensureFile***, ***touch***

*Follow the prompts*

```
fse touch
```

*Power user style*

```
fse touch <new file's path>
```

### Move file or directory

From the [fs-extra documentation](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md):

"Moves a file or directory, even across devices."

*Follow the prompts*

```
fse move
```

*Power user style*

```
fse move --all --overwrite <source path> <destination path>
```
