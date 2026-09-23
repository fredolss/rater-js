# Repository Guidelines

## Project Structure & Module Organization

The widget implementation lives in `lib/rater-js.js`. `lib/index.js` is the package entry point, while `lib/browser.js` exposes the standalone browser global. CSS and star SVGs are also under `lib/`. `scripts/build.mjs` bundles these sources into generated `dist/` files; do not edit `dist/` by hand. Browser examples live in `example/`, and documentation artwork is in `assets/`. Tests are in `test/`: runtime and distribution tests use JavaScript, while `test/types/` validates the public declarations in `index.d.ts`.

## Build, Test, and Development Commands

Use Node.js 24 (`nvm use`) and install the lockfile exactly with `npm ci`.

- `npm run build` creates the ESM and minified IIFE distributions with esbuild.
- `npm test` rebuilds, runs the Mocha suite, and checks TypeScript declarations.
- `npm run test:types` runs only the strict, no-emit declaration test.
- `npm run test:package` verifies the contents and metadata of the npm package.

Run `npm test` and `npm run test:package` before opening a pull request.

## Coding Style & Naming Conventions

This is native ESM: use `import`/`export` and include `.js` in relative imports. Follow the style of the file being changed: the legacy widget source uses tabs, while newer scripts, tests, and type declarations use four spaces. Use semicolons, double quotes in new JavaScript, `camelCase` for variables/functions, and descriptive option names consistent with the public API (for example, `starSpacing`). No formatter or linter is configured, so keep diffs focused and preserve nearby formatting.

## Testing Guidelines

Mocha provides `describe`/`it`; Node assertions, jsdom, and Sinon cover behavior, DOM interactions, and callbacks. Add regression tests under `test/` with behavior-focused names such as `it("rejects invalid spacing", ...)`. Update `test/types/index.ts` whenever public types change. There is no enforced coverage threshold, but changes should exercise success paths, validation, cleanup, and both ESM and browser distributions when relevant.

## Commit & Pull Request Guidelines

Recent commits use short, imperative subjects such as `Document ES module usage` or `Fix cache-busting`. Keep commits focused and avoid mixing unrelated refactors. Base branches on `master`. Pull requests should explain what changed and why, link relevant issues, list verification commands, and include screenshots or a demo link for visible widget changes. Update README examples and `index.d.ts` when the public API changes.
