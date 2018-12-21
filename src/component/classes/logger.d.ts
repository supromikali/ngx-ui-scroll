import { Scroller } from '../scroller';
import { ProcessSubject } from '../interfaces/index';
export declare class Logger {
    readonly debug: boolean;
    readonly immediateLog: boolean;
    readonly logTime: boolean;
    readonly getTime: Function;
    readonly getStat: Function;
    readonly getFetchRange: Function;
    readonly getInnerLoopCount: Function;
    readonly getWorkflowCycleData: Function;
    private logs;
    constructor(scroller: Scroller);
    object(str: string, obj: any, stringify?: boolean): void;
    stat(str?: string): void;
    fetch(str?: string): void;
    logProcess(data: ProcessSubject): void;
    log(...args: Array<any>): void;
    logForce(...args: Array<any>): void;
}
