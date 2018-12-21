import { BehaviorSubject } from 'rxjs';
import { UiScrollComponent } from '../ui-scroll.component';
import { Scroller } from './scroller';
import { ProcessSubject } from './interfaces/index';
export declare class Workflow {
    scroller: Scroller;
    process$: BehaviorSubject<ProcessSubject>;
    cyclesDone: number;
    readonly context: UiScrollComponent;
    readonly onScrollHandler: EventListener;
    private itemsSubscription;
    private workflowSubscription;
    private scrollEventOptions;
    constructor(context: UiScrollComponent);
    init(): void;
    initListeners(): void;
    initScrollEventListener(): void;
    detachScrollEventListener(): void;
    process(data: ProcessSubject): void;
    callWorkflow(processSubject: ProcessSubject): void;
    done(): void;
    dispose(): void;
    finalize(): void;
}
