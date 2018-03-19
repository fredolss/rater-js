interface RaterOptions {
    element:HTMLElement;
    rateCallback:(callback:(rating:number) => void) => any; 
    max?:number; 
    rating?:number; 
    disableText?:string; 
    ratingText?:string; 
}

interface Rater {
    disable:() => void; 
    enable:() => void;
    dispose: ()=> void;
    setAvgRating:(ratig) => void; 
    getAvgRating:() => number; 
    getMyRating:() => number; 
    setMyRating:(rating) => void;
}

declare module "rater" {
    export = raterFunction;
}

declare function raterFunction (options:RaterOptions): Rater;