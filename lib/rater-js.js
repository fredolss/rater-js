/*! rater-js. [c] 2018 Fredrik Olsson. MIT License */

let css = require('./style.css'); 

module.exports = function rater(options) {

	//private fields
	let showToolTip = true; 

	if (typeof options.element === "undefined" || options.element === null) {
		throw new Error("element required"); 
	}

	if (typeof options.showToolTip !== "undefined") {
		showToolTip = !!options.showToolTip; 
	} 

	if(typeof options.step !== "undefined") {
		if(options.step <= 0 || options.step > 1){
			throw new Error("step must be a number between 0 and 1");
		}
	}

	let stars = options.max || 5; 
	let starSize = options.starSize || 16;
	let step = options.step || 1;
	let onHover = options.onHover; 
	let onLeave = options.onLeave; 
	let rating; 
	let myRating; 
	let elem = options.element; 
	elem.classList.add("star-rating"); 
	let div = document.createElement("div"); 
	div.classList.add("star-value"); 
	div.style.backgroundSize = starSize + "px"; 
	elem.appendChild(div); 
	elem.style.width = starSize * stars + "px"; 
	elem.style.height = starSize + "px"; 
	elem.style.backgroundSize = starSize + "px"; 
	let callback = options.rateCallback; 
	let disabled =  !!options.readOnly; 
	let disableText; 
	let isRating = false; 
	let isBusyText = options.isBusyText; 
	let currentRating; 
	let ratingText;
	
	if (typeof options.disableText !== "undefined") {
		disableText = options.disableText;
	} else {
		disableText = "{rating}/{maxRating}";
	}

	if(typeof options.ratingText !== "undefined"){
		ratingText = options.ratingText;
	} else {
		ratingText = "{rating}/{maxRating}";
	}
	
	if(options.rating){
		setRating(options.rating);
	} else {
		var dataRating = elem.dataset.rating;

		if(dataRating){
			setRating(+dataRating);
		}
	}

	if(typeof rating === "undefined"){
		elem.querySelector(".star-value").style.width = "0px"; 
	}

	if(disabled){
		disable();
	}

	//private methods
	function onMouseMove(e) {

		if (disabled === true || isRating === true) {
			return; 
		}
		
		let xCoor = e.offsetX; 
		let width = elem.offsetWidth; 
		let percent = (xCoor/width) * 100; 

		if (percent < 101) {
			if(step === 1) {
				currentRating = Math.ceil((percent / 100) * stars);
			} else {
				let rat = (percent / 100) * stars;
				for(let i = 0;; i+=step){
					if(i >= rat){
						currentRating = i;
						break;
					}
				}
			}

			elem.querySelector(".star-value").style.width = currentRating/stars * 100 + "%"; 
	 
			if (showToolTip) {
				let toolTip = ratingText.replace("{rating}", currentRating); 
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
			elem.querySelector(".star-value").style.width = rating/stars * 100 + "%"; 
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
			
			callback.call(this, myRating, function() {
		        if (disabled === false) {
					elem.removeAttribute("data-title"); 
				}

				isRating = false; 
			}); 
		}
	}

	//public methods
	function disable() {
		disabled = true; 
		if(showToolTip && !!disableText){
			let toolTip = disableText.replace("{rating}", rating); 
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
		if(typeof value === "undefined"){
			throw new Error("Value not set.");
		}

		if(typeof value !== "number"){
			throw new Error("Value must be a number.");
		}

		if(value < 0 || value > stars){
			let ratingError = new Error("Value too high. Please set a rating of " + stars + " or below.");
			ratingError.name = "ratingError";
			throw ratingError;
		}

		rating = value;
		elem.querySelector(".star-value").style.width = value/stars * 100 + "%"; 
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

	let module =  {
		setRating:setRating, 
		getRating:getRating, 
		disable:disable, 
		enable:enable, 
		dispose:dispose 
	}; 

	elem.addEventListener("click", onStarClick.bind(module)); 

	return module; 
}