# File system extra CLI - Manual

## Commands

When lauching a job with prompting, by default the user is asked the arguments without default or inline value. To force prompting for all the arguments, add '--all'.

### Copy file or folder

From the fs-extra repo:

"Copy a file or directory. The directory can have contents. Like cp -r."

*Follow the prompts*

```
fse copy
```

*Power user style*

```
fse copy --overwrite no --errorOnExist yes --preserveTimestamps <source path> <destination path>
```

### Creating directories

From the fs-extra repo:

"Creates a directory. If the parent hierarchy doesn't exist, it's created. Like mkdir -p."

Aliases: ensureDir, mkdirs, mkdirp

*Follow the prompts*

```
fse mkdirp
```

*Power user style*

```
fse mkdirp <new directory's path>
```

### Cleaning directories

From the fs-extra repo:

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

From the fs-extra repo:

"Removes a file or directory. The directory can have contents. Like rm -rf."

Aliases: remove, rimraf

*Follow the prompts*

```
fse remove
```

*Power user style*

```
fse remove <directory's path>
```
