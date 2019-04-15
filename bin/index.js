"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var lang_1 = require("./lang");
var defaultConfig = {
    language: 'en',
    nullSorting: 0
};
function compare(a, b, langOrConf) {
    a = '' + a;
    b = '' + b;
    var config;
    if (typeof langOrConf === 'string') {
        config = __assign({}, defaultConfig, { language: langOrConf });
    }
    else {
        config = __assign({}, defaultConfig, langOrConf);
    }
    var sorting = lang_1.lang[config.language];
    if (!sorting)
        throw new TypeError("Sorting preferences for language \"" + config.language + "\" not found.");
    var NS = config.nullSorting;
    var lenA = a.length;
    var lenB = b.length;
    var iA = 0;
    var iB = 0;
    while (true) {
        if (iA >= lenA) {
            if (iB >= lenB)
                return 0;
            else
                return -1;
        }
        else if (iB >= lenB)
            return 1;
        var aa = a.substr(iA);
        var bb = b.substr(iB);
        var sMatchA = matchSorting(aa, sorting);
        var sMatchB = matchSorting(bb, sorting);
        if (!sMatchA) {
            if (!sMatchB) {
                iA++;
                iB++;
                continue;
            }
            else if (NS * NS === 1)
                return NS;
            else {
                iA++;
                continue;
            }
        }
        else if (!sMatchB) {
            if (NS * NS === 1)
                return -NS;
            else {
                iB++;
                continue;
            }
        }
        if (sMatchA.block !== sMatchB.block)
            return sMatchA.block < sMatchB.block ? -1 : 1;
        var block = sorting.blocks[sMatchA.block];
        var bMatchA = matchBlock(aa, block, true);
        var bMatchB = matchBlock(bb, block, true);
        var ltr = block.order === 'ltr' || block.order === 'numeric-ltr';
        var numeric = block.order === 'numeric-ltr' || block.order === 'numeric-rtl';
        if (numeric) {
            var dsa = bMatchA.decimalSeparatorIndex;
            var dsb = bMatchB.decimalSeparatorIndex;
            if (dsa === null)
                dsa = ltr ? bMatchA.letters.length : -1;
            if (dsb === null)
                dsb = ltr ? bMatchB.letters.length : -1;
            if (!ltr) {
                dsa = -dsa;
                dsb = -dsb;
            }
            if (dsa > dsb)
                return 1;
            if (dsa < dsb)
                return -1;
        }
        var maybeCompare = 0;
        while (true) {
            var lettersA = Array.from(bMatchA.letters);
            var lettersB = Array.from(bMatchB.letters);
            if (!ltr) {
                lettersA.reverse();
                lettersB.reverse();
            }
            var clusterA = lettersA[0].cluster;
            var clusterB = lettersB[0].cluster;
            if (clusterA > clusterB)
                return 1;
            if (clusterB < clusterA)
                return -1;
            if (maybeCompare === 0) {
                var letterA = lettersA[0].letter;
                var letterB = lettersB[0].letter;
                if (letterA > letterB)
                    maybeCompare = 1;
                if (letterA < letterB)
                    maybeCompare = -1;
            }
            if (lettersA.length > 1 && lettersB.length > 1) {
                lettersA.shift();
                lettersB.shift();
            }
            else {
                iA += bMatchA.length;
                iB += bMatchB.length;
                if (bMatchA.incomplete && bMatchB.incomplete) {
                    bMatchA = matchBlock(a.substr(iA), block, true);
                    bMatchB = matchBlock(b.substr(iB), block, true);
                }
                else {
                    break;
                }
            }
        }
    }
}
exports.compare = compare;
function matchPattern(str, pattern) {
    if (typeof pattern === 'string') {
        var result = str.substr(0, pattern.length) === pattern;
        if (result)
            return { length: pattern.length };
    }
    else {
        var match = str.match(pattern);
        if (match && match.index !== 0) {
            if (console)
                console.error('Invalid RegExp', pattern, str);
            throw Error("Internal error: the regular expression used to match " +
                "letters matched a letter that was not at the beginning of the string.");
        }
        if (match)
            return { length: match[0].length };
    }
    return null;
}
function matchLetter(str, patterns) {
    if (!Array.isArray(patterns))
        patterns = [patterns];
    for (var i = 0; i < patterns.length; i++) {
        var p = patterns[i];
        var match = matchPattern(str, p);
        if (match)
            return __assign({}, match, { letter: i });
    }
    return null;
}
function matchBlock(str, block, whole) {
    if (block.order === 'custom')
        return block.matchBlock(str);
    var letters = [];
    var incomplete = true;
    var decimalSeparatorIndex = null;
    var i = 0;
    while (true) {
        if (i >= str.length) {
            incomplete = false;
            break;
        }
        var substr = str.substr(i);
        if (!whole || block.order === 'ltr' && i === 1) {
            break;
        }
        if (block.ignore) {
            var match = matchLetter(substr, block.ignore);
            if (match) {
                i += match.length;
                continue;
            }
        }
        if (block.order === 'numeric-ltr' || block.order === 'numeric-rtl') {
            if (decimalSeparatorIndex === null && block.decimalSeparator) {
                var match = matchLetter(substr, block.decimalSeparator);
                if (match) {
                    decimalSeparatorIndex = i;
                    i += match.length;
                    continue;
                }
            }
        }
        if (block.separator) {
            var match = matchLetter(substr, block.separator);
            if (match) {
                incomplete = false;
                break;
            }
        }
        for (var c = 0; c < block.letters.length; c++) {
            var cluster = block.letters[c];
            var match = matchLetter(substr, cluster);
            if (match) {
                letters.push(__assign({}, match, { cluster: c }));
                i += match.length;
                continue;
            }
        }
    }
    return { letters: letters, incomplete: incomplete, decimalSeparatorIndex: decimalSeparatorIndex, length: i };
}
function matchSorting(str, sorting) {
    for (var i = 0; i < sorting.blocks.length; i++) {
        var block = sorting.blocks[i];
        var match = matchBlock(str, block, false);
        if (match)
            return __assign({}, match, { block: i });
    }
    return null;
}
//# sourceMappingURL=index.js.map