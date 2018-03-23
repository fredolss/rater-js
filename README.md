Rater Js
========

![rater-js Logo](ratings.png)

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/fredolss/rater-js.svg?branch=master)](https://travis-ci.org/fredolss/rater-js)

**rater-js** is a star rating widget for the browser.

### Main features:

* Unlimited number of stars.
* Custom css. Use your own image as star.

[**Try Rater JS  Demo →**][RaterJS]

## Installation

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

The widget will be available globally as "raterJs" on the window object.

### Node/Browserify
Just require the module.
```js
var rater = require("rater-js");
```

Lastly we can use the widget like this:
```js
 var myRater = rater({element: document.querySelector("#rater"), rateCallback: function rateCallback(rating, done) {
                //make async call to server however you want
                //in this example we have a 'service' that rate and returns the average rating
                myDataService.rate(rate).then(function(avgRating) {
                    //update the avarage rating with the one we get from the server
                    myRater.setAvgRating(avgRating);
                     //we could disable the rater to prevent another rating
                     //if we dont want the user to be able to change their mind
                    myRater.disable();
                    //dont forget to call done
                    done();
                }, function(error) {
                        //handle the error
                        //dont forget to call done
                        done();
                });
	}});
```

Css will be injected at runtime, but you can override the css to get the look you want.

```css
//make the stars red
.star-rating .star-value {
        background-color: red !important;
}

//change the whole image used as the star. Make sure to set starWidth in options if not 18px.
.star-rating .star-bg{
        background: url("myStar.svg") !important;
}
```

## Configuration

```js
{
        element: HtmlElement, //required
        rateCallback: Function,
        max: "Number of stars",
        starWidth: "Width of the star image in pixels",
        disableText: "Text",
        ratingText: "Text {rating}",
        isBusyText: "Text", //displayed while user is rating but done not called yet
        readOnly: true/false
}

```

## Methods

```js
disable(): //Disable the widget
enable(): //Enable the widget
setAvgRating(rating:number): //Set the average rating
getAvgRating(): //Get the average rating
getMyRating(): //Get the rating the user submitted
setMyRating(rating:number): //Set the rating the user submitted
```


[RaterJs]:https://fredolss.github.io/rater-js/example/  "RaterJs"
[npm-image]: https://img.shields.io/npm/v/rater-js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/rater-js
[license-url]: LICENSE.md
[license-image]: https://img.shields.io/:license-mit-blue.svg?style=flat-square
[downloads-image]: http://img.shields.io/npm/dm/rater-js.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/rater-js