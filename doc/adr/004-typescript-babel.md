# 004. Babel 7 with both TS and ES2018+


Date: 2020-10-20

## Status

Accepted

## Context

[Typescript](http://www.typescriptlang.org/) is becoming more and more popular.

[EcmaScript](https://tc39.es/) in its last versions brings a lot of improvments over Javascript.

Tools to work with them are now available and well established. There is no reason to restrain their uses to frontend.


## Decision

Use [Typescript](http://www.typescriptlang.org/) as far as possible. Otherwise allow ES6+.

Use them even for configuration files.

Use [Babel 7](https://babeljs.io/) to transpile. 

Use strict mode, at least for the business code.

Use this project as POC.

## Consequences

Even if in the vast majority of cases typing is obvious (or even fully implicit), in some cases it can be tricky.

As no bundler is used, see [003. Build without any bundler](./003-no-bundler.md), Babel 7 will be used to transpile both TS and ES6.

Yet TSC will be use to lint TS code (tsconfig.json with `"noEmit": true`).

There are four TypeScript features that do not compile in Babel due to its single-file emit architecture, see § `It’s not a perfect marriage` of [TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typescript-babel/).

## More reading

[Why You Should Use ES6](https://itnext.io/why-you-should-use-es6-56bd12f7ae09), Charlee Li, May 6, 2018

[JavaScript brief history and ECMAScript(ES6,ES7,ES8,ES9) features](https://medium.com/@madasamy/javascript-brief-history-and-ecmascript-es6-es7-es8-features-673973394df4), Madasamy M, Mar 9, 2018

[ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)

[7 really good reasons not to use TypeScript](https://everyday.codes/javascript/7-really-good-reasons-not-to-use-typescript/), february 5, 2020 by michael krasnov
To take with a pinch of salt: so about FORTRAN, C, C++, Prolmg, Smalltack, LISP, ADA, ... (name it) all of them are 'subset' of binary code... ;-).

[Why You Should Choose TypeScript Over JavaScript](https://serokell.io/blog/why-typescript), Article by Gints Dreimanis, Olga Bolgurtseva, June 18th, 2020

[Why You Should Use TypeScript for Developing Web Applications](https://dzone.com/articles/what-is-typescript-and-why-use-it), Ashok Sharma, Oct. 10, 18 


[TypeScript and Babel 7](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/), Daniel, August 27th, 2018  

[TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typescript-babel/), by Matt Turnbull, last updated: Feb 12, 2019

