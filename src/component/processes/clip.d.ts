import { Scroller } from '../scroller';
import { Direction } from '../interfaces/index';
export default class Clip {
    static run(scroller: Scroller): void;
    static prepareClip(scroller: Scroller): void;
    static prepareClipByDirection(scroller: Scroller, direction: Direction, edgeIndex: number): void;
    static doClip(scroller: Scroller): void;
}
