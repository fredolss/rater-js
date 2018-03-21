function onload(event) {
   
	 var myDataService =  {
		 rate:function(rating) {
				return {then:function (callback) {
					setTimeout(function () {
						callback(Math.floor((Math.random() * 5) + 1)); 
					}, 1000); 
				}
			}
		}
	}

   var starRating = rater( { isBusyText: "Rating in progress. Please wait...", element:document.querySelector("#rater"), rateCallback:function rateCallback(rating, done) {
	 starRating.setAvgRating(rating); 
	 	myDataService.rate().then(function (avgRating) {
			 starRating.setAvgRating(avgRating); 
			 done(); 
		 }); 
	}}); 

    var starRating2 = rater( {
		max:5, 
		rating:4, 
		element:document.querySelector("#rater2"), 
		disableText:"Custom disable text!", 
		ratingText:"My custom rating text {rating}", 
		rateCallback:function rateCallback(rating, done) {
			starRating2.setAvgRating(rating); 
			starRating2.disable(); 
			done(); 
		}
	}); 

	var starRating3 = rater( {
		max:16, 
		readOnly:true, 
		rating:4, 
		element:document.querySelector("#rater3"), 
		rateCallback:function rateCallback(rating, done) {
			starRating3.setAvgRating(rating); 
			starRating3.disable(); 
			done(); 
		}
	}); 
}

window.addEventListener("load", onload, false); 