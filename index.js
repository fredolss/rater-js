(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["rater-js"], factory); 
  }else if (typeof module === "object" && module.exports) {
    module.exports = factory(); 
  }else {
    root.rater = factory(); 
  }
}(this, function() {

	return function rater(options) {

       if (typeof options.element === "undefined") {
		   throw new Error("element required"); 
	   }

	   if (typeof options.rateCallback === "undefined") {
		   throw new Error("rateCallback required"); 
	   }

		//private fields
		var stars = options.max || 10; 
		var starWidth = 18; 

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

		if (!options.readOnly) {
			disableText = options.disableText || "Thank you for your vote!"; 
		}
		
		var ratingText = options.ratingText || "Set a rating of {rating}"; 

		//private methods
		function onMouseMove(e) {

			if (disabled === true || block === true) {
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

			callback.call(this, my_rating); 
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

})); 