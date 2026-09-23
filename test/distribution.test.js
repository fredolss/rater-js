import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";

import { build } from "esbuild";
import { JSDOM } from "jsdom";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "..");
const esmPath = path.resolve(projectRoot, "dist/rater-js.esm.js");
const browserPath = path.resolve(projectRoot, "dist/rater-js.iife.min.js");
const sourceMapPath = `${browserPath}.map`;

describe("distribution builds", function() {
    afterEach(function() {
        delete global.document;
        delete global.window;
    });

    it("exports the public API as native ESM and injects assets once", async function() {
        const dom = new JSDOM("<!DOCTYPE html><html><head></head><body><div id=\"rater\"></div></body></html>");
        global.document = dom.window.document;
        global.window = dom.window;

        const moduleUrl = pathToFileURL(esmPath).href;
        const firstModule = await import(`${moduleUrl}?test=first`);
        await import(`${moduleUrl}?test=second`);

        assert.equal(typeof firstModule.default, "function");
        assert.equal(dom.window.document.querySelectorAll("style[data-rater-js]").length, 1);

        const style = dom.window.document.querySelector("style[data-rater-js]").textContent;
        assert.equal((style.match(/data:image\/svg\+xml/g) || []).length, 2);

        const rater = firstModule.default({
            element: dom.window.document.querySelector("#rater"),
            rating: 3
        });

        ["setRating", "getRating", "disable", "enable", "clear", "dispose"].forEach((method) => {
            assert.equal(typeof rater[method], "function");
        });
        assert.equal(rater.getRating(), 3);
    });

    it("exposes raterJs as a browser global without a module loader", function() {
        const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");
        const bundleSource = fs.readFileSync(browserPath, "utf8");

        vm.runInNewContext(bundleSource, {
            document: dom.window.document,
            window: dom.window
        });

        assert.equal(typeof dom.window.raterJs, "function");
        assert.equal(dom.window.document.querySelectorAll("style[data-rater-js]").length, 1);
        assert.doesNotMatch(bundleSource, /module\.exports|define\.amd/);
    });

    it("can be consumed by a modern bundler through the package export", async function() {
        const result = await build({
            bundle: true,
            format: "iife",
            platform: "browser",
            stdin: {
                contents: 'import raterJs from "rater-js"; window.consumerRaterJs = raterJs;',
                resolveDir: projectRoot,
                sourcefile: "consumer.js"
            },
            write: false
        });
        const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");

        vm.runInNewContext(result.outputFiles[0].text, {
            document: dom.window.document,
            window: dom.window
        });

        assert.equal(typeof dom.window.consumerRaterJs, "function");
        assert.equal(dom.window.document.querySelectorAll("style[data-rater-js]").length, 1);
    });

    it("links to a valid browser-build sourcemap", function() {
        const bundleSource = fs.readFileSync(browserPath, "utf8");
        const sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, "utf8"));

        assert.match(bundleSource, /sourceMappingURL=rater-js\.iife\.min\.js\.map/);
        assert.equal(sourceMap.version, 3);
        assert.ok(sourceMap.sources.some((source) => source.endsWith("lib/rater-js.js")));
    });

    it("publishes only ESM through the package exports", function() {
        const packageJson = JSON.parse(fs.readFileSync(path.resolve(projectRoot, "package.json"), "utf8"));

        assert.equal(packageJson.type, "module");
        assert.equal(packageJson.exports["."].import, "./dist/rater-js.esm.js");
        assert.equal(packageJson.exports["."].require, undefined);
        assert.equal(packageJson.main, undefined);
        assert.equal(packageJson.sideEffects, true);
    });
});
