function onload(event){
   
   var starRating = rater({element:document.querySelector("#rater"), rateCallback: function rateCallback(rating) {
 	starRating.setRating(rating);
        starRating.disable();
	}});

    var starRating2 = rater(
	    {
		max:16,
		readOnly:true,
		rating:4, 
		element: document.querySelector("#rater2"),
		disableText:"Thanks!",
		ratingText:"My custom rating text {rating}", 
		rateCallback: function rateCallback(rating) {
			starRating2.setRating(rating);
			starRating2.disable();
		}
	});
}

window.addEventListener("load",onload,false);