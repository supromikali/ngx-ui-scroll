import { Scroller } from '../scroller';
export default class Fetch {
    static run(scroller: Scroller): void;
    static success(data: Array<any>, scroller: Scroller): void;
    static fail(error: string, scroller: Scroller): void;
    static get(scroller: Scroller): any;
}
