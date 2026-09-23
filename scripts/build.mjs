import { mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = resolve(projectRoot, "dist");
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
                const css = ${JSON.stringify(css.text)};
                const styleMarker = "data-rater-js";

                if (typeof document !== "undefined" && !document.querySelector("style[" + styleMarker + "]")) {
                    const style = document.createElement("style");
                    style.type = "text/css";
                    style.setAttribute(styleMarker, "");
                    style.appendChild(document.createTextNode(css));

                    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    head.appendChild(style);
                }
            `,
            loader: "js"
        }));
    }
};

await rm(distDirectory, { force: true, recursive: true });
await mkdir(distDirectory, { recursive: true });

const sharedOptions = {
    bundle: true,
    legalComments: "inline",
    platform: "browser",
    plugins: [inlineCssPlugin],
    target: "es2020"
};

await build({
    ...sharedOptions,
    entryPoints: [resolve(projectRoot, "lib/index.js")],
    format: "esm",
    outfile: resolve(distDirectory, "rater-js.esm.js")
});

await build({
    ...sharedOptions,
    entryPoints: [resolve(projectRoot, "lib/browser.js")],
    format: "iife",
    minify: true,
    outfile: resolve(distDirectory, "rater-js.iife.min.js"),
    sourcemap: "linked"
});
