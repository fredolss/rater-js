interface RaterOptions {
    element:HTMLElement;
    rateCallback?:(callback:(rating:number) => void) => any; 
    max?:number; 
    rating?:number; 
    disableText?:string; 
    ratingText?:string;
    showToolTip?:boolean;
}

interface Rater {
    disable:() => void; 
    enable:() => void;
    dispose: ()=> void;
    setRating:(ratig) => void; 
    getRating:() => number; 
}

declare module "rater-js" {
    export default raterFunction;
}

declare function raterFunction(options:RaterOptions): Rater;