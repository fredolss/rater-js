var assert = require("assert");
var fs = require("fs");
var path = require("path");
var vm = require("vm");
var jsdom = require("jsdom");

var JSDOM = jsdom.JSDOM;
var bundlePath = path.resolve(__dirname, "../index.js");
var bundleSource = fs.readFileSync(bundlePath, "utf8");

describe("distribution bundle", function() {
    afterEach(function() {
        delete global.document;
        delete global.window;
        delete require.cache[bundlePath];
    });

    it("exports the public API through CommonJS and injects assets once", function() {
        var dom = new JSDOM("<!DOCTYPE html><html><head></head><body><div id=\"rater\"></div></body></html>");
        global.document = dom.window.document;
        global.window = dom.window;

        var raterJs = require(bundlePath);
        delete require.cache[bundlePath];
        require(bundlePath);

        assert.equal(typeof raterJs, "function");
        assert.equal(dom.window.document.querySelectorAll("style[data-rater-js]").length, 1);

        var style = dom.window.document.querySelector("style[data-rater-js]").textContent;
        assert.equal((style.match(/data:image\/svg\+xml/g) || []).length, 2);

        var rater = raterJs({
            element: dom.window.document.querySelector("#rater"),
            rating: 3
        });

        ["setRating", "getRating", "disable", "enable", "clear", "dispose"].forEach(function(method) {
            assert.equal(typeof rater[method], "function");
        });
        assert.equal(rater.getRating(), 3);
    });

    it("exports raterJs as a browser global", function() {
        var dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");
        var context = {
            document: dom.window.document,
            self: dom.window,
            window: dom.window
        };

        vm.runInNewContext(bundleSource, context);

        assert.equal(typeof dom.window.raterJs, "function");
        assert.equal(dom.window.document.querySelectorAll("style[data-rater-js]").length, 1);
    });

    it("exports raterJs through AMD", function() {
        var dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");
        var amdExport;
        var define = function(dependencies, factory) {
            assert.deepEqual(dependencies, []);
            amdExport = factory();
        };
        define.amd = {};

        vm.runInNewContext(bundleSource, {
            define: define,
            document: dom.window.document,
            self: dom.window,
            window: dom.window
        });

        assert.equal(typeof amdExport, "function");
        assert.equal(dom.window.raterJs, undefined);
    });
});
