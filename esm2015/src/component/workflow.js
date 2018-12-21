/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject } from 'rxjs';
import { Scroller } from './scroller';
import { Process, ProcessStatus as Status } from './interfaces/index';
import { Init, Scroll, Reload, Start, PreFetch, Fetch, PostFetch, Render, Clip, Adjust, End } from './processes/index';
export class Workflow {
    /**
     * @param {?} context
     */
    constructor(context) {
        this.context = context;
        this.scroller = new Scroller(this.context, this.callWorkflow.bind(this));
        this.process$ = new BehaviorSubject((/** @type {?} */ ({
            process: Process.init,
            status: Status.start
        })));
        this.cyclesDone = 0;
        this.onScrollHandler = event => Scroll.run(this.scroller, { event });
        if (this.scroller.settings.initializeDelay) {
            setTimeout(() => this.init(), this.scroller.settings.initializeDelay);
        }
        else {
            this.init();
        }
    }
    /**
     * @return {?}
     */
    init() {
        this.scroller.init();
        this.scroller.logger.stat('initialization');
        this.initListeners();
    }
    /**
     * @return {?}
     */
    initListeners() {
        /** @type {?} */
        const scroller = this.scroller;
        scroller.logger.log(() => `uiScroll Workflow listeners are being initialized`);
        this.itemsSubscription = scroller.buffer.$items.subscribe(items => this.context.items = items);
        this.workflowSubscription = this.process$.subscribe(this.process.bind(this));
        this.initScrollEventListener();
    }
    /**
     * @return {?}
     */
    initScrollEventListener() {
        /** @type {?} */
        let passiveSupported = false;
        try {
            window.addEventListener('test', (/** @type {?} */ ({})), Object.defineProperty({}, 'passive', {
                get: () => passiveSupported = true
            }));
        }
        catch (err) {
        }
        this.scrollEventOptions = passiveSupported ? { passive: false } : false;
        this.scroller.viewport.scrollEventElement.addEventListener('scroll', this.onScrollHandler, this.scrollEventOptions);
    }
    /**
     * @return {?}
     */
    detachScrollEventListener() {
        this.scroller.viewport.scrollEventElement.removeEventListener('scroll', this.onScrollHandler, this.scrollEventOptions);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    process(data) {
        /** @type {?} */
        const scroller = this.scroller;
        const { status, payload } = data;
        this.scroller.logger.logProcess(data);
        if (status === Status.error) {
            End.run(scroller, payload);
            return;
        }
        switch (data.process) {
            case Process.init:
                if (status === Status.start) {
                    Init.run(scroller);
                }
                if (status === Status.next) {
                    Start.run(scroller, payload);
                }
                break;
            case Process.reload:
                if (status === Status.start) {
                    Reload.run(scroller, payload);
                }
                if (status === Status.next) {
                    Init.run(scroller);
                }
                break;
            case Process.scroll:
                if (status === Status.next) {
                    if (!(payload && payload.keepScroll)) {
                        Init.run(scroller, payload);
                    }
                    else {
                        Start.run(scroller, payload);
                    }
                }
                break;
            case Process.start:
                if (status === Status.next) {
                    PreFetch.run(scroller);
                }
                break;
            case Process.preFetch:
                if (status === Status.done) {
                    End.run(scroller);
                }
                if (status === Status.next) {
                    Fetch.run(scroller);
                }
                break;
            case Process.fetch:
                if (status === Status.next) {
                    PostFetch.run(scroller);
                }
                break;
            case Process.postFetch:
                if (status === Status.next) {
                    Render.run(scroller);
                }
                if (status === Status.done) {
                    End.run(scroller);
                }
                break;
            case Process.render:
                if (status === Status.next) {
                    if (scroller.settings.infinite) {
                        Adjust.run(scroller);
                    }
                    else {
                        Clip.run(scroller);
                    }
                }
                break;
            case Process.clip:
                if (status === Status.next) {
                    Adjust.run(scroller);
                }
                break;
            case Process.adjust:
                if (status === Status.done) {
                    End.run(scroller);
                }
                break;
            case Process.end:
                if (status === Status.next) {
                    if (payload && payload.keepScroll) {
                        Scroll.run(scroller);
                    }
                    else {
                        Start.run(scroller, payload);
                    }
                }
                if (status === Status.done) {
                    this.done();
                }
                break;
        }
    }
    /**
     * @param {?} processSubject
     * @return {?}
     */
    callWorkflow(processSubject) {
        this.process$.next(processSubject);
    }
    /**
     * @return {?}
     */
    done() {
        const { state } = this.scroller;
        this.cyclesDone++;
        state.workflowCycleCount = this.cyclesDone + 1;
        state.isInitialWorkflowCycle = false;
        state.workflowPending = false;
        if (state.scrollState.scrollTimer === null) {
            state.isLoading = false;
        }
        this.finalize();
    }
    /**
     * @return {?}
     */
    dispose() {
        this.detachScrollEventListener();
        this.process$.complete();
        this.workflowSubscription.unsubscribe();
        this.itemsSubscription.unsubscribe();
        this.scroller.dispose();
    }
    /**
     * @return {?}
     */
    finalize() {
    }
}
if (false) {
    /** @type {?} */
    Workflow.prototype.scroller;
    /** @type {?} */
    Workflow.prototype.process$;
    /** @type {?} */
    Workflow.prototype.cyclesDone;
    /** @type {?} */
    Workflow.prototype.context;
    /** @type {?} */
    Workflow.prototype.onScrollHandler;
    /** @type {?} */
    Workflow.prototype.itemsSubscription;
    /** @type {?} */
    Workflow.prototype.workflowSubscription;
    /** @type {?} */
    Workflow.prototype.scrollEventOptions;
}
//# sourceMappingURL=workflow.js.map