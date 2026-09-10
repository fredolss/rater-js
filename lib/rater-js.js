/*! rater-js. [c] 2018 Fredrik Olsson. MIT License */

let css = require('./style.css'); 

module.exports = function(options) {

	//private fields
	let showToolTip = true; 

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
	let elem = options.element; 
	let reverse = options.reverse;
	let stars = options.max || 5; 
	let starSize = options.starSize || 16; 
	let starSpacing = typeof options.starSpacing === "undefined" ? 2 : options.starSpacing;
	let step = options.step || 1; 
	let onHover = options.onHover; 
	let onLeave = options.onLeave; 
	let rating = null; 
	let myRating; 
	elem.classList.add("star-rating"); 
	let div = document.createElement("div"); 
	div.classList.add("star-value"); 
	if(reverse) {
		div.classList.add("rtl");
	}
	elem.appendChild(div); 
	elem.style.width = starSize * stars + starSpacing * (stars - 1) + "px";
	elem.style.height = starSize + "px"; 
	configureBackground(elem);
	configureBackground(div);
	let callback = options.rateCallback; 
	let disabled =  !!options.readOnly; 
	let disableText; 
	let isRating = false; 
	let isBusyText = options.isBusyText; 
	let currentRating; 
	let ratingText; 
	
	if (typeof options.disableText !== "undefined") {
		disableText = options.disableText; 
	}else {
		disableText = "{rating}/{maxRating}"; 
	}

	if (typeof options.ratingText !== "undefined") {
		ratingText = options.ratingText; 
	}else {
		ratingText = "{rating}/{maxRating}"; 
	}
	
	if (options.rating) {
		setRating(options.rating); 
	}else {
		var dataRating = elem.dataset.rating; 

		if (dataRating) {
			setRating( + dataRating); 
		}
	}

	if ( ! rating) {
		setValueWidth(0);
	}

	if (disabled) {
		disable(); 
	}

	//private methods
	function onMouseMove(e) {
		onMove(e,false);
	}

	/**
	 * Called by eventhandlers when mouse or touch events are triggered
	 * @param {MouseEvent} e
	 */
	function onMove(e, isTouch) {

		if (disabled === true || isRating === true) {
			return; 
		}
		
		let xCoor = null;
		let width = elem.offsetWidth;
		let parentOffset = elem.getBoundingClientRect();
		let view = elem.ownerDocument.defaultView;

		if(isTouch) {
			let touch = e.changedTouches[0];
			if (typeof touch.clientX === "number") {
				xCoor = touch.clientX - parentOffset.left;
			}else {
				xCoor = touch.pageX - (view ? view.pageXOffset : 0) - parentOffset.left;
			}
		} else {
			xCoor = e.clientX - parentOffset.left;
		}

		if (reverse) {
			xCoor = width - xCoor;
		}

		let rawRating = coordinateToRating(xCoor, width);

		if (rawRating <= stars) {
			if (step === 1) {
				currentRating = Math.ceil(rawRating);
			}else {
				currentRating = Math.ceil(rawRating / step) * step;
				currentRating = Number(currentRating.toFixed(10));
			}

			//todo: check why this happens and fix
			if(currentRating > stars) {
				currentRating = stars;
			}

			setValueWidth(currentRating);
	 
			if (showToolTip) {
				let toolTip = ratingText.replace("{rating}", currentRating); 
				toolTip = toolTip.replace("{maxRating}", stars); 
				elem.setAttribute("title", toolTip); 
			}
				
			if (typeof onHover === "function") {
				onHover(currentRating, rating); 
			}
		}
	}

	/**
	 * Called when mouse is released. This function will update the view with the rating.
	 * @param {MouseEvent} e
	 */
	function onStarOut(e) {

		if (!rating) {
			setValueWidth(0);
			elem.removeAttribute("data-rating"); 
		}else {
			setValueWidth(rating);
			elem.setAttribute("data-rating", rating); 
		}

		if (typeof onLeave === "function") {
			onLeave(currentRating, rating); 
		}
	}

	/**
	 * Called when star is clicked.
	 * @param {MouseEvent} e
	 */
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
			}else {
				elem.setAttribute("title", isBusyText); 
			}
			
			elem.classList.add("is-busy");
			callback.call(module, myRating, function() {
				if (disabled === false) {
					elem.removeAttribute("title"); 
				}

				isRating = false; 
				elem.classList.remove("is-busy");
			}); 
		}
	}

	/**
	 * Disables the rater so that it's not possible to click the stars.
	 */
	function disable() {
		disabled = true;
		elem.classList.add("disabled");

		if (showToolTip && !!disableText) {
			let toolTip = disableText.replace("{rating}", !!rating ? rating : 0); 
			toolTip = toolTip.replace("{maxRating}", stars); 
			 elem.setAttribute("title", toolTip); 
		}else {
			elem.removeAttribute("title"); 
		}
	}

	/**
	 * Enabled the rater so that it's possible to click the stars.
	 */
	function enable() {
		disabled = false; 
		elem.removeAttribute("title");
		elem.classList.remove("disabled");
	}

	/**
	 * Sets the rating
	 */
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

	/**
	 * Gets the rating
	 */
	function getRating() {
		return rating; 
	}

	/**
	 * Set the rating to a value to inducate it's not rated.
	 */
	function clear() {
		rating = null; 
		setValueWidth(0);
		elem.removeAttribute("title"); 
	}

	/**
	 * Configures one background layer per star when spacing is enabled.
	 */
	function configureBackground(target) {
		target.style.backgroundSize = starSize + "px";

		if (starSpacing === 0) {
			return;
		}

		let view = elem.ownerDocument.defaultView;
		let computedStyle = view && view.getComputedStyle ? view.getComputedStyle(target) : null;
		let backgroundImage = computedStyle && computedStyle.backgroundImage ? computedStyle.backgroundImage : "none";
		let images = [];
		let positions = [];

		for (let i = 0; i < stars; i++) {
			images.push(backgroundImage);
			positions.push(i * (starSize + starSpacing) + "px 0px");
		}

		target.style.setProperty("background-image", images.join(", "), "important");
		target.style.setProperty("background-position", positions.join(", "), "important");
		target.style.setProperty("background-repeat", "no-repeat", "important");
		target.style.setProperty("background-size", starSize + "px", "important");
	}

	/**
	 * Converts a rating to a visual width without counting gaps as star area.
	 */
	function setValueWidth(value) {
		if (starSpacing === 0) {
			div.style.width = value/stars * 100 + "%";
			return;
		}

		let width = value === 0 ? 0 : value * starSize + (Math.ceil(value) - 1) * starSpacing;
		div.style.width = width + "px";
	}

	/**
	 * Converts a pointer coordinate to a rating while ignoring gap width.
	 */
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

		let slotSize = starSize + starSpacing;
		let completeStars = Math.floor(xCoor / slotSize);
		let positionInSlot = xCoor - completeStars * slotSize;
		let partialStar = Math.min(positionInSlot / starSize, 1);

		return Math.min(completeStars + partialStar, stars);
	}

	/**
	 * Remove event handlers.
	 */
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

	let module =  {
		setRating:setRating, 
		getRating:getRating, 
		disable:disable, 
		enable:enable, 
		clear:clear, 
		dispose:dispose,
		get element() {
			return elem;
		}
	}; 

	 /**
	 * Handles touchmove event.
	 * @param {TouchEvent} e
	 */
	function handleMove(e) {
		e.preventDefault();
		onMove(e, true);
	}

	/**
	 * Handles touchstart event.
	 * @param {TouchEvent} e 
	 */
	function handleStart(e) {
		e.preventDefault();
		onMove(e,true);
	}

	/**
	 * Handles touchend event.
	 * @param {TouchEvent} e 
	 */
	function handleEnd(evt) {
		evt.preventDefault();
		onMove(evt,true);
		onStarClick();
	}

	/**
	 * Handles touchend event.
	 * @param {TouchEvent} e 
	 */
	function handleCancel(e) {
		e.preventDefault();
		onStarOut(e);
	}

	elem.addEventListener("click", onStarClick);
	elem.addEventListener("touchmove", handleMove, false);
	elem.addEventListener("touchstart", handleStart, false);
	elem.addEventListener("touchend", handleEnd, false);
	elem.addEventListener("touchcancel", handleCancel, false);

	return module; 
}
