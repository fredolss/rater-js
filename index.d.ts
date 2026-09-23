export interface RaterOptions {
    element: HTMLElement;
    rateCallback?(this: Rater, rating: number, done: () => void): void;
    max?: number;
    rating?: number;
    disableText?: string;
    ratingText?: string;
    isBusyText?: string;
    showToolTip?: boolean;
    starSize?: number;
    starSpacing?: number;
    step?: number;
    readOnly?: boolean;
    reverse?: boolean;
    onHover?(currentRating: number, selectedRating: number | null): void;
    onLeave?(currentRating: number | undefined, selectedRating: number | null): void;
}

export interface Rater {
    disable(): void;
    enable(): void;
    dispose(): void;
    setRating(rating: number): void;
    getRating(): number | null;
    clear(): void;
    readonly element: HTMLElement;
}

export default function raterJs(options: RaterOptions): Rater;
