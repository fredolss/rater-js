# rater

Star rating widget for the browser.

## Install

```
npm install rater-js --save
```

## Usage

rater-js can be used with amd, commonjs or without any module loader using rater from global scope.


In your html create a new element that acts as the placeholder for the widget.

```html
<!--Add the styling to the head-->
<link href="node-modules/rater-js/rater-js.css" rel="stylesheet"> 

<div id="rater"></div>

<!--Add js before end body tag-->
<script src="node-modules/rater-js/index.js"></script>

```

### Node/Browserfiy

```js

var rater = require("rater-js");

 var myRater = rater({element: document.querySelector("#rater"), rateCallback: function rateCallback(rating) {
                //make async call to server
                myRater.setRating(rating);
                //we could disable the rater after rating to prevent another rating
                myRater.disable();
	}});

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