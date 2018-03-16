function onload(event){
   
   var starRating = rater({element:document.querySelector("#rater"), rateCallback: function rateCallback(rating) {
 	starRating.setAvgRating(rating);
        starRating.disable();
	}});

    var starRating2 = rater(
	    {
		max:5,
		rating:4, 
		element: document.querySelector("#rater2"),
		disableText:"Custom disable text!",
		ratingText:"My custom rating text {rating}", 
		rateCallback: function rateCallback(rating) {
			starRating2.setAvgRating(rating);
			starRating2.disable();
		}
	});

	var starRating3 = rater(
	    {
		max:16,
		readOnly:true,
		rating:4, 
		element: document.querySelector("#rater3"),
		rateCallback: function rateCallback(rating) {
			starRating3.setAvgRating(rating);
			starRating3.disable();
		}
	});
}

window.addEventListener("load",onload,false);