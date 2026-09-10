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
        var elem = options.element;
        var reverse = options.reverse;
        var stars = options.max || 5;
        var starSize = options.starSize || 16;
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
        if (!rating) {
          elem.querySelector(".star-value").style.width = "0px";
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
          var percent;
          var width = elem.offsetWidth;
          var parentOffset = elem.getBoundingClientRect();
          if (reverse) {
            if (isTouch) {
              xCoor = e.changedTouches[0].pageX - parentOffset.left;
            } else {
              xCoor = e.pageX - window.scrollX - parentOffset.left;
            }
            var relXRtl = width - xCoor;
            var valueForDivision = width / 100;
            percent = relXRtl / valueForDivision;
          } else {
            if (isTouch) {
              xCoor = e.changedTouches[0].pageX - parentOffset.left;
            } else {
              xCoor = e.offsetX;
            }
            percent = xCoor / width * 100;
          }
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
            if (currentRating > stars) {
              currentRating = stars;
            }
            elem.querySelector(".star-value").style.width = currentRating / stars * 100 + "%";
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
            elem.querySelector(".star-value").style.width = "0%";
            elem.removeAttribute("data-rating");
          } else {
            elem.querySelector(".star-value").style.width = rating / stars * 100 + "%";
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
          elem.querySelector(".star-value").style.width = value / stars * 100 + "%";
          elem.setAttribute("data-rating", value);
        }
        function getRating() {
          return rating;
        }
        function clear() {
          rating = null;
          elem.querySelector(".star-value").style.width = "0px";
          elem.removeAttribute("title");
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
