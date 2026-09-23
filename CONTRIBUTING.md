# Contributing to rater-js

Thanks for your interest in contributing! Contributions of all sizes are
welcome — bug reports, documentation fixes, and pull requests.

## Reporting bugs and requesting features

Please [open an issue](https://github.com/fredolss/rater-js/issues) and
include:

- What you expected to happen vs. what actually happened
- Steps to reproduce (a minimal HTML/JS snippet or a link to a reduced
  reproduction is ideal)
- Browser/Node version, and the `rater-js` version you're using

## Development setup

Development and CI use Node.js 24. With [nvm](https://github.com/nvm-sh/nvm)
installed, select the configured version and install dependencies:

```sh
nvm use
npm ci
```

Build the native ESM and standalone browser distributions:

```sh
npm run build
```

Run the test suite and TypeScript declaration checks. This command also builds
the distributions first:

```sh
npm test
```

Verify the files that would be included in the npm package:

```sh
npm run test:package
```

## Submitting a pull request

1. Fork the repo and create a branch from `master`.
2. Make your change, adding or updating tests where it makes sense.
3. Make sure `npm test` and `npm run build` both pass.
4. Open a pull request describing the change and why it's needed.

Small, focused PRs are easier to review and merge than large ones, so
prefer splitting unrelated changes into separate PRs when possible.

## Releasing (maintainers)

1. `npm version patch|minor|major` (bumps `package.json`, commits, tags
   locally)
2. `git push && git push --tags`
3. Create a GitHub Release from the new tag (GitHub UI, or
   `gh release create vX.Y.Z --generate-notes`)

Publishing to npm happens automatically via
[.github/workflows/release.yml](.github/workflows/release.yml) once the
Release is published. The workflow also attaches the native ESM build,
standalone browser build, and sourcemap to the GitHub Release.

## Other ways to help

You can also support the project by starring it, or by
[becoming a sponsor on GitHub](https://github.com/sponsors/fredolss) or
making a PayPal donation — see the README for links. Thanks again for your
support, it's much appreciated! 🙏

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By
participating, you're expected to uphold it.
