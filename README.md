![rater-js Logo](ratings.png)

**rater-js** is a star rating widget for the browser.

Main features:

* Unlimited number of stars.
* Custom css. Use your own image as star.

## Install

```
npm install rater-js --save
```

## Usage

**rater-js** can be used with amd, commonjs or without any module loader using global scope.


In your html create an element that acts as the placeholder for the widget.

```html
<div id="rater"></div>
```

### Global scope
Directly reference the js from the module

```html
<!--Add js before end body tag-->
<script src="node-modules/rater-js/index.js"></script>
```

The widget will be available globally as "rater" on the window object.

### Node/Browserify
Just require the module.
```js
var rater = require("rater-js");
```

Lastly we can use the widget like this:
```js
 var myRater = rater({element: document.querySelector("#rater"), rateCallback: function rateCallback(rating) {
                //make async call to server
                myRater.setRating(rating);
                //we could disable the rater to prevent another rating
                myRater.disable();
	}});
```

Alternativly reference the provided css from the node modules. You can use  your own css too of course.

```html
<!--Add the styling to the head-->
<link href="node-modules/rater-js/rater-js.css" rel="stylesheet"> 
```

See <a href="example/index.html">Example</a> for more information.

## Configuration

```js
{
        element: HtmlElement,
        rateCallback: Function,
        max: "Number of stars",
        disableText: "Text",
        ratingText: "Text {rating}",
        readOnly: true/false
}

```

## Methods

```
disable: Disable the widget
enable: Enable the widget
setRating(rating:number): Set the rating
```