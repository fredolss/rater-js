(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.raterJs = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var css = require('./style.css');

module.exports = function rater(options) {

	if (typeof options.element === "undefined") {
		throw new Error("element required"); 
	}
	
	//private fields
	var stars = options.max || 5; 
	var starWidth = options.starWidth || 18; 

	var rating; 
	var my_rating; 
	var elem = options.element; 
	elem.classList.add("star-rating"); 
	var div = document.createElement("div"); 
	div.classList.add("star-value"); 
	elem.appendChild(div); 
	div = document.createElement("div"); 
	div.classList.add("star-bg"); 
	elem.appendChild(div); 
	elem.style.width = starWidth * stars + "px"; 
	var callback = options.rateCallback; 
	var disabled =  !!options.readOnly; 
	var block = false; 
	var disableText;
	var isRating = false;
	var isBusyText = options.isBusyText;

	if (!options.readOnly) {
		disableText = options.disableText || "Thank you for your vote!"; 
	}
	
	var ratingText = options.ratingText || "Set a rating of {rating}"; 

	//private methods
	function onMouseMove(e) {

		if (disabled === true || block === true || isRating) {
			return; 
		}
		
		var xCoor = e.offsetX; 
		var width = elem.offsetWidth; 
		var percent = (xCoor/width) * 100; 

		if (percent < 101) {
			my_rating = Math.ceil((percent / 100) * stars); 
			elem.setAttribute("data-title", ratingText.replace("{rating}", my_rating)); 
			elem.querySelector(".star-value").style.width = my_rating/stars * 100 + "%"; 
		}
	}

	function onStarOut(e) {
		block = false; 
		if (typeof rating != "undefined") {
			elem.querySelector(".star-value").style.width = rating/stars * 100 + "%"; 
			elem.setAttribute("data-rating", rating); 
		}else {
			elem.querySelector(".star-value").style.width = "0%"; 
			elem.setAttribute("data-rating", undefined); 
		}
	}

	function onStarClick(e) {
		if (disabled === true) {
			return; 
		}

		if(isRating){
			return;
		}

		if(typeof callback !== "undefined" ){
			isRating = true;
			if(typeof isBusyText === "undefined"){
				elem.removeAttribute("data-title"); 
			} else {
				elem.setAttribute("data-title", isBusyText); 
			}
			
			callback.call(this, my_rating, function() {
				isRating = false;

				if(disabled === false){
					elem.removeAttribute("data-title"); 
				}
			});
		}

		block = true; 
	}

	//public methods
	function disable() {
		disabled = true; 
		elem.setAttribute("data-title", disableText); 
	}

	function enable() {
		disabled = false; 
		elem.setAttribute("data-title", undefined); 
	}

	function setAvgRating(value) {
		rating = value; 

		if (typeof value !== "undefined") {
			elem.querySelector(".star-value").style.width = value/stars * 100 + "%"; 
		} else {
			elem.querySelector(".star-value").style.width = "0px"; 
		}

		elem.setAttribute("data-rating", value); 
	}

	function getAvgRating() {
		return rating; 
	}

	function getMyRating() {
		return my_rating; 
	}

	function setMyRating(rating) {
		my_rating = rating; 
		elem.setAttribute("data-title", ratingText.replace("{rating}", my_rating)); 
		elem.querySelector(".star-value").style.width = my_rating/stars * 100 + "%"; 
	}

	function dispose() {
		if (!elem) {
			return; 
		}

		elem.removeEventListener("mousemove", onMouseMove); 
		elem.removeEventListener("mouseout", onStarOut); 
		elem.removeEventListener("click", onStarClick); 
	}

	setAvgRating(options.rating); 
	elem.addEventListener("mousemove", onMouseMove); 
	elem.addEventListener("mouseout", onStarOut); 

	var module = {
		setAvgRating:setAvgRating, 
		getAvgRating:getAvgRating, 
		getMyRating:getMyRating, 
		setMyRating:setMyRating, 
		disable:disable, 
		enable:enable, 
		dispose:dispose 
	}; 

	elem.addEventListener("click", onStarClick.bind(module)); 

	return module;
}
},{"./style.css":2}],2:[function(require,module,exports){
var css = ".star-rating {\n  width: 0;\n  height: 16px;\n  position: relative;\n  background-color: #ccc;\n}\n.star-rating[data-title]:hover:after {\n  content: attr(data-title);\n  padding: 4px 8px;\n  color: #333;\n  position: absolute;\n  left: 0;\n  top: 100%;\n  z-index: 20;\n  white-space: nowrap;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  -moz-box-shadow: 0px 0px 4px #222;\n  -webkit-box-shadow: 0px 0px 4px #222;\n  box-shadow: 0px 0px 4px #222;\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));\n  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);\n}\n.star-rating .star-value {\n  height: 100%;\n  position: absolute;\n  background-color: #ffbe10;\n}\n.star-rating .star-bg {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDYwIDQ4Ij48dGl0bGU+U3RhcjwvdGl0bGU+PHBhdGggZD0iTTE2LjMgNDMuNDA1Yy4wMDMtLjA4My45MzctMy41MDcgMi4wNzYtNy42MDggMS43NC02LjI2IDIuMDQ4LTcuNDg1IDEuOTI0LTcuNjI4LS4wODItLjA5NC0yLjczNy0yLjMzLTUuOS00Ljk3MmwtNS43NTMtNC44MDMgNy42LS4wMyA3LjYwMi0uMDI4IDIuNTItNy41N2MxLjM4OC00LjE2MyAyLjU1Mi03LjU3IDIuNTg3LTcuNTcuMDM1IDAgMS4xOCAzLjM5NSAyLjU0OCA3LjU0M2wyLjQ4NiA3LjU0MiA3LjYyMi4wNTcgNy42MjIuMDU1LTUuODc2IDQuOTA1LTUuOTA3IDQuOTI3Yy0uMDE2LjAxMy45MTUgMy40NDMgMi4wNyA3LjYyIDEuMTU4IDQuMTggMi4wODcgNy42MTQgMi4wNjcgNy42MzMtLjAyLjAyLTIuODYtMS45NjctNi4zMDgtNC40MTQtMy40NS0yLjQ0OC02LjMyNi00LjQzMi02LjM5Mi00LjQxLS4xLjAzNi0xMC4zNzYgNy4yOS0xMi4wNTUgOC41MS0uMzIyLjIzNC0uNTM1LjMzLS41MzMuMjR6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAtMi42Njd2NTMuMzM0aDYwVi0yLjY2N0gwem0zMC4yOTIgMS43MWw3LjEyNSAxOC44NzRoMjEuNDE2TDQyLjE2NyAzMC4wODNsNS45NTggMTguODc1LTE3LjgzMy0xMS4wODMtMTcuODM0IDExLjA4MyA1LjkxNy0xOC44NzVMMS43NSAxNy45MTdoMjEuMzc1TDMwLjI5Mi0uOTU4eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMC4yNzctLjk1MkwzNy40MTIgMTcuOWgyMS40MDRMNDIuMTY4IDMwLjFsNS45NDYgMTguODUyLTE3LjgzNy0xMS4wOS0xNy44MzcgMTEuMDlMMTguMzg2IDMwLjEgMS43MzggMTcuOWgyMS40MDR6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iLjMzNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==') repeat;\n  background-size: contain;\n}\n"; (require("browserify-css").createStyle(css, { "href": "lib\\style.css" }, { "insertAt": "bottom" })); module.exports = css;
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
