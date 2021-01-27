# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.43](https://github.com/atao60/fse-cli/compare/v0.0.42...v0.0.43) (2021-01-27)


### Performance Improvements

* **publishing:** publish with even less dev stuff, no more types and map files ([5aeac38](https://github.com/atao60/fse-cli/commit/5aeac3854325e7f16b9eb9686fbd03b301cd4bce))


### Docs

* add minor changes to ./README.md ([fb4a538](https://github.com/atao60/fse-cli/commit/fb4a538e50f89e55a208d73a9940c1cab31766b8))


### Others

* update dependencies (among which fs-extra to 9.1.0) ([7a88e27](https://github.com/atao60/fse-cli/commit/7a88e274061da946df42fb969d48af09d68e6e4f))

### [0.0.42](https://github.com/atao60/fse-cli/compare/v0.0.41...v0.0.42) (2021-01-25)


### Bug Fixes

* **publishing:** remove script 'prepublishOnly' ([498e726](https://github.com/atao60/fse-cli/commit/498e726edccf5e5207f6702004b4c8d6789907d4))

### [0.0.41](https://github.com/atao60/fse-cli/compare/v0.0.40...v0.0.41) (2021-01-25)


### Bug Fixes

* **scripts:** store package-lock.json in the right place during publishing ([02484d0](https://github.com/atao60/fse-cli/commit/02484d01ba753f0e7cd813bc9188d00b91f24168))


### Performance Improvements

* **publishing:** publish a version of fse-cli without dev stuff ([3872fad](https://github.com/atao60/fse-cli/commit/3872fadf76d5bef5787f1971b8435f2452153058)), closes [#6](https://github.com/atao60/fse-cli/issues/6)

### [0.0.40](https://github.com/atao60/fse-cli/compare/v0.0.39...v0.0.40) (2021-01-24)


### Bug Fixes

* **emptydir:** allow access to task 'emptyDir' with the right parameter ([82c3ee2](https://github.com/atao60/fse-cli/commit/82c3ee2ec5aab4aecac7332bbd5032915d09632e)), closes [#8](https://github.com/atao60/fse-cli/issues/8)


### Code Refactoring

* move import-s from 'fs' to 'fs-extra' ([6cf1d21](https://github.com/atao60/fse-cli/commit/6cf1d21881c709dee418da73d2ae44ef3ed0ef42))


### Styling

* **remove:** change console log message ([1372a8a](https://github.com/atao60/fse-cli/commit/1372a8a182d440ed60bbaff1a25b4c2d5dbc895f))
* **test:** explicit missing type var in test/cmd.ts ([05711d1](https://github.com/atao60/fse-cli/commit/05711d15d8bcc1fbfa1bada975c39f3104f00fab))
* change console log messages ([2a2ea1e](https://github.com/atao60/fse-cli/commit/2a2ea1eb3ec73afeb43058ecd15a0cbbdfcdef08))


### Tests

* **emptydir:** add minimal testing of task emptyDir ([eaadb82](https://github.com/atao60/fse-cli/commit/eaadb82aa28d3a820fc0fc2d91d5c800ab9c5202)), closes [#8](https://github.com/atao60/fse-cli/issues/8)


### Build System

* **scripts:** add launching 'publish' with the right parameters ([8f185b3](https://github.com/atao60/fse-cli/commit/8f185b31e4f8c7fc3f1baeee2cefa0bcd19981f0))
* **scripts:** add launching 'test:dev' in debug mode ([571d6fc](https://github.com/atao60/fse-cli/commit/571d6fcc9801c6aae27be37427508e98dc3010d4))

### [0.0.39](https://github.com/atao60/fse-cli/compare/v0.0.38...v0.0.39) (2021-01-21)


### Bug Fixes

* don't use internal rimraf during publishing ([d21f215](https://github.com/atao60/fse-cli/commit/d21f21563518aeb8d4f26466401eefee308b9b2b))

### [0.0.38](https://github.com/atao60/fse-cli/compare/v0.0.37...v0.0.38) (2021-01-20)


### Performance Improvements

* publish npm-shrinkwrap.json expunged from dev deps ([e4edc96](https://github.com/atao60/fse-cli/commit/e4edc967b77e907f98f7315a28a965d1a69ee107)), closes [#6](https://github.com/atao60/fse-cli/issues/6)

### [0.0.37](https://github.com/atao60/fse-cli/compare/v0.0.36...v0.0.37) (2021-01-20)


### Bug Fixes

* new RELEASE.json commited with each release ([d5b8a0c](https://github.com/atao60/fse-cli/commit/d5b8a0ce327ef35a12a5736d6c3ff7dc13b6ec3d))

### [0.0.36](https://github.com/atao60/fse-cli/compare/v0.0.35...v0.0.36) (2021-01-19)


### Performance Improvements

* stop publishing file npm-shrinkwrap.json ([83ee913](https://github.com/atao60/fse-cli/commit/83ee9132edda629d6599b91561609d85fe9e0588))


### Styling

* **es-lint:** remove es-lint exceptions ([7f8e79c](https://github.com/atao60/fse-cli/commit/7f8e79cf460b2242a47ebe17ff024d4036dd5686))


### Others

* add VSC configuration ([182ae96](https://github.com/atao60/fse-cli/commit/182ae96424e9b8f6e00151492deab7893b0829d6))
* remove dependency on babel-eslint ([7f812d1](https://github.com/atao60/fse-cli/commit/7f812d10547c669f7ba46ee263eed756f4dc05c0))
* replace linguist-vendored with '-linguist-detectable' for config files in js ([f111d87](https://github.com/atao60/fse-cli/commit/f111d871fa50fc7220a55c5a85e9d3f16ebf84a9))


### Code Refactoring

* **tests:** remove some eslint exceptions ([f9ac158](https://github.com/atao60/fse-cli/commit/f9ac15892918bafab3d3800c4f43eca45b9c57de))
* rewrite index file with TS ([b04f170](https://github.com/atao60/fse-cli/commit/b04f17058820be837580c25b2253e940193ba805))


### Docs

* add first architecture decision records ([1b70354](https://github.com/atao60/fse-cli/commit/1b70354e233d39856960f82ac5e313830caddb2d))
* change README with some rephrasing ([d7d9066](https://github.com/atao60/fse-cli/commit/d7d906601c6443b201b000db35836fbc02aa0c3e))
* cross platform concerns ([22ef5cf](https://github.com/atao60/fse-cli/commit/22ef5cfd3b8d94de9f05e4198242379b463260ec))

### [0.0.35](https://github.com/atao60/fse-cli/compare/v0.0.34...v0.0.35) (2020-11-13)


### Docs

* minor corr. in README ([abae19d](https://github.com/atao60/fse-cli/commit/abae19dea46d02c368decd7047eb866b0edf0592))

### [0.0.34](https://github.com/atao60/fse-cli/compare/v0.0.33...v0.0.34) (2020-11-13)


### Code Refactoring

* remove babel-register.js and update babel.config.js ([aec23ee](https://github.com/atao60/fse-cli/commit/aec23eec3bec8fa7ad33ed6a951a63383315ea05))
* setup typescript in strict mode for source code (under ./src) ([11e2958](https://github.com/atao60/fse-cli/commit/11e29584c686b3bc9b49207f598131ae425dc25f))


### Docs

* rewrite some docs & add .gitattributes with linguist-vendored ([1ac7bcf](https://github.com/atao60/fse-cli/commit/1ac7bcf8217a92a923304181669704be78e8596d))
* update docs with package 'cost-of-modules' ([df2df3d](https://github.com/atao60/fse-cli/commit/df2df3d475f0f2893dcd03a81a62c2aa9fd8310a))


### Styling

* rename a npm script and remove ts types ([9d1f8c6](https://github.com/atao60/fse-cli/commit/9d1f8c63a89ac5cca0a7106977e7f49a1744b8d9))


### Tests

* add checking highlighting in help content ([cd6d6ea](https://github.com/atao60/fse-cli/commit/cd6d6eac15905fe9f7fa77d988f15a2642465947))

### [0.0.33](https://github.com/atao60/fse-cli/compare/v0.0.32...v0.0.33) (2020-09-22)


### Docs

* correc. link 'help' & 'version' ([658339f](https://github.com/atao60/fse-cli/commit/658339febf3a6160a1475502f814531cb51ec36f))

### [0.0.32](https://github.com/atao60/fse-cli/compare/v0.0.31...v0.0.32) (2020-09-22)


### Docs

* add 'analyse dependencies' to CONTRIBUTING ([fdefa6a](https://github.com/atao60/fse-cli/commit/fdefa6a7d90292c7cc7c9c2986a075931cfb3f84))


### Tests

* enhance test descriptions and messages ([d6c98d6](https://github.com/atao60/fse-cli/commit/d6c98d6ac6ce6c3f8cbee93f8cff67a19b7310a6))

### [0.0.31](https://github.com/atao60/fse-cli/compare/v0.0.30...v0.0.31) (2020-09-21)


### Others

* add script "analyse" ([bb1e342](https://github.com/atao60/fse-cli/commit/bb1e342fe5df792f1670e3aca947c0f0bfd50a35))
* remove unused deps 'execa' and 'listr' ([425a99b](https://github.com/atao60/fse-cli/commit/425a99b220479bec0c3051abca812ef24020c26e))


### Docs

* add in README links to help and version entries in MANUAL ([31b828f](https://github.com/atao60/fse-cli/commit/31b828f33a733708c132d3d65f302c9299389906))
* update CONTRIBUTING ([43d4769](https://github.com/atao60/fse-cli/commit/43d47699f7133bba60ce688bfda8434b72d90413))

### [0.0.30](https://github.com/atao60/fse-cli/compare/v0.0.29...v0.0.30) (2020-09-21)


### Others

* remove script 'postinstall' ([42bb5ce](https://github.com/atao60/fse-cli/commit/42bb5ce51b53add454406897acdb8803b442b45f))


### Code Refactoring

* extract magic const, clarify args, asserts first ([b4b9621](https://github.com/atao60/fse-cli/commit/b4b96210e706448aeb82b1503e6e4c9eaca11ce5))


### Docs

* correct README ([160237c](https://github.com/atao60/fse-cli/commit/160237ceddaa676831df0506610050a5f310b098))
* update README and CONTRIBUTING ([6c172e4](https://github.com/atao60/fse-cli/commit/6c172e43b6b462bc830c521661264bb201ddcd0d))

### [0.0.29](https://github.com/atao60/fse-cli/compare/v0.0.28...v0.0.29) (2020-09-04)


### Features

* **docs:** add commands 'help' and 'version'. Enhance docs ([4063066](https://github.com/atao60/fse-cli/commit/4063066d2106ba4da6b3e3ebe1f84dff33cdc2cb))

### [0.0.28](https://github.com/atao60/fse-cli/compare/v0.0.27...v0.0.28) (2020-09-02)


### Docs

* clarify some messages and docs related to them ([daf9fde](https://github.com/atao60/fse-cli/commit/daf9fde287fb13d22348d54d5dd7010cb351663c))

### [0.0.27](https://github.com/atao60/fse-cli/compare/v0.0.26...v0.0.27) (2020-09-02)


### Bug Fixes

* avoid warning about recent node version ([7b957dc](https://github.com/atao60/fse-cli/commit/7b957dc26823162013c81f649daf4dbf7eaeeb72)), closes [#5](https://github.com/atao60/fse-cli/issues/5)

### [0.0.26](https://github.com/atao60/fse-cli/compare/v0.0.25...v0.0.26) (2020-09-02)


### Bug Fixes

* move 'source-map-support' from devDeps to deps ([00f5828](https://github.com/atao60/fse-cli/commit/00f582814b51429ea7243371b257dd4355f67a1c)), closes [#5](https://github.com/atao60/fse-cli/issues/5)

### [0.0.25](https://github.com/atao60/fse-cli/compare/v0.0.24...v0.0.25) (2020-09-02)


### Bug Fixes

* remove comment from json file '.versionrc' ([41d62de](https://github.com/atao60/fse-cli/commit/41d62deaa714f72275da92cf98f8fdf9df9f2cb7))


### Others

* add commitizen and commitlint ([c86a0af](https://github.com/atao60/fse-cli/commit/c86a0af654ae6121b04e9090dadcd3d7d68b2a50))


### Docs

* update README and CONTRIBUTING about commit, release and publish ([690ae6a](https://github.com/atao60/fse-cli/commit/690ae6a2474e33b9eefa50cb58ec47af8c502666))

### [0.0.24](https://github.com/atao60/fse-cli/compare/v0.0.23...v0.0.24) (2020-09-01)

### [0.0.23](https://github.com/atao60/fse-cli/compare/v0.0.22...v0.0.23) (2020-09-01)

### [0.0.22](https://github.com/atao60/fse-cli/compare/v0.0.21...v0.0.22) (2020-08-31)


### Bug Fixes

* **scripts:** remove any deps of rmdir script ([91c57e6](https://github.com/atao60/fse-cli/commit/91c57e6f7b796d062f3b4be65f2717a3a233573f))

### [0.0.21](https://github.com/atao60/fse-cli/compare/v0.0.20...v0.0.21) (2020-07-02)

### [0.0.20](https://github.com/atao60/fse-cli/compare/v0.0.19...v0.0.20) (2020-06-28)

### [0.0.19](https://github.com/atao60/fse-cli/compare/v0.0.18...v0.0.19) (2020-06-28)

### [0.0.18](https://github.com/atao60/fse-cli/compare/v0.0.17...v0.0.18) (2020-06-28)

### [0.0.17](https://github.com/atao60/fse-cli/compare/v0.0.16...v0.0.17) (2020-06-28)


### Bug Fixes

* pre/postversion become pre/postrelease ([7a29d35](https://github.com/atao60/fse-cli/commit/7a29d35bd669ce16d72cc57df986fc037429e993))

### [0.0.16](https://github.com/atao60/fse-cli/compare/v0.0.15...v0.0.16) (2020-06-28)

### [0.0.15](https://github.com/atao60/fse-cli/compare/v0.0.14...v0.0.15) (2020-06-28)


### Bug Fixes

* misplaced preset in babel config ([5e1d1f8](https://github.com/atao60/fse-cli/commit/5e1d1f8b81f77765cfe81ed80c3f2d0c333993ce))
* vulnerabilities with yargs-parser ([6108063](https://github.com/atao60/fse-cli/commit/610806375042d62c01756bf17f9d4a503290ac1f))

### [0.0.14](https://github.com/atao60/fse-cli/compare/v0.0.13...v0.0.14) (2020-06-26)

### [0.0.13](https://github.com/atao60/fse-cli/compare/v0.0.12...v0.0.13) (2020-06-20)

### [0.0.12](https://github.com/atao60/fse-cli/compare/v0.0.11...v0.0.12) (2020-06-20)
