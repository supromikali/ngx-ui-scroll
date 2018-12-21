import { Direction } from '../interfaces/direction';
import { Settings } from './settings';
export declare class Routines {
    readonly horizontal: boolean;
    constructor(settings: Settings);
    getScrollPosition(element: HTMLElement): number;
    setScrollPosition(element: HTMLElement, value: number): void;
    getParams(element: HTMLElement): ClientRect;
    getSize(element: HTMLElement): number;
    getSizeStyle(element: HTMLElement): number;
    setSizeStyle(element: HTMLElement, value: number): void;
    getRectEdge(params: ClientRect, direction: Direction, opposite?: boolean): number;
    getEdge(element: HTMLElement, direction: Direction, opposite?: boolean): number;
    getEdge2(element: HTMLElement, direction: Direction, relativeElement: HTMLElement, opposite: boolean): number;
    hideElement(element: HTMLElement): void;
    getOffset(element: HTMLElement): number;
}
