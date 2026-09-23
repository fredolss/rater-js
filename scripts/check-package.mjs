import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    encoding: "utf8",
    shell: process.platform === "win32"
});

if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
}

const [packResult] = JSON.parse(result.stdout);
const actualFiles = packResult.files.map(({ path }) => path).sort();
const expectedFiles = [
    "LICENSE",
    "README.md",
    "dist/rater-js.esm.js",
    "dist/rater-js.iife.min.js",
    "dist/rater-js.iife.min.js.map",
    "index.d.ts",
    "package.json"
].sort();

if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
    console.error("Unexpected npm package contents.");
    console.error("Expected:", expectedFiles);
    console.error("Actual:", actualFiles);
    process.exit(1);
}

console.log("npm package contents verified:", actualFiles.join(", "));
