import { Direction } from '../interfaces/direction';
import { Routines } from './domRoutines';
import { Settings } from './settings';
export declare class Padding {
    element: HTMLElement;
    direction: Direction;
    routines: Routines;
    constructor(element: HTMLElement, direction: Direction, routines: Routines);
    reset(size?: number): void;
    size: number;
}
export declare class Paddings {
    settings: Settings;
    forward: Padding;
    backward: Padding;
    constructor(element: HTMLElement, routines: Routines, settings: Settings);
    reset(viewportSize: number, startIndex: number): void;
    getPositiveSize(startIndex: number, viewportSize: number): number;
    getNegativeSize(startIndex: number): number;
}
