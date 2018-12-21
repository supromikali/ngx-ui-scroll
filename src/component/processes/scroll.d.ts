import { Scroller } from '../scroller';
import { ScrollPayload } from '../interfaces/index';
export default class Scroll {
    static run(scroller: Scroller, payload?: ScrollPayload): void;
    static processSyntheticScroll(scroller: Scroller): boolean;
    static delayScroll(scroller: Scroller, payload: ScrollPayload): void;
    static doScroll(scroller: Scroller): void;
}
