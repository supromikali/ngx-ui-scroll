import { Scroller } from '../scroller';
import { ProcessRun } from '../interfaces/index';
export default class End {
    static run(scroller: Scroller, error?: any): void;
    static endWorkflowLoop(scroller: Scroller): void;
    static calculateParams(scroller: Scroller): void;
    static getNext(scroller: Scroller, error?: any): ProcessRun | null;
    static continueWorkflowByTimer(scroller: Scroller): void;
}
