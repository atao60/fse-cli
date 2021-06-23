/* eslint-disable max-len */
/* spell-checker: disable */
/* 'match groups' is an almost identical copy of test from
 * copyright-regex <https://github.com/regexps/copyright-regex>
 */
'use strict';

import { strictEqual } from 'assert';
import mocha from 'mocha';
const { describe, it } = mocha;

import { copyrightRegex as re, updateCopyrightYears } from './update.js';

function match(str) {
    return str.match(re);
}

describe('update copyright years', function() {
    it('should add current years as first year', function() {
        const original = 'abc\nCopyright (c) Jon Schlinkert.\nxyz';
        const { content: updated } = updateCopyrightYears(original, '2014');
        strictEqual(updated, 'abc\nCopyright (c) 2014 Jon Schlinkert.\nxyz');
    });
    it('should add current years after first year', function() {
        const original = 'abc\nCopyright (c) 2013, Jon Schlinkert.\nxyz';
        const { content: updated } = updateCopyrightYears(original, '2014');
        strictEqual(updated, 'abc\nCopyright (c) 2013-2014, Jon Schlinkert.\nxyz');
    });
    it('should replace last year after first year before markdown link', function() {
        const original = 'abc\nCopyright (c) 2013-2014 [Jon Schlinkert](https://github.com/jonschlinkert).\nxyz';
        const { content: updated } = updateCopyrightYears(original, '2016');
        strictEqual(updated, 'abc\nCopyright (c) 2013-2016 [Jon Schlinkert](https://github.com/jonschlinkert).\nxyz');
    });
    it('should not duplicate last year', function() {
        const original = 'abc\nCopyright (c) 2013 [Jon Schlinkert](https://github.com/jonschlinkert).\nxyz';
        const { content, updated } = updateCopyrightYears(original, '2013');
        strictEqual(updated, false);
        strictEqual(content, 'abc\nCopyright (c) 2013 [Jon Schlinkert](https://github.com/jonschlinkert).\nxyz');
    });
});

describe('match groups:', function () {
    it('should match the parts in a copyright statement:', function () {
        const matches = match('abc\nCopyright (c) 2013, Jon Schlinkert.\nxyz');
        strictEqual(matches[0], 'Copyright (c) 2013, Jon Schlinkert');
        strictEqual(matches[1], 'Copyright');
        strictEqual(matches[2], '(c)');
        strictEqual(matches[3], '2013, ');
        strictEqual(matches[4], '2013');
        strictEqual(matches[5], 'Jon Schlinkert');
    });

    it('should match the parts in a copyright statement with markdown address:', function () {
        const matches = match('abc\nCopyright (c) 2014 [Jon Schlinkert](https://github.com/jonschlinkert).\nxyz');
        strictEqual(matches[0], 'Copyright (c) 2014 [Jon Schlinkert](https://github.com/jonschlinkert)');
        strictEqual(matches[1], 'Copyright');
        strictEqual(matches[2], '(c)');
        strictEqual(matches[3], '2014 ');
        strictEqual(matches[4], '2014');
        strictEqual(matches[5], '[Jon Schlinkert](https://github.com/jonschlinkert)');
    });

    it('should match a copyright statement with multiple dates:', function () {
        const matches = match('abc\nCopyright (c) 2013-2015, 2016, Jon Schlinkert.\nxyz');
        strictEqual(matches[0], 'Copyright (c) 2013-2015, 2016, Jon Schlinkert');
        strictEqual(matches[1], 'Copyright');
        strictEqual(matches[2], '(c)');
        strictEqual(matches[3], '2013-2015, 2016, ');
        strictEqual(matches[4], '2016');
        strictEqual(matches[5], 'Jon Schlinkert');
    });

    it('should match a copyright statement with double year ranges:', function () {
        const matches = match('abc\nCopyright (c) 2013-2015, 2016-2017, Jon Schlinkert.\nxyz');
        strictEqual(matches[0], 'Copyright (c) 2013-2015, 2016-2017, Jon Schlinkert');
        strictEqual(matches[1], 'Copyright');
        strictEqual(matches[2], '(c)');
        strictEqual(matches[3], '2013-2015, 2016-2017, ');
        strictEqual(matches[4], '2017');
        strictEqual(matches[5], 'Jon Schlinkert');
    });

    it('should match a copyright statement missing a copyright symbol:', function () {
        const matches = match('abc\nCopyright 2013-2015 Jon Schlinkert.\nxyz');
        strictEqual(matches[0], 'Copyright 2013-2015 Jon Schlinkert');
        strictEqual(matches[1], 'Copyright');
        strictEqual(matches[2], undefined);
        strictEqual(matches[3], '2013-2015 ');
        strictEqual(matches[4], '2015');
        strictEqual(matches[5], 'Jon Schlinkert');
    });

    it('should match a copyright statement missing an author:', function () {
        const matches = match('abc\nCopyright 2013-2015\nxyz');
        strictEqual(matches[0], 'Copyright 2013-2015');
        strictEqual(matches[1], 'Copyright');
        strictEqual(matches[2], undefined);
        strictEqual(matches[3], '2013-2015');
        strictEqual(matches[4], '2015');
        strictEqual(matches[5], '');
    });

    it('should match a copyright statement missing dates:', function () {
        const matches = match('abc\nCopyright (c) Jon Schlinkert.\nxyz');
        strictEqual(matches[0], 'Copyright (c) Jon Schlinkert');
        strictEqual(matches[1], 'Copyright');
        strictEqual(matches[2], '(c)');
        strictEqual(matches[3], '');
        strictEqual(matches[4], undefined);
        strictEqual(matches[5], 'Jon Schlinkert');
    });

    // a bunch of random copyright statements from using this regex for parsing
    it('should match valid statements:', function () {
        strictEqual(re.test('(C) Copyright 2000, 2001, 2002'), true);
        strictEqual(re.test('"Copyright 2011 craigslist, inc."'), true);
        strictEqual(re.test('#     Copyright (C) 1986-1993, 1998, 2004, 2007-2010'), true);
        strictEqual(re.test('# Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>'), true);
        strictEqual(re.test('###Copyright (C) 2011 by Charlie McConnell'), true);
        strictEqual(re.test('." Copyright (c) 2011, Joyent, Inc.  All Rights Reserved.'), true);
        strictEqual(re.test('." Copyright (c) 2011, Robert Mustacchi.  All Rights Reserved.'), true);
        strictEqual(re.test('/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>'), true);
        strictEqual(re.test('//     Copyright (c) 2010-2012 Robert Kieffer'), true);
        strictEqual(re.test('//     Copyright (c) 2011-2013 John Roepke'), true);
        strictEqual(re.test('// Copyright (c) 2009-2013, Jeff Mott. All rights reserved.'), true);
        strictEqual(re.test('// Copyright (c) 2010 Ryan McGrath'), true);
        strictEqual(re.test('// Copyright (c) 2012 Artur Adib'), true);
        strictEqual(re.test('// Copyright (c) 2012, Mark Cavage. All rights reserved.'), true);
        strictEqual(re.test('// Copyright 2010-2012 Mikeal Rogers'), true);
        strictEqual(re.test('// Copyright 2011 Joyent, Inc.  All rights reserved.'), true);
        strictEqual(re.test('// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.'), true);
        strictEqual(re.test('// Copyright 2012 Joyent, Inc.  All rights reserved.'), true);
        strictEqual(re.test('// Portions created by the Initial Developer are Copyright (C) 2007'), true);
        strictEqual(re.test('//=> "Copyright (c) 2014 Jon Schlinkert"'), true);
        strictEqual(re.test('//=> Copyright (c) 2012-2014 Jon Schlinkert'), true);
        strictEqual(re.test('//=> Copyright (c) 2012-2014 Jon Schlinkert.'), true);
        strictEqual(re.test('//=> Copyright (c) 2014 Jon Schlinkert'), true);
        strictEqual(re.test('//=> Copyright (c) 2014 Jon Schlinkert'), true);
        strictEqual(re.test('//=> Copyright (c) 2014 Jon Schlinkert.'), true);
        strictEqual(re.test('//=> Copyright (c) 2014 [Jon Schlinkert](https://github.com/jonschlinkert)'), true);
        strictEqual(re.test('//Copyright Plato http://stackoverflow.com/a/19385911/995876'), true);
        // At least one space or tab after copyright label+symbol
        strictEqual(re.test('<a href="http://www.w3.org/Consortium/Legal/copyright-documents-19990405">document'), false);
        strictEqual(re.test('<dc:rights>Copyright 2011 craigslist, inc.</dc:rights>'), true);
        // At least one space or tab after copyright label+symbol
        strictEqual(re.test('<p class="copyright"><a href="http://www.w3.org/Consortium/Legal/ipr-notice-20000612#Copyright">Copyright</a>'), false);
        strictEqual(re.test('> Copyright &copy; 2011 Kevin Kwok'), true);
        strictEqual(re.test('> Copyright &copy; 2012 Eli Skeggs'), true);
        strictEqual(re.test('> Copyright &copy; 2013 C. Scott Ananian'), true);
        strictEqual(re.test('@copyright 2011-2013 John Roepke'), true);
        strictEqual(re.test('@license amdefine 0.1.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.'), true);
        strictEqual(re.test('Adapted from bzip2.js, copyright 2011 Kevin Kwok (antimatter15@gmail.com).'), true);
        strictEqual(re.test('Adapted from bzip2.js, copyright 2011 antimatter15 (antimatter15@gmail.com).'), true);
        strictEqual(re.test('Adapted from node-bzip, copyright 2012 Eli Skeggs.'), true);
        strictEqual(re.test('Based on Underscore.js 1.5.2, copyright 2009-2013 Jeremy Ashkenas,'), true);
        strictEqual(re.test('Copyright   : Copyright c 2011 by Kimberly Geswein All rights reserved'), true);
        strictEqual(re.test('Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>'), true);
        strictEqual(re.test('Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2011 Arpad Borsos <arpad.borsos@googlemail.com>'), true);
        strictEqual(re.test('Copyright (C) 2011 Kevin Kwok'), true);
        strictEqual(re.test('Copyright (C) 2011 Yusuke Suzuki <utatane.tea@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2011 by Yehuda Katz'), true);
        strictEqual(re.test('Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>'), true);
        strictEqual(re.test('Copyright (C) 2012 Eli Skeggs'), true);
        strictEqual(re.test('Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>'), true);
        strictEqual(re.test('Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>'), true);
        strictEqual(re.test('Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>'), true);
        strictEqual(re.test('Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>'), true);
        strictEqual(re.test('Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2012 [Yusuke Suzuki](http://github.com/Constellation)'), true);
        strictEqual(re.test('Copyright (C) 2012, 2011 [Ariya Hidayat](http://ariya.ofilabs.com/about)'), true);
        strictEqual(re.test('Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>'), true);
        strictEqual(re.test('Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>'), true);
        strictEqual(re.test('Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2012-2013 [Yusuke Suzuki](http://github.com/Constellation)'), true);
        strictEqual(re.test('Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2013 C. Scott Ananian'), true);
        strictEqual(re.test('Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>'), true);
        strictEqual(re.test('Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>'), true);
        strictEqual(re.test('Copyright (C) 2013 [Yusuke Suzuki](http://github.com/Constellation)'), true);
        strictEqual(re.test('Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>'), true);
        strictEqual(re.test('Copyright (c)  2010-2012 Robert Kieffer'), true);
        strictEqual(re.test('Copyright (c) 2008 Matsuza'), true);
        strictEqual(re.test('Copyright (c) 2009-2011, Kevin Decker kpdecker@gmail.com'), true);
        strictEqual(re.test('Copyright (c) 2009-2011, Mozilla Foundation and contributors'), true);
        strictEqual(re.test('Copyright (c) 2009-2014 TJ Holowaychuk <tj@vision-media.ca>'), true);
        strictEqual(re.test('Copyright (C) 2009-2015 Typesafe Inc. <http://www.typesafe.com>'), true);
        strictEqual(re.test('Copyright (c) 2010'), true);
        strictEqual(re.test('Copyright (c) 2010 Caolan McMahon'), true);
        strictEqual(re.test('Copyright (c) 2010 Christopher West'), true);
        strictEqual(re.test('Copyright (c) 2010-2012 Robert Kieffer'), true);
        strictEqual(re.test('Copyright (c) 2010-2013 Christian Johansen'), true);
        strictEqual(re.test('Copyright (c) 2010-2014 Christian Johansen'), true);
        strictEqual(re.test('Copyright (c) 2010-2014, Christian Johansen (christian@cjohansen.no) and'), true);
        strictEqual(re.test('Copyright (c) 2010-2014, Christian Johansen, christian@cjohansen.no'), true);
        strictEqual(re.test('Copyright (c) 2011 Christopher West'), true);
        strictEqual(re.test('Copyright (c) 2011 Dominic Tarr'), true);
        strictEqual(re.test('Copyright (c) 2011 Esa-Matti Suuronen esa-matti@suuronen.org'), true);
        strictEqual(re.test('Copyright (c) 2011 Joyent, Inc. and the persons identified as document authors.'), true);
        strictEqual(re.test('Copyright (c) 2011 Matthew Francis'), true);
        strictEqual(re.test('Copyright (c) 2011 Shan Carter'), true);
        strictEqual(re.test('Copyright (c) 2011 Sven Fuchs, Christian Johansen'), true);
        strictEqual(re.test('Copyright (c) 2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;'), true);
        strictEqual(re.test('Copyright (c) 2011 dreamerslab &lt;ben@dreamerslab.com&gt;'), true);
        strictEqual(re.test('Copyright (c) 2011 hij1nx <http://www.twitter.com/hij1nx>'), true);
        strictEqual(re.test('Copyright (c) 2011-2013 John Roepke'), true);
        strictEqual(re.test('Copyright (c) 2011-2013, Christopher Jeffrey (MIT License).'), true);
        strictEqual(re.test('Copyright (c) 2011-2013, Christopher Jeffrey. (MIT License)'), true);
        strictEqual(re.test('Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)'), true);
        strictEqual(re.test('Copyright (c) 2011-2014 JP Richardson'), true);
        strictEqual(re.test('Copyright (c) 2012 Another-D-Mention Software and other contributors,'), true);
        strictEqual(re.test('Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola'), true);
        strictEqual(re.test('Copyright (c) 2012 Mark Cavage'), true);
        strictEqual(re.test('Copyright (c) 2012 Matt Mueller &lt;mattmuelle@gmail.com&gt;'), true);
        strictEqual(re.test('Copyright (c) 2012 Maximilian Antoni'), true);
        strictEqual(re.test('Copyright (c) 2012 Simon Boudrias (twitter: @vaxilart)'), true);
        strictEqual(re.test('Copyright (c) 2012 Simon Boudrias (twitter: [@vaxilart](https://twitter.com/Vaxilart))'), true);
        strictEqual(re.test('Copyright (c) 2012 Tyler Kellen'), true);
        strictEqual(re.test('Copyright (c) 2012 Tyler Kellen. See LICENSE for further details.'), true);
        strictEqual(re.test('Copyright (c) 2012 [Vitaly Puzrin](https://github.com/puzrin).'), true);
        strictEqual(re.test('Copyright (c) 2012, 2013 moutjs team and contributors (http://moutjs.com)'), true);
        strictEqual(re.test('Copyright (c) 2012-2013 Jared Hanson <http://jaredhanson.net/>'), true);
        strictEqual(re.test('Copyright (c) 2012-2013, Eran Hammer <eran@hueniverse.com>'), true);
        strictEqual(re.test('Copyright (c) 2013 "Cowboy" Ben Alman'), true);
        strictEqual(re.test('Copyright (c) 2013 Assemble'), true);
        strictEqual(re.test('Copyright (c) 2013 Brian Woodward'), true);
        strictEqual(re.test('Copyright (c) 2013 C. Scott Ananian'), true);
        strictEqual(re.test('Copyright (c) 2013 Garen J. Torikian'), true);
        strictEqual(re.test('Copyright (c) 2013 Garen Torikian'), true);
        strictEqual(re.test('Copyright (c) 2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>'), true);
        strictEqual(re.test('Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors'), true);
        strictEqual(re.test('Copyright (c) 2013 Jon Schlinkert, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;'), true);
        strictEqual(re.test('Copyright (c) 2013 Kyle Robinson Young'), true);
        strictEqual(re.test('Copyright (c) 2013 Matt Mueller <mattmuelle@gmail.com>'), true);
        strictEqual(re.test('Copyright (c) 2013 Maximilian Antoni'), true);
        strictEqual(re.test('Copyright (c) 2013 Segment.io &lt;friends@segment.io&gt;'), true);
        strictEqual(re.test('Copyright (c) 2013 Simon Boudrias'), true);
        strictEqual(re.test('Copyright (c) 2013 Simon Boudrias (twitter: @vaxilart)'), true);
        strictEqual(re.test('Copyright (c) 2013 Upstage.'), true);
        strictEqual(re.test('Copyright (c) 2013 Viacheslav Lotsmanov'), true);
        strictEqual(re.test('Copyright (c) 2013 [Richardson & Sons, LLC](http://richardsonandsons.com/)'), true);
        strictEqual(re.test('Copyright (c) 2013 [Richardson & Sons, LLC](http://richardsonandsons.com/)\r'), true);
        strictEqual(re.test('Copyright (c) 2013 "Cowboy" Ben Alman'), true);
        strictEqual(re.test('Copyright (c) 2013 hij1nx'), true);
        strictEqual(re.test('Copyright (c) 2013, Assemble, contributors'), true);
        strictEqual(re.test('Copyright (c) 2013, Deoxxa Development'), true);
        strictEqual(re.test('Copyright (c) 2013, Dominic Tarr'), true);
        strictEqual(re.test('Copyright (c) 2013, Jon Schlinkert, contributors'), true);
        strictEqual(re.test('Copyright (c) 2013, Jon Schlinkert.'), true);
        strictEqual(re.test('Copyright (c) 2014 "Cowboy" Ben Alman'), true);
        strictEqual(re.test('Copyright (c) 2014 Aron Nopanen'), true);
        strictEqual(re.test('Copyright (c) 2014 Assemble, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014 Brian Woodward'), true);
        strictEqual(re.test('Copyright (c) 2014 Brian Woodward, Jon Schlinkert, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014 Brian Woodward, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014 Charlike Mike Reagent (cli), contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014 Fractal <contact@wearefractal.com>'), true);
        strictEqual(re.test('Copyright (c) 2014 Hugh Kennedy'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert <https://github.com/jonschlinkert>'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert, Brian Woodward'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert, Brian Woodward.'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert, contributors'), true);
        strictEqual(re.test('Copyright (c) 2014 Jon Schlinkert, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014 Julian Gruber &lt;julian@juliangruber.com&gt;'), true);
        strictEqual(re.test('Copyright (c) 2014 Matthew Mueller &lt;mattmuelle@gmail.com&gt;'), true);
        strictEqual(re.test('Copyright (c) 2014 Petka Antonov'), true);
        strictEqual(re.test('Copyright (c) 2014 Segment.io Inc. &lt;friends@segment.io&gt;'), true);
        strictEqual(re.test('Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward'), true);
        strictEqual(re.test('Copyright (c) 2014 Simon Boudrias (twitter: @vaxilart)'), true);
        strictEqual(re.test('Copyright (c) 2014 TJ Holowaychuk &lt;tj@vision-media.ca&gt;'), true);
        strictEqual(re.test('Copyright (c) 2014 [Jon Schlinkert](http://twitter.com/jonschlinkert), [Brian Woodward](http://twitter.com/doowb), contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)'), true);
        strictEqual(re.test('Copyright (c) 2014 "Cowboy" Ben Alman'), true);
        strictEqual(re.test('Copyright (c) 2014 bl contributors'), true);
        strictEqual(re.test('Copyright (c) 2014, Jon Schlinkert, Brian Woodward'), true);
        strictEqual(re.test('Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014, Jon Schlinkert, contributors'), true);
        strictEqual(re.test('Copyright (c) 2014, Jon Schlinkert, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2014-2015 Jon Schlinkert, contributors.'), true);
        strictEqual(re.test('Copyright (c) 2015 Jon Schlinkert, contributors.'), true);
        strictEqual(re.test('Copyright (c) Craig Spaeth <craigspaeth@gmail.com>, Art.sy, 2011-2013'), true);
        strictEqual(re.test('Copyright 2009-2011 Mozilla Foundation and contributors'), true);
        strictEqual(re.test('Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.'), true);
        strictEqual(re.test('Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors'), true);
        strictEqual(re.test('Copyright 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors'), true);
        strictEqual(re.test('Copyright 2010, 2011, Chris Winberry <chris@winberry.net>. All rights reserved.'), true);
        strictEqual(re.test('Copyright 2010, Chris Winberry <chris@winberry.net>. All rights reserved.'), true);
        strictEqual(re.test('Copyright 2010-2014 Caolan McMahon'), true);
        strictEqual(re.test('Copyright 2011 - Present AJ ONeal'), true);
        strictEqual(re.test('Copyright 2011 Mozilla Foundation and contributors'), true);
        strictEqual(re.test('Copyright 2011 The Closure Compiler Authors. All rights reserved.'), true);
        strictEqual(re.test('Copyright 2011 Twitter, Inc.'), true);
        strictEqual(re.test('Copyright 2011, John Resig'), true);
        strictEqual(re.test('Copyright 2011, The Dojo Foundation'), true);
        strictEqual(re.test('Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>'), true);
        strictEqual(re.test('Copyright 2012 Michael Hart (michael.hart.au@gmail.com)'), true);
        strictEqual(re.test('Copyright 2012 Mozilla Foundation and contributors'), true);
        strictEqual(re.test('Copyright 2012- GoInstant, Inc. and other contributors. All rights reserved.'), true);
        strictEqual(re.test('Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>'), true);
        strictEqual(re.test('Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>'), true);
        strictEqual(re.test('Copyright 2012-2014, JP Richardson  <jprichardson@gmail.com>'), true);
        strictEqual(re.test('Copyright 2013 Assemble'), true);
        strictEqual(re.test('Copyright 2014 Mozilla Foundation and contributors'), true);
        strictEqual(re.test('Copyright Dustin Diaz 2011'), true);
        strictEqual(re.test('Copyright © 2011-2014 [Paul Vorbach](http://paul.vorba.ch/) and'), true);
        strictEqual(re.test('Copyright © 2013–2014 Domenic Denicola <domenic@domenicdenicola.com>'), true);
        strictEqual(re.test('Copyright(c) 2010 LearnBoost <dev@learnboost.com>'), true);
        strictEqual(re.test('Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>'), true);
        strictEqual(re.test('Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>'), true);
        strictEqual(re.test('Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>'), true);
        strictEqual(re.test('Copyright(c) 2012 Truepattern'), true);
        strictEqual(re.test('Copyright(c) 2014 Jonathan Ong'), true);
        strictEqual(re.test('Originally modified from scrawl.js. Copyright (c) 2014 [Caolan McMahon](https://github.com/caolan), contributors.'), true);
        strictEqual(re.test('Simple BufferStream is Copyright (c) 2012 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.'), true);
        strictEqual(re.test('Simple BufferStream is Copyright (c) 2012 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.",'), true);
        strictEqual(re.test('Sqwish is copyright Dustin Diaz 2011 under MIT License'), true);
        strictEqual(re.test('bl** is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.'), true);
        strictEqual(re.test('expectedHtml = "<p>Copyright &copy; 2003-2014</p>",'), true);
        strictEqual(re.test('expectedXml = "<p>Copyright &#xA9; 2003-2014</p>",'), true);
        strictEqual(re.test('isStream** is Copyright (c) 2014 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.'), true);
        strictEqual(re.test('php.js is copyright 2011 Kevin van Zonneveld.'), true);
        strictEqual(re.test('through2** is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.'), true);
        strictEqual(re.test('to.js - copyright(c) 2012 openmason.'), true);
        // At least one space or tab after copyright label+symbol
        strictEqual(re.test('use</a> and <a href="http://www.w3.org/Consortium/Legal/copyright-software-19980720">software'), false);
        strictEqual(re.test('var str = "<!doctype html><html><head><title>Some test</title></head><body><footer><p>Copyright &copy; 2003-2014</p></footer></body></html>",'), true);
    });

    it('should not match statements in unit tests:', function () {
        strictEqual(re.test('//   strictEqual(match("Copyright (c) 2013, Jon Schlinkert.")[0], "2013-2015");'), false);
        strictEqual(re.test('//   strictEqual(match("Copyright (c) 2013, Jon Schlinkert.")[0], "Copyright (c) 2013, Jon Schlinkert.");'), false);
        strictEqual(re.test('//   strictEqual(match("Copyright (c) 2013-2015, Jon Schlinkert.")[0], "2013-2015");'), false);
        strictEqual(re.test('//   strictEqual(match("Copyright (c) 2014, Jon Schlinkert.")[0], "2014-2015");'), false);
        strictEqual(re.test('//   strictEqual(match("Copyright (c) 2015, Jon Schlinkert.")[0], "2015");'), false);
        strictEqual(re.test('copyrightHelper(locals).should.eql("Copyright (c) 2014 Jon Schlinkert  ");'), false);
        strictEqual(re.test('copyrightHelper(locals).should.eql("Copyright (c) 2014 [Jon Schlinkert](https://github.com/jonschlinkert)  ");'), false);
    });

    it('should not match statements in templates:', function () {
        strictEqual(re.test('Copyright {%= year %} {%= author_name %}'), false);
        strictEqual(re.test('Copyright 2001-2002 ${name}<br>'), false);
        strictEqual(re.test('_.template("<%= _.copyright({author: author}) %>", locals).should.eql("Copyright (c) 2014 Jon Schlinkert  ");'), false);
        strictEqual(re.test('_.template("<%= copyright({author: author, linkify: false}) %>", locals, {imports: {copyright: copyrightHelper}}).should.eql("Copyright (c) 2014 [Jon Schlinkert](https://github.com/jonschlinkert)  ");'), false);
        strictEqual(re.test('_.template("<%= copyright({author: author}) %>", locals, {imports: {copyright: copyrightHelper}}).should.eql("Copyright (c) 2014 Jon Schlinkert  ");'), false);
        strictEqual(re.test('handlebars.compile("{{copyright this}}")(locals).should.eql("Copyright (c) 2014 Jon Schlinkert  ");'), false);
        strictEqual(re.test('handlebars.compile("{{copyright this}}")(locals).should.eql("Copyright (c) 2014 [Jon Schlinkert](https://github.com/jonschlinkert)  ");'), false);
        strictEqual(re.test('verb.partial("banner", { content: "/*! Copyright (c) 2014 Jon Schlinkert, Brian Woodward... */" });'), false);
        strictEqual(re.test('year("Copyright (c) 2012 Jon Schlinkert", {from: 2012})'), false);
        strictEqual(re.test('{%= copyright({year: 2012, linkify: true}) %}'), false);
        strictEqual(re.test('{%= copyright({year: 2012}) %}'), false);
    });
});

