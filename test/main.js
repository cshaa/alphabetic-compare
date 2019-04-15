"use strict";
exports.__esModule = true;
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var bin_1 = require("../bin");
mocha_1.describe('the library', function () {
    mocha_1.it('just works', function () {
        chai_1.expect(true).is["true"];
        chai_1.expect(typeof bin_1.compare).equals('function');
    });
});
