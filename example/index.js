function onload() {
    const myDataService = {
        rate() {
            return new Promise((resolve) => {
                setTimeout(() => resolve(Math.random() * 5), 1000);
            });
        }
    };

    window.raterJs({
        starSize: 32,
        element: document.querySelector("#rater"),
        rateCallback(rating, done) {
            this.setRating(rating);
            done();
        }
    });

    [...document.querySelectorAll(".multiple-rater")].forEach((element) =>
        window.raterJs({
            element,
            rateCallback(rating, done) {
                this.setRating(rating);
                done();
            }
        })
    );

    window.raterJs({
        element: document.querySelector("#rater-spacing"),
        starSize: 32,
        starSpacing: 6,
        rating: 3.9
    });

    window.raterJs({
        starSize: 32,
        step: 0.5,
        element: document.querySelector("#rater-step"),
        rateCallback(rating, done) {
            this.setRating(rating);
            done();
        }
    });

    const busyRater = window.raterJs({
        isBusyText: "Rating in progress. Please wait...",
        element: document.querySelector("#rater4"),
        rateCallback(rating, done) {
            busyRater.setRating(rating);
            myDataService.rate().then((averageRating) => {
                busyRater.setRating(averageRating);
                done();
            });
        }
    });

    const disabledRater = window.raterJs({
        max: 5,
        rating: 4,
        element: document.querySelector("#rater2"),
        disableText: "Custom disable text!",
        ratingText: "My custom rating text {rating}",
        showToolTip: true,
        rateCallback(rating, done) {
            disabledRater.setRating(rating);
            disabledRater.disable();
            done();
        }
    });

    window.raterJs({
        max: 16,
        readOnly: true,
        rating: 4.4,
        element: document.querySelector("#rater3")
    });

    window.raterJs({
        max: 6,
        reverse: true,
        element: document.querySelector("#rater7"),
        rateCallback(rating, done) {
            this.setRating(rating);
            done();
        }
    });

    window.raterJs({
        element: document.querySelector("#rater5"),
        rateCallback(rating, done) {
            this.setRating(rating);
            done();
        },
        onHover: (currentRating) => {
            document.querySelector(".live-rating").textContent = currentRating;
        },
        onLeave: (_currentRating, selectedRating) => {
            document.querySelector(".live-rating").textContent = selectedRating ?? "";
        }
    });

    const clearableRater = window.raterJs({
        element: document.querySelector("#rater6"),
        rateCallback(rating, done) {
            this.setRating(rating);
            done();
        }
    });

    document.querySelector("#rater6-button").addEventListener("click", () => {
        clearableRater.clear();
        console.log(clearableRater.getRating());
    });
}

window.addEventListener("load", onload);
