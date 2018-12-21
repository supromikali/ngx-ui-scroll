import { Routines } from './domRoutines';
import { Direction } from '../interfaces/index';
export declare class Item {
    $index: number;
    data: any;
    nodeId: string;
    routines: Routines;
    element: HTMLElement;
    size: number;
    invisible: boolean;
    toRemove: boolean;
    removeDirection: Direction;
    constructor($index: number, data: any, routines: Routines);
    setSize(): void;
    hide(): void;
}
