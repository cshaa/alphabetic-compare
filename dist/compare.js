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
    nullSorting: 0,
    allowIntl: 1
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
    var sorting;
    if (config.customSorting)
        sorting = config.customSorting;
    else
        sorting = lang_1.lang[config.language];
    if (!config.customSorting && Intl)
        if (config.allowIntl === 2 || config.allowIntl === 1 && !sorting) {
            var locales = Intl.Collator.supportedLocalesOf(config.language);
            if (locales.length)
                return Intl.Collator(locales[0], { numeric: true }).compare(a, b);
        }
    if (!sorting)
        throw new TypeError("Sorting preferences for language \"" + config.language + "\" not found.");
    var NS = config.nullSorting;
    var lenA = a.length;
    var lenB = b.length;
    var iA = 0;
    var iB = 0;
    groups: while (true) {
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
        var lettersA = null;
        var lettersB = null;
        clusters: while (true) {
            if (!lettersA) {
                lettersA = Array.from(bMatchA.letters);
                if (!ltr)
                    lettersA.reverse();
            }
            if (!lettersB) {
                lettersB = Array.from(bMatchB.letters);
                if (!ltr)
                    lettersB.reverse();
            }
            var clusterA = lettersA[0].cluster;
            var clusterB = lettersB[0].cluster;
            if (clusterA > clusterB)
                return 1;
            if (clusterA < clusterB)
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
                lettersA = lettersB = null;
                iA += bMatchA.length;
                iB += bMatchB.length;
                if (bMatchA.incomplete && bMatchB.incomplete) {
                    bMatchA = matchBlock(a.substr(iA), block, true);
                    bMatchB = matchBlock(b.substr(iB), block, true);
                    if (!bMatchA || !bMatchB)
                        break clusters;
                }
                else {
                    break clusters;
                }
            }
        }
        if (maybeCompare * maybeCompare)
            return maybeCompare;
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
exports.matchPattern = matchPattern;
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
exports.matchLetter = matchLetter;
function matchBlock(str, block, whole) {
    validateOrder(block.order);
    if (block.order === 'custom')
        return block.matchBlock(str);
    var letters = [];
    var incomplete = true;
    var decimalSeparatorIndex = null;
    var i = 0;
    top: while (true) {
        if (i >= str.length) {
            incomplete = false;
            break top;
        }
        var substr = str.substr(i);
        if (block.separator) {
            var match = matchLetter(substr, block.separator);
            if (match) {
                incomplete = false;
                break top;
            }
        }
        if ((!whole || block.order === 'ltr') && letters.length >= 1) {
            break top;
        }
        if (block.ignore) {
            var match = matchLetter(substr, block.ignore);
            if (match) {
                i += match.length;
                continue top;
            }
        }
        if (block.order === 'numeric-ltr' || block.order === 'numeric-rtl') {
            if (decimalSeparatorIndex === null && block.decimalSeparator) {
                var match = matchLetter(substr, block.decimalSeparator);
                if (match) {
                    decimalSeparatorIndex = letters.length - 1;
                    i += match.length;
                    continue top;
                }
            }
        }
        for (var c = 0; c < block.letters.length; c++) {
            var cluster = block.letters[c];
            var match = matchLetter(substr, cluster);
            if (match) {
                letters.push(__assign({}, match, { cluster: c }));
                i += match.length;
                continue top;
            }
        }
        break top;
    }
    if (letters.length === 0)
        return null;
    return { letters: letters, incomplete: incomplete, decimalSeparatorIndex: decimalSeparatorIndex, length: i };
}
exports.matchBlock = matchBlock;
function matchSorting(str, sorting) {
    for (var i = 0; i < sorting.blocks.length; i++) {
        var block = sorting.blocks[i];
        var match = matchBlock(str, block, false);
        if (match)
            return __assign({}, match, { block: i });
    }
    return null;
}
exports.matchSorting = matchSorting;
function validateOrder(order) {
    if (order === 'ltr')
        return;
    if (order === 'rtl')
        return;
    if (order === 'numeric-ltr')
        return;
    if (order === 'numeric-rtl')
        return;
    if (order === 'custom')
        return;
    throw new TypeError("Unsupported value for block.order: " + order);
}
//# sourceMappingURL=compare.js.map