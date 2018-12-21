import { Scroller } from '../scroller';
export default class Render {
    static run(scroller: Scroller): void;
    static processElements(scroller: Scroller): boolean;
    static processWindowScrollBackJump(scroller: Scroller, scrollBeforeRender: number): void;
}
