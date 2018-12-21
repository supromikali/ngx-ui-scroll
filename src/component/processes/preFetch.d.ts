import { Scroller } from '../scroller';
export default class PreFetch {
    static run(scroller: Scroller): void;
    static setStartDelta(scroller: Scroller): void;
    static setFetchIndexes(scroller: Scroller): void;
    static setFirstIndexBuffer(scroller: Scroller, startPosition: number): number;
    static setLastIndexBuffer(scroller: Scroller, startPosition: number, endPosition: number): void;
    static skipBufferedItems(scroller: Scroller): void;
    static checkFetchPackSize(scroller: Scroller): void;
    static setFetchDirection(scroller: Scroller): void;
}
