/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject } from 'rxjs';
import { Scroller } from './scroller';
import { Process, ProcessStatus as Status } from './interfaces/index';
import { Init, Scroll, Reload, Start, PreFetch, Fetch, PostFetch, Render, Clip, Adjust, End } from './processes/index';
var Workflow = /** @class */ (function () {
    function Workflow(context) {
        var _this = this;
        this.context = context;
        this.scroller = new Scroller(this.context, this.callWorkflow.bind(this));
        this.process$ = new BehaviorSubject((/** @type {?} */ ({
            process: Process.init,
            status: Status.start
        })));
        this.cyclesDone = 0;
        this.onScrollHandler = function (event) { return Scroll.run(_this.scroller, { event: event }); };
        if (this.scroller.settings.initializeDelay) {
            setTimeout(function () { return _this.init(); }, this.scroller.settings.initializeDelay);
        }
        else {
            this.init();
        }
    }
    /**
     * @return {?}
     */
    Workflow.prototype.init = /**
     * @return {?}
     */
    function () {
        this.scroller.init();
        this.scroller.logger.stat('initialization');
        this.initListeners();
    };
    /**
     * @return {?}
     */
    Workflow.prototype.initListeners = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var scroller = this.scroller;
        scroller.logger.log(function () { return "uiScroll Workflow listeners are being initialized"; });
        this.itemsSubscription = scroller.buffer.$items.subscribe(function (items) { return _this.context.items = items; });
        this.workflowSubscription = this.process$.subscribe(this.process.bind(this));
        this.initScrollEventListener();
    };
    /**
     * @return {?}
     */
    Workflow.prototype.initScrollEventListener = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var passiveSupported = false;
        try {
            window.addEventListener('test', (/** @type {?} */ ({})), Object.defineProperty({}, 'passive', {
                get: function () { return passiveSupported = true; }
            }));
        }
        catch (err) {
        }
        this.scrollEventOptions = passiveSupported ? { passive: false } : false;
        this.scroller.viewport.scrollEventElement.addEventListener('scroll', this.onScrollHandler, this.scrollEventOptions);
    };
    /**
     * @return {?}
     */
    Workflow.prototype.detachScrollEventListener = /**
     * @return {?}
     */
    function () {
        this.scroller.viewport.scrollEventElement.removeEventListener('scroll', this.onScrollHandler, this.scrollEventOptions);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    Workflow.prototype.process = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var scroller = this.scroller;
        var status = data.status, payload = data.payload;
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
    };
    /**
     * @param {?} processSubject
     * @return {?}
     */
    Workflow.prototype.callWorkflow = /**
     * @param {?} processSubject
     * @return {?}
     */
    function (processSubject) {
        this.process$.next(processSubject);
    };
    /**
     * @return {?}
     */
    Workflow.prototype.done = /**
     * @return {?}
     */
    function () {
        var state = this.scroller.state;
        this.cyclesDone++;
        state.workflowCycleCount = this.cyclesDone + 1;
        state.isInitialWorkflowCycle = false;
        state.workflowPending = false;
        if (state.scrollState.scrollTimer === null) {
            state.isLoading = false;
        }
        this.finalize();
    };
    /**
     * @return {?}
     */
    Workflow.prototype.dispose = /**
     * @return {?}
     */
    function () {
        this.detachScrollEventListener();
        this.process$.complete();
        this.workflowSubscription.unsubscribe();
        this.itemsSubscription.unsubscribe();
        this.scroller.dispose();
    };
    /**
     * @return {?}
     */
    Workflow.prototype.finalize = /**
     * @return {?}
     */
    function () {
    };
    return Workflow;
}());
export { Workflow };
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