# 005. Tasks are everything

Date: 2020-10-20

## Status

Accepted

## Context

This package manages a CLI that provides many commands but each of them with a dedicated task.
These tasks are the chore of the package. Even if all of them are based on code from a unique source, i.g. [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra).

## Decision

Each command should be available:
- either as a stand alone one, e.g. `fse-<command>` or `fse-cli-<command>`,
- or as a sub command, e.g. `fse <command>` or `fse-cli <command>`.

The code itself must convey this separation of the commands.

## Consequences

The link between a command and its task code must be straightforward.

Each task code must be gathered in a unique dedicated file.