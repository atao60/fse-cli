# File system extra CLI - Manual

## Commands

When lauching a job with prompting, by default the user is asked the arguments without default or inline value. To force prompting for all the arguments, add '--all'.

### Copy file or directory

From the [fs-extra documentation](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md):

"Copy a file or directory. The directory can have contents. Like cp -r."

*Follow the prompts*

```
fse copy
```

*Power user style*

```
fse copy --keepExisting --errorOnExist --preserveTimestamps <source path> <destination path>
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
fse mkdirp <new directory's path>
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

### Deleting directories

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
fse move --overwrite <source path> <destination path>
```
