/* reg exp is a almost identical copy of 
 * copyright-regex <https://github.com/regexps/copyright-regex>
 *
 * Two differences:
 * - add markdown link
 * - space required between copyright label+symbol and years + owner data

 */
'use strict';

export const copyrightPattern = [
    `(?!.*(?:\\{|\\}|\\);))`,
    `(?:`, //0:
    `(copyright)`,                             // group[1]: copyright label
    `[ \\t]*`,                                 // spaces optional between copyright label and symbol
    `(?:`, //1:
    `(&copy;|\\(c\\)|&#(?:169|xa9;)|©)?`,       // group[2]: copyright symbol
    `[ \\t]+`, 
    `)`,   //:1                                // copyright symbol is optional
    `)`,   //:0
    `(?:`, //0: 
    `(`,   //1:                                // group[3]: all the years
    `(?:`, //2:
    `(`,   //3:                                // group[4]: last year
    `(?:`, //4: 
    `(?:19|20)[0-9]{2}`,
    `)`,   //:4
    `)`,   //:3
    `[^\\[\\w\\n]*`,  // anything but words and EOL, so OK with space, '-' and ','
    `)*`,  //:2 
    `)`,   //:1
    `(`,                                       // group[5]
    `(?:`,
    `\\[[ \\t,\\w]*\\]\\([\\-_.:\\/#0-9a-zA-Z]+\\)`,    // markdown link
    `|`,
    `[ \\t,\\w]*`,                                      // simple owner name
    `)`,
    `)`,
    `)`    //:0
].join('');

export const copyrightRegex = new RegExp(copyrightPattern, 'i');

export function updateCopyrightYears(content, currentYear) {
    const result = content.match(copyrightRegex);
    const fullCopyright = result[0];
    const years = result[3] == null ? '' : result[3].trim();   
    const lastYear = result[4] == null ? '' : result[4].trim();   
    const owner = result[5] == null ? '' : result[5].trim(); 
    if (lastYear == currentYear) {
        return {content, updated: false};
    }
    const fullCopyrightParts = result.slice(1, 3);
    if (!years) {
        fullCopyrightParts.push(currentYear);
    } else if (years.startsWith(lastYear)) {
        const newYears = [
            lastYear,
            '-',
            currentYear
        ].join('');
        fullCopyrightParts.push(years.replace(lastYear, newYears));
    } else {
        fullCopyrightParts.push(years.replace(lastYear, currentYear));
    }
    fullCopyrightParts.push(owner);
    const newFullCopyright = fullCopyrightParts.join(' ');
    const newContent = content.replace(fullCopyright, newFullCopyright);
    return {content: newContent, updated: true};
}