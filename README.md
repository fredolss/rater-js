![rater-js logo](assets/img/rater-js-banner.svg)


[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Node.js CI](https://github.com/fredolss/rater-js/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/fredolss/rater-js/actions/workflows/node.js.yml)
[![Sponsor][sponsor-image]][sponsor-url]
[![Donate][donate-image]][donate-url]

# rater-js

`rater-js` is a lightweight, dependency-free star rating widget for the browser.
It supports mouse and touch input, fractional ratings, custom star images, and
right-to-left layouts.

## Features

- Any number of stars
- Fractional rating steps
- Mouse and touch support
- Right-to-left support
- Read-only ratings
- Custom star size, spacing, images, and text
- Native ES modules for modern bundlers
- Standalone browser build for use without a bundler
- TypeScript declarations included

[**Try the live demo →**][RaterJS]

## Installation

```sh
npm install rater-js
```

## Quick start

Add an element that will contain the rating widget:

```html
<div id="rater"></div>
```

Create a rater for that element:

```js
import raterJs from "rater-js";

const rater = raterJs({
    element: document.querySelector("#rater"),
    rateCallback(rating, done) {
        this.setRating(rating);
        done();
    }
});
```

`rateCallback` receives the selected rating and a `done` callback. Always call
`done()` after synchronous or asynchronous rating work has finished so the
widget can leave its busy state. Inside `rateCallback`, `this` refers to the
rater instance.

## Using rater-js with a bundler

`rater-js` is a native ES module. Vite, webpack, Parcel, Rollup, and esbuild can
consume it directly:

```js
import raterJs from "rater-js";

const rater = raterJs({
    element: document.querySelector("#rater")
});
```

## Using rater-js without a bundler

Load the standalone browser build before the closing `body` tag:

```html
<script src="node_modules/rater-js/dist/rater-js.iife.min.js"></script>
<script>
    const rater = window.raterJs({
        element: document.querySelector("#rater")
    });
</script>
```

The same file is available from npm CDNs such as jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/rater-js@2/dist/rater-js.iife.min.js"></script>
```

## Usage

### Initial rating

Set the initial value with the `rating` option:

```js
const rater = raterJs({
    element: document.querySelector("#rater"),
    rating: 3.5
});
```

You can also provide the initial value through a `data-rating` attribute:

```html
<div id="rater" data-rating="3.5"></div>
```

```js
const rater = raterJs({
    element: document.querySelector("#rater")
});
```

### Multiple raters

Each call to `raterJs` creates one independent rater for one element. Create an
instance for every matching element when a page contains multiple ratings:

```html
<div class="rater" data-rating="2"></div>
<div class="rater" data-rating="4"></div>
```

```js
const raters = [...document.querySelectorAll(".rater")].map((element) =>
    raterJs({
        element,
        rateCallback(rating, done) {
            this.setRating(rating);
            done();
        }
    })
);
```

The returned array contains the individual instances, so each rater can be
updated, disabled, cleared, or disposed independently.

### Fractional ratings

Use `step` to control the selectable precision. It must be greater than `0` and
no greater than `1`:

```js
const rater = raterJs({
    element: document.querySelector("#rater"),
    rating: 3.5,
    step: 0.5
});
```

### Spacing between stars

Stars have a 2-pixel gap by default. Set `starSpacing` to a non-negative number,
or use `0` for the original layout without gaps:

```js
const rater = raterJs({
    element: document.querySelector("#rater"),
    starSize: 32,
    starSpacing: 6
});
```

### Read-only ratings

```js
const rater = raterJs({
    element: document.querySelector("#rater"),
    rating: 4.4,
    readOnly: true
});
```

### Right-to-left ratings

Set `reverse` to `true` to reverse the rating direction:

```html
<div dir="rtl">
    <div id="rater"></div>
</div>
```

```js
const rater = raterJs({
    element: document.querySelector("#rater"),
    reverse: true
});
```

### Hover callbacks

Use `onHover` and `onLeave` to display the value currently under the pointer:

```html
<span id="rater"></span>
<span id="live-rating"></span>
```

```js
const rater = raterJs({
    element: document.querySelector("#rater"),
    onHover: (currentRating, selectedRating) => {
        document.querySelector("#live-rating").textContent = currentRating;
    },
    onLeave: (currentRating, selectedRating) => {
        document.querySelector("#live-rating").textContent = selectedRating || "";
    }
});
```

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `HTMLElement` | Required | Element that will contain the rater. |
| `rateCallback` | `function(rating, done)` | — | Called when a rating is selected. Call `done()` when processing has finished. The rater instance is available as `this`. |
| `max` | `number` | `5` | Number of stars to display. |
| `rating` | `number` | No rating | Initial rating. A `data-rating` value on `element` is used when this option is not supplied. |
| `step` | `number` | `1` | Rating precision. Must be greater than `0` and no greater than `1`. |
| `starSize` | `number` | `16` | Width and height of each star in pixels. |
| `starSpacing` | `number` | `2` | Non-negative gap between stars in pixels. Use `0` for no gap. |
| `showToolTip` | `boolean` | `true` | Shows rating text in the element's `title` attribute while hovering. |
| `ratingText` | `string` | `"{rating}/{maxRating}"` | Hover text. Supports `{rating}` and `{maxRating}` placeholders. |
| `disableText` | `string` | `"{rating}/{maxRating}"` | Tooltip used while the rater is disabled. Supports `{rating}` and `{maxRating}` placeholders. |
| `isBusyText` | `string` | — | Tooltip displayed while `rateCallback` is waiting for `done()`. |
| `readOnly` | `boolean` | `false` | Creates the rater in a disabled state. |
| `reverse` | `boolean` | `false` | Reverses the rating direction for right-to-left layouts. |
| `onHover` | `function(currentRating, selectedRating)` | — | Called while the pointer moves over the rater. |
| `onLeave` | `function(currentRating, selectedRating)` | — | Called when the pointer leaves the rater. |

## Methods and properties

| Member | Description |
| --- | --- |
| `setRating(rating)` | Sets the current rating. The value must be a number between `0` and `max`. |
| `getRating()` | Returns the selected rating, or `null` when no rating is set. |
| `clear()` | Clears the selected rating and resets the visual value. |
| `disable()` | Prevents user interaction and applies the disabled state. |
| `enable()` | Restores user interaction. |
| `dispose()` | Removes the mouse and touch event handlers registered by the instance. |
| `element` | Returns the element used by the rater instance. |

## Custom styling

The default CSS and SVG stars are injected at runtime. Override the background
images to use your own stars. Set `starSize` when the images should be displayed
at a size other than 16 pixels.

```css
/* Image used for the unselected stars. */
.star-rating {
    background-image: url("my-star-off.svg") !important;
}

/* Image used for the selected stars. */
.star-rating .star-value {
    background-image: url("my-star-on.svg") !important;
}
```

## Contributing

Want to contribute? Awesome! The most basic way to show your support is to
star the project, or to raise issues. You can also support this project by
[becoming a sponsor on GitHub][sponsor-url] or by making a
[PayPal donation][donate-url] to ensure this journey continues indefinitely!

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up a dev environment
and submit a pull request.

Thanks again for your support, it is much appreciated! 🙏

## Development

Development and CI use Node.js 24. With nvm installed, select the configured
version and run the build and test suite:

```sh
nvm use
npm ci
npm test
npm run test:package
```

## Migrating from 1.x

Version 2.0 is ESM-only. Replace CommonJS `require` calls with a default import:

```diff
- const raterJs = require("rater-js");
+ import raterJs from "rater-js";
```

CommonJS and AMD loaders are no longer supported. For direct browser usage,
replace the old root bundle with the standalone browser build:

```diff
- <script src="node_modules/rater-js/index.js"></script>
+ <script src="node_modules/rater-js/dist/rater-js.iife.min.js"></script>
```

The browser global remains `window.raterJs`.

### Releasing

1. `npm version patch|minor|major` (bumps package.json, commits, tags locally)
2. `git push && git push --tags`
3. Create a GitHub Release from the new tag (GitHub UI, or `gh release create vX.Y.Z --generate-notes`)

Publishing to npm happens automatically via [.github/workflows/release.yml](.github/workflows/release.yml) once the Release is published. The workflow also attaches the ESM build, standalone browser build, and sourcemap to the GitHub Release.

## License

`rater-js` is available under the [MIT License][license-url].

[RaterJS]: https://fredolss.github.io/rater-js/example/ "rater-js demo"
[sponsor-url]: https://github.com/sponsors/fredolss
[donate-url]: https://paypal.me/folssondev
[npm-image]: https://img.shields.io/npm/v/rater-js.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rater-js
[license-url]: LICENSE
[license-image]: https://img.shields.io/npm/l/rater-js.svg?style=flat-square
[downloads-image]: https://img.shields.io/npm/dm/rater-js.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/rater-js
[sponsor-image]: https://img.shields.io/badge/sponsor-fredolss-EA4AAA.svg?style=flat-square&logo=github-sponsors&logoColor=white
[donate-image]: https://img.shields.io/badge/donate-PayPal-00457C.svg?style=flat-square&logo=paypal&logoColor=white
