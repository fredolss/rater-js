import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { transformAsync } from "@babel/core";
import presetEnv from "@babel/preset-env";
import { build } from "esbuild";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stylePath = resolve(projectRoot, "lib/style.css");

const cssBuild = await build({
    entryPoints: [stylePath],
    bundle: true,
    loader: { ".svg": "dataurl" },
    minify: true,
    platform: "browser",
    write: false
});

const css = cssBuild.outputFiles[0];

if (!css) {
    throw new Error("esbuild did not produce a CSS bundle");
}

const inlineCssPlugin = {
    name: "inline-rater-css",
    setup(esbuild) {
        esbuild.onResolve({ filter: /style\.css$/ }, () => ({
            namespace: "inline-rater-css",
            path: "style.css"
        }));

        esbuild.onLoad({ filter: /.*/, namespace: "inline-rater-css" }, () => ({
            contents: `
                var css = ${JSON.stringify(css.text)};
                var styleMarker = "data-rater-js";

                if (typeof document !== "undefined" && !document.querySelector("style[" + styleMarker + "]")) {
                    var style = document.createElement("style");
                    style.type = "text/css";
                    style.setAttribute(styleMarker, "");

                    if (style.styleSheet) {
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(document.createTextNode(css));
                    }

                    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    head.appendChild(style);
                }

                module.exports = css;
            `,
            loader: "js"
        }));
    }
};

const javascriptBuild = await build({
    entryPoints: [resolve(projectRoot, "lib/rater-js.js")],
    bundle: true,
    format: "iife",
    globalName: "raterJsBundle",
    legalComments: "inline",
    platform: "browser",
    plugins: [inlineCssPlugin],
    target: "es2015",
    write: false
});

const javascript = javascriptBuild.outputFiles[0];

if (!javascript) {
    throw new Error("esbuild did not produce a JavaScript bundle");
}

const transpiled = await transformAsync(javascript.text, {
    comments: true,
    compact: false,
    presets: [[presetEnv, {
        modules: false,
        targets: { ie: "9" }
    }]],
    sourceType: "script"
});

if (!transpiled?.code) {
    throw new Error("Babel did not produce transpiled JavaScript");
}

const umdBundle = `(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.raterJs = factory();
    }
}(typeof self !== "undefined" ? self : this, function () {
${transpiled.code}
    return raterJsBundle;
}));
`;

await writeFile(resolve(projectRoot, "index.js"), umdBundle);
