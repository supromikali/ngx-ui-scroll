import { Scroller } from '../scroller';
export default class Adjust {
    static MAX_SCROLL_ADJUSTMENTS_COUNT: number;
    static run(scroller: Scroller): void;
    static setPaddings(scroller: Scroller): boolean | number;
    static fixScrollPosition(scroller: Scroller, bwdPaddingAverageSizeItemsCount: number): void;
    static setScroll(scroller: Scroller, delta: number): void;
}
