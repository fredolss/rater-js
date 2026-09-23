import raterJs, { type Rater, type RaterOptions } from "rater-js";

const element = document.createElement("div");

const options: RaterOptions = {
    element,
    isBusyText: "Saving rating",
    onHover(currentRating, selectedRating) {
        const current: number = currentRating;
        const selected: number | null = selectedRating;
        void current;
        void selected;
    },
    onLeave(currentRating, selectedRating) {
        const current: number | undefined = currentRating;
        const selected: number | null = selectedRating;
        void current;
        void selected;
    },
    rateCallback(rating, done) {
        const instance: Rater = this;
        instance.setRating(rating);
        done();
    }
};

const rater: Rater = raterJs(options);
const rating: number | null = rater.getRating();
const originalElement: HTMLElement = rater.element;

void rating;
void originalElement;
