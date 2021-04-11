# 007. Choice of a license

Date: 2021-04-11

## Status

Accepted

## Context

@atao60/fse-cli is intended to be freely usable and re-usable.

When you make a creative work (which includes code), the work is under exclusive copyright by default. Unless you include a license that specifies otherwise, nobody else can copy, distribute, or modify your work without being at risk of take-downs, shake-downs, or litigation. Once the work has other contributors (each a copyright holder), “nobody” starts including you. (see [No License](https://choosealicense.com/no-permission/))

Even if @atao60/fse-cli is not a library, there is no strong reason to copyleft the code. It's just a wrapper of `fs-extra-cli` with not much value added.

By the way:
* [Node.js: fs-extra](https://github.com/jprichardson/node-fs-extra) is under MIT.
* [fs-extra-cli](https://www.npmjs.com/package/fs-extra-cli) is under MIT.

## Decision

MIT

A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code. (see [MIT License](https://choosealicense.com/licenses/mit/))

## Consequences

Add reference in package.json, README.md & CONTRIBUTING.md

Add file LICENSE at the root of the repository, with the full text

## Next

Manage dependencies licenses.


## More reading

[History of the Open Source effort](http://web.archive.org/web/19981206185148/http://www.opensource.org/history.html), Eric S. Raymond, 1998/12/06

[Choose an open source license], (https://choosealicense.com)

[OSI - Licenses](https://opensource.org/licenses), especially their [FAQ](https://opensource.org/faq).

[GNU/FSF - How to choose a license for your own work](https://www.gnu.org/licenses/license-recommendations.html)

[Which License Should I Use? MIT vs. Apache vs. GPL](https://exygy.com/blog/which-license-should-i-use-mit-vs-apache-vs-gpl/), 21 June 2016, Joseph Morris  
Seems to be the first of a long series of similar articles.

[Writing open-source? Pick MPL 2.0](http://veldstra.org/2016/12/09/you-should-choose-mpl2-for-your-opensource-project.html), 2013/12/09, Hassy Veldstra

[Why I Use the MIT License](https://trickingrockstothink.com/blog_posts/2019/08/27/why_mit.html), 2019/08/27, Chris Gerth 

[Why the GPL sucks](https://sealedabstract.com/rants/why-the-gpl-sucks/), 25 July 2009 by Drew Crawford



