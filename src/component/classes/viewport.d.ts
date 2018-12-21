import { ElementRef } from '@angular/core';
import { Direction } from '../interfaces/index';
import { Paddings } from './paddings';
import { Settings } from './settings';
import { Routines } from './domRoutines';
import { State } from './state';
import { Logger } from './logger';
export declare class Viewport {
    paddings: Paddings;
    startDelta: number;
    readonly element: HTMLElement;
    readonly host: HTMLElement;
    readonly scrollEventElement: HTMLElement | Document;
    readonly scrollable: HTMLElement;
    readonly settings: Settings;
    readonly routines: Routines;
    readonly state: State;
    readonly logger: Logger;
    constructor(elementRef: ElementRef, settings: Settings, routines: Routines, state: State, logger: Logger);
    reset(scrollPosition: number): void;
    setPosition(value: number, oldPosition?: number): number;
    scrollPosition: number;
    getSize(): number;
    getScrollableSize(): number;
    getBufferPadding(): number;
    getEdge(direction: Direction, opposite?: boolean): number;
    getElementEdge(element: HTMLElement, direction: Direction, opposite?: boolean): number;
    getOffset(): number;
}
