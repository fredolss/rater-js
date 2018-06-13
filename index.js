(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.raterJs = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

/*! rater-js. [c] 2018 Fredrik Olsson. MIT License */
var css = require('./style.css');

module.exports = function rater(options) {
  //private fields
  var showToolTip = true;

  if (typeof options.element === "undefined" || options.element === null) {
    throw new Error("element required");
  }

  if (typeof options.showToolTip !== "undefined") {
    showToolTip = !!options.showToolTip;
  }

  if (typeof options.step !== "undefined") {
    if (options.step <= 0 || options.step > 1) {
      throw new Error("step must be a number between 0 and 1");
    }
  }

  var stars = options.max || 5;
  var starSize = options.starSize || 16;
  var step = options.step || 1;
  var onHover = options.onHover;
  var onLeave = options.onLeave;
  var rating;
  var myRating;
  var elem = options.element;
  elem.classList.add("star-rating");
  var div = document.createElement("div");
  div.classList.add("star-value");
  div.style.backgroundSize = starSize + "px";
  elem.appendChild(div);
  elem.style.width = starSize * stars + "px";
  elem.style.height = starSize + "px";
  elem.style.backgroundSize = starSize + "px";
  var callback = options.rateCallback;
  var disabled = !!options.readOnly;
  var disableText;
  var isRating = false;
  var isBusyText = options.isBusyText;
  var currentRating;
  var ratingText;

  if (typeof options.disableText !== "undefined") {
    disableText = options.disableText;
  } else {
    disableText = "{rating}/{maxRating}";
  }

  if (typeof options.ratingText !== "undefined") {
    ratingText = options.ratingText;
  } else {
    ratingText = "{rating}/{maxRating}";
  }

  if (options.rating) {
    setRating(options.rating);
  } else {
    var dataRating = elem.dataset.rating;

    if (dataRating) {
      setRating(+dataRating);
    }
  }

  if (typeof rating === "undefined") {
    elem.querySelector(".star-value").style.width = "0px";
  }

  if (disabled) {
    disable();
  } //private methods


  function onMouseMove(e) {
    if (disabled === true || isRating === true) {
      return;
    }

    var xCoor = e.offsetX;
    var width = elem.offsetWidth;
    var percent = xCoor / width * 100;

    if (percent < 101) {
      if (step === 1) {
        currentRating = Math.ceil(percent / 100 * stars);
      } else {
        var rat = percent / 100 * stars;

        for (var i = 0;; i += step) {
          if (i >= rat) {
            currentRating = i;
            break;
          }
        }
      }

      elem.querySelector(".star-value").style.width = currentRating / stars * 100 + "%";

      if (showToolTip) {
        var toolTip = ratingText.replace("{rating}", currentRating);
        toolTip = toolTip.replace("{maxRating}", stars);
        elem.setAttribute("data-title", toolTip);
      }

      if (typeof onHover === "function") {
        onHover(currentRating, rating);
      }
    }
  }

  function onStarOut(e) {
    if (typeof rating !== "undefined") {
      elem.querySelector(".star-value").style.width = rating / stars * 100 + "%";
      elem.setAttribute("data-rating", rating);
    } else {
      elem.querySelector(".star-value").style.width = "0%";
      elem.removeAttribute("data-rating");
    }

    if (typeof onLeave === "function") {
      onLeave(currentRating, rating);
    }
  }

  function onStarClick(e) {
    if (disabled === true) {
      return;
    }

    if (isRating === true) {
      return;
    }

    if (typeof callback !== "undefined") {
      isRating = true;
      myRating = currentRating;

      if (typeof isBusyText === "undefined") {
        elem.removeAttribute("data-title");
      } else {
        elem.setAttribute("data-title", isBusyText);
      }

      callback.call(this, myRating, function () {
        if (disabled === false) {
          elem.removeAttribute("data-title");
        }

        isRating = false;
      });
    }
  } //public methods


  function disable() {
    disabled = true;

    if (showToolTip && !!disableText) {
      var toolTip = disableText.replace("{rating}", rating);
      toolTip = toolTip.replace("{maxRating}", stars);
      elem.setAttribute("data-title", toolTip);
    } else {
      elem.removeAttribute("data-title");
    }
  }

  function enable() {
    disabled = false;
    elem.removeAttribute("data-title");
  }

  function setRating(value) {
    if (typeof value !== "number" && typeof value !== "undefined") {
      throw new Error("Value must be a number or undefined.");
    }

    if (value < 0 || value > stars) {
      var ratingError = new Error("Value too high. Please set a rating of " + stars + " or below.");
      ratingError.name = "ratingError";
      throw ratingError;
    }

    rating = value;
    elem.querySelector(".star-value").style.width = value / stars * 100 + "%";
    elem.setAttribute("data-rating", value);
  }

  function getRating() {
    return rating;
  }

  function dispose() {
    elem.removeEventListener("mousemove", onMouseMove);
    elem.removeEventListener("mouseleave", onStarOut);
    elem.removeEventListener("click", onStarClick);
  }

  elem.addEventListener("mousemove", onMouseMove);
  elem.addEventListener("mouseleave", onStarOut);
  var module = {
    setRating: setRating,
    getRating: getRating,
    disable: disable,
    enable: enable,
    dispose: dispose
  };
  elem.addEventListener("click", onStarClick.bind(module));
  return module;
};

},{"./style.css":2}],2:[function(require,module,exports){
var css = ".star-rating {\n  width: 0;\n  position: relative;\n  display: inline-block;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDguOSIgaGVpZ2h0PSIxMDMuNiIgdmlld0JveD0iMCAwIDEwOC45IDEwMy42Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2UzZTZlNjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnN0YXJfMDwvdGl0bGU+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+PGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMTA4LjkgMzkuNiA3MS4zIDM0LjEgNTQuNCAwIDM3LjYgMzQuMSAwIDM5LjYgMjcuMiA2Ni4xIDIwLjggMTAzLjYgNTQuNCA4NS45IDg4LjEgMTAzLjYgODEuNyA2Ni4xIDEwOC45IDM5LjYiLz48L2c+PC9nPjwvc3ZnPgo=);\n  background-position: 0 0;\n  background-repeat: repeat-x;\n  cursor: pointer;\n}\n.star-rating[data-title]:hover:after {\n  content: attr(data-title);\n  padding: 4px 8px;\n  color: #333;\n  position: absolute;\n  left: 0;\n  top: 100%;\n  z-index: 20;\n  white-space: nowrap;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  -moz-box-shadow: 0px 0px 4px #222;\n  -webkit-box-shadow: 0px 0px 4px #222;\n  box-shadow: 0px 0px 4px #222;\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));\n  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);\n}\n.star-rating .star-value {\n  height: 100%;\n  position: absolute;\n}\n.star-rating .star-value {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  background: url('data:image/svg+xml;base64,PHN2ZwoJeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTA4LjkiIGhlaWdodD0iMTAzLjYiIHZpZXdCb3g9IjAgMCAxMDguOSAxMDMuNiI+Cgk8ZGVmcz4KCQk8c3R5bGU+LmNscy0xe2ZpbGw6I2YxYzk0Nzt9PC9zdHlsZT4KCTwvZGVmcz4KCTx0aXRsZT5zdGFyMTwvdGl0bGU+Cgk8ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj4KCQk8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgoJCQk8cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iNTQuNCAwIDcxLjMgMzQuMSAxMDguOSAzOS42IDgxLjcgNjYuMSA4OC4xIDEwMy42IDU0LjQgODUuOSAyMC44IDEwMy42IDI3LjIgNjYuMSAwIDM5LjYgMzcuNiAzNC4xIDU0LjQgMCIvPgoJCTwvZz4KCTwvZz4KPC9zdmc+Cg==');\n  background-repeat: repeat-x;\n}\n"; (require("browserify-css").createStyle(css, { "href": "lib\\style.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":3}],3:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}]},{},[1])(1)
});
