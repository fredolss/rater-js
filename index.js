(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.raterJs = factory();
    }
}(typeof self !== "undefined" ? self : this, function () {
var raterJsBundle = function () {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = function __commonJS(cb, mod) {
    return function __require() {
      try {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
          exports: {}
        }).exports, mod), mod.exports;
      } catch (e) {
        throw mod = 0, e;
      }
    };
  };

  // inline-rater-css:style.css
  var require_style = __commonJS({
    "inline-rater-css:style.css": function inlineRaterCssStyleCss(exports, module) {
      var css = ".star-rating{width:0;position:relative;display:inline-block;background-image:url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"108.9\" height=\"103.6\" viewBox=\"0 0 108.9 103.6\"><defs><style>.cls-1{fill:%23e3e6e6;}<\\/style></defs><title>star_0</title><g id=\"Layer_2\" data-name=\"Layer 2\"><g id=\"Layer_1-2\" data-name=\"Layer 1\"><polygon class=\"cls-1\" points=\"108.9 39.6 71.3 34.1 54.4 0 37.6 34.1 0 39.6 27.2 66.1 20.8 103.6 54.4 85.9 88.1 103.6 81.7 66.1 108.9 39.6\"/></g></g></svg>%0A');background-position:0 0;background-repeat:repeat-x;cursor:pointer}.star-rating .star-value{position:absolute;height:100%;width:100%;background:url('data:image/svg+xml,<svg%0A%09xmlns=\"http://www.w3.org/2000/svg\" width=\"108.9\" height=\"103.6\" viewBox=\"0 0 108.9 103.6\">%0A%09<defs>%0A%09%09<style>.cls-1{fill:%23f1c947;}<\\/style>%0A%09</defs>%0A%09<title>star1</title>%0A%09<g id=\"Layer_2\" data-name=\"Layer 2\">%0A%09%09<g id=\"Layer_1-2\" data-name=\"Layer 1\">%0A%09%09%09<polygon class=\"cls-1\" points=\"54.4 0 71.3 34.1 108.9 39.6 81.7 66.1 88.1 103.6 54.4 85.9 20.8 103.6 27.2 66.1 0 39.6 37.6 34.1 54.4 0\"/>%0A%09%09</g>%0A%09</g>%0A</svg>%0A');background-repeat:repeat-x}.star-rating.disabled{cursor:default}.star-rating.is-busy{cursor:wait}.star-rating .star-value.rtl{-moz-transform:scaleX(-1);-o-transform:scaleX(-1);-webkit-transform:scaleX(-1);transform:scaleX(-1);filter:FlipH;-ms-filter:\"FlipH\";right:0;left:auto}\n";
      var styleMarker = "data-rater-js";
      if (typeof document !== "undefined" && !document.querySelector("style[" + styleMarker + "]")) {
        style = document.createElement("style");
        style.type = "text/css";
        style.setAttribute(styleMarker, "");
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        head.appendChild(style);
      }
      var style;
      var head;
      module.exports = css;
    }
  });

  // lib/rater-js.js
  var require_rater_js = __commonJS({
    "lib/rater-js.js": function lib_raterJsJs(exports, module) {
      /*! rater-js. [c] 2018 Fredrik Olsson. MIT License */
      var css = require_style();
      module.exports = function (options) {
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
        if (typeof options.starSpacing !== "undefined") {
          if (typeof options.starSpacing !== "number" || !isFinite(options.starSpacing) || options.starSpacing < 0) {
            throw new Error("starSpacing must be a non-negative number");
          }
        }
        var elem = options.element;
        var reverse = options.reverse;
        var stars = options.max || 5;
        var starSize = options.starSize || 16;
        var starSpacing = typeof options.starSpacing === "undefined" ? 2 : options.starSpacing;
        var step = options.step || 1;
        var onHover = options.onHover;
        var onLeave = options.onLeave;
        var rating = null;
        var myRating;
        elem.classList.add("star-rating");
        var div = document.createElement("div");
        div.classList.add("star-value");
        if (reverse) {
          div.classList.add("rtl");
        }
        elem.appendChild(div);
        elem.style.width = starSize * stars + starSpacing * (stars - 1) + "px";
        elem.style.height = starSize + "px";
        configureBackground(elem);
        configureBackground(div);
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
        if (!rating) {
          setValueWidth(0);
        }
        if (disabled) {
          disable();
        }
        function onMouseMove(e) {
          onMove(e, false);
        }
        function onMove(e, isTouch) {
          if (disabled === true || isRating === true) {
            return;
          }
          var xCoor = null;
          var width = elem.offsetWidth;
          var parentOffset = elem.getBoundingClientRect();
          var view = elem.ownerDocument.defaultView;
          if (isTouch) {
            var touch = e.changedTouches[0];
            if (typeof touch.clientX === "number") {
              xCoor = touch.clientX - parentOffset.left;
            } else {
              xCoor = touch.pageX - (view ? view.pageXOffset : 0) - parentOffset.left;
            }
          } else {
            xCoor = e.clientX - parentOffset.left;
          }
          if (reverse) {
            xCoor = width - xCoor;
          }
          var rawRating = coordinateToRating(xCoor, width);
          if (rawRating <= stars) {
            if (step === 1) {
              currentRating = Math.ceil(rawRating);
            } else {
              currentRating = Math.ceil(rawRating / step) * step;
              currentRating = Number(currentRating.toFixed(10));
            }
            if (currentRating > stars) {
              currentRating = stars;
            }
            setValueWidth(currentRating);
            if (showToolTip) {
              var toolTip = ratingText.replace("{rating}", currentRating);
              toolTip = toolTip.replace("{maxRating}", stars);
              elem.setAttribute("title", toolTip);
            }
            if (typeof onHover === "function") {
              onHover(currentRating, rating);
            }
          }
        }
        function onStarOut(e) {
          if (!rating) {
            setValueWidth(0);
            elem.removeAttribute("data-rating");
          } else {
            setValueWidth(rating);
            elem.setAttribute("data-rating", rating);
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
              elem.removeAttribute("title");
            } else {
              elem.setAttribute("title", isBusyText);
            }
            elem.classList.add("is-busy");
            callback.call(module2, myRating, function () {
              if (disabled === false) {
                elem.removeAttribute("title");
              }
              isRating = false;
              elem.classList.remove("is-busy");
            });
          }
        }
        function disable() {
          disabled = true;
          elem.classList.add("disabled");
          if (showToolTip && !!disableText) {
            var toolTip = disableText.replace("{rating}", !!rating ? rating : 0);
            toolTip = toolTip.replace("{maxRating}", stars);
            elem.setAttribute("title", toolTip);
          } else {
            elem.removeAttribute("title");
          }
        }
        function enable() {
          disabled = false;
          elem.removeAttribute("title");
          elem.classList.remove("disabled");
        }
        function setRating(value) {
          if (typeof value === "undefined") {
            throw new Error("Value not set.");
          }
          if (value === null) {
            throw new Error("Value cannot be null.");
          }
          if (typeof value !== "number") {
            throw new Error("Value must be a number.");
          }
          if (value < 0 || value > stars) {
            throw new Error("Value too high. Please set a rating of " + stars + " or below.");
          }
          rating = value;
          setValueWidth(value);
          elem.setAttribute("data-rating", value);
        }
        function getRating() {
          return rating;
        }
        function clear() {
          rating = null;
          setValueWidth(0);
          elem.removeAttribute("title");
        }
        function configureBackground(target) {
          target.style.backgroundSize = starSize + "px";
          if (starSpacing === 0) {
            return;
          }
          var view = elem.ownerDocument.defaultView;
          var computedStyle = view && view.getComputedStyle ? view.getComputedStyle(target) : null;
          var backgroundImage = computedStyle && computedStyle.backgroundImage ? computedStyle.backgroundImage : "none";
          var images = [];
          var positions = [];
          for (var i = 0; i < stars; i++) {
            images.push(backgroundImage);
            positions.push(i * (starSize + starSpacing) + "px 0px");
          }
          target.style.setProperty("background-image", images.join(", "), "important");
          target.style.setProperty("background-position", positions.join(", "), "important");
          target.style.setProperty("background-repeat", "no-repeat", "important");
          target.style.setProperty("background-size", starSize + "px", "important");
        }
        function setValueWidth(value) {
          if (starSpacing === 0) {
            div.style.width = value / stars * 100 + "%";
            return;
          }
          var width = value === 0 ? 0 : value * starSize + (Math.ceil(value) - 1) * starSpacing;
          div.style.width = width + "px";
        }
        function coordinateToRating(xCoor, width) {
          if (starSpacing === 0) {
            return xCoor / width * stars;
          }
          if (xCoor <= 0) {
            return 0;
          }
          if (xCoor >= width) {
            return stars;
          }
          var slotSize = starSize + starSpacing;
          var completeStars = Math.floor(xCoor / slotSize);
          var positionInSlot = xCoor - completeStars * slotSize;
          var partialStar = Math.min(positionInSlot / starSize, 1);
          return Math.min(completeStars + partialStar, stars);
        }
        function dispose() {
          elem.removeEventListener("mousemove", onMouseMove);
          elem.removeEventListener("mouseleave", onStarOut);
          elem.removeEventListener("click", onStarClick);
          elem.removeEventListener("touchmove", handleMove, false);
          elem.removeEventListener("touchstart", handleStart, false);
          elem.removeEventListener("touchend", handleEnd, false);
          elem.removeEventListener("touchcancel", handleCancel, false);
        }
        elem.addEventListener("mousemove", onMouseMove);
        elem.addEventListener("mouseleave", onStarOut);
        var module2 = {
          setRating: setRating,
          getRating: getRating,
          disable: disable,
          enable: enable,
          clear: clear,
          dispose: dispose,
          get element() {
            return elem;
          }
        };
        function handleMove(e) {
          e.preventDefault();
          onMove(e, true);
        }
        function handleStart(e) {
          e.preventDefault();
          onMove(e, true);
        }
        function handleEnd(evt) {
          evt.preventDefault();
          onMove(evt, true);
          onStarClick();
        }
        function handleCancel(e) {
          e.preventDefault();
          onStarOut(e);
        }
        elem.addEventListener("click", onStarClick);
        elem.addEventListener("touchmove", handleMove, false);
        elem.addEventListener("touchstart", handleStart, false);
        elem.addEventListener("touchend", handleEnd, false);
        elem.addEventListener("touchcancel", handleCancel, false);
        return module2;
      };
    }
  });
  return require_rater_js();
}();
    return raterJsBundle;
}));
