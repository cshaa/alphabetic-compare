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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var en = {
    blocks: [
        {
            order: 'numeric-ltr',
            letters: __spread('0123456789'),
            decimalSeparator: /^\.(?=\d)/
        },
        {
            order: 'ltr',
            letters: Array.from('abcdefghijklmnopqrstuvwxyz').map(function (l) { return RegExp('^' + l, 'i'); })
        }
    ]
};
var cs = {
    blocks: [
        __assign({}, en.blocks[0], { decimalSeparator: /^,(?=\d)/ }),
        __assign({}, en.blocks[1], { letters: [
                [/^a/i, /^á/i],
                [/^b/i],
                [/^c(?!h)/i, /^č/i],
                [/^d/i, /^ď/i],
                [/^e/i, /^é/i, /^ě/i],
                [/^f/i],
                [/^g/i],
                [/^h/i],
                [/^ch/i],
                [/^i/i, /^í/i],
                [/^j/i],
                [/^k/i],
                [/^l/i],
                [/^m/i],
                [/^n/i, /^ň/i],
                [/^o/i, /^ó/i],
                [/^p/i],
                [/^q/i],
                [/^r/i, /^ř/i],
                [/^s/i, /^š/i],
                [/^t/i, /^ť/i],
                [/^u/i, /^ú/i, /^ů/i],
                [/^v/i],
                [/^w/i],
                [/^x/i],
                [/^y/i, /^ý/i],
                [/^z/i, /^ž/i]
            ] })
    ]
};
exports.lang = { en: en, cs: cs };
//# sourceMappingURL=lang.js.map