/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Process, ProcessStatus } from '../interfaces/index';
/** @type {?} */
const getIsInitialized = (adapter) => Observable.create((observer) => {
    /** @type {?} */
    const intervalId = setInterval(() => {
        if (adapter && adapter.init) {
            clearInterval(intervalId);
            observer.next(true);
            observer.complete();
        }
    }, 25);
});
const ɵ0 = getIsInitialized;
/** @type {?} */
const getInitializedSubject = (adapter, method) => {
    return adapter.init ? method() :
        adapter.init$
            .pipe(switchMap(() => method()));
};
const ɵ1 = getInitializedSubject;
/** @type {?} */
export const itemAdapterEmpty = (/** @type {?} */ ({
    data: {},
    element: {}
}));
/** @type {?} */
export const generateMockAdapter = () => ((/** @type {?} */ ({
    version: null,
    init: false,
    init$: observableOf(false),
    isLoading: false,
    isLoading$: new BehaviorSubject(false),
    cyclePending: false,
    cyclePending$: new BehaviorSubject(false),
    loopPending: false,
    loopPending$: new BehaviorSubject(false),
    firstVisible: itemAdapterEmpty,
    firstVisible$: new BehaviorSubject(itemAdapterEmpty),
    lastVisible: itemAdapterEmpty,
    lastVisible$: new BehaviorSubject(itemAdapterEmpty),
    itemsCount: 0,
    initialize: () => null,
    reload: () => null,
    showLog: () => null,
    setMinIndex: () => null,
    setScrollPosition: () => null
})));
export class Adapter {
    /**
     * @return {?}
     */
    get init() {
        return this.isInitialized;
    }
    /**
     * @return {?}
     */
    get init$() {
        return getIsInitialized(this);
    }
    /**
     * @return {?}
     */
    get version() {
        return this.isInitialized ? this.getVersion() : null;
    }
    /**
     * @return {?}
     */
    get isLoading() {
        return this.isInitialized ? this.getIsLoading() : false;
    }
    /**
     * @return {?}
     */
    get isLoading$() {
        return getInitializedSubject(this, () => this.getIsLoading$());
    }
    /**
     * @return {?}
     */
    get loopPending() {
        return this.isInitialized ? this.getLoopPending() : false;
    }
    /**
     * @return {?}
     */
    get loopPending$() {
        return getInitializedSubject(this, () => this.getLoopPending$());
    }
    /**
     * @return {?}
     */
    get cyclePending() {
        return this.isInitialized ? this.getCyclePending() : false;
    }
    /**
     * @return {?}
     */
    get cyclePending$() {
        return getInitializedSubject(this, () => this.getCyclePending$());
    }
    /**
     * @return {?}
     */
    get firstVisible() {
        return this.isInitialized ? this.getFirstVisible() : {};
    }
    /**
     * @return {?}
     */
    get firstVisible$() {
        return getInitializedSubject(this, () => this.getFirstVisible$());
    }
    /**
     * @return {?}
     */
    get lastVisible() {
        return this.isInitialized ? this.getLastVisible() : {};
    }
    /**
     * @return {?}
     */
    get lastVisible$() {
        return getInitializedSubject(this, () => this.getLastVisible$());
    }
    /**
     * @return {?}
     */
    get itemsCount() {
        return this.isInitialized ? this.getItemsCount() : 0;
    }
    constructor() {
        this.isInitialized = false;
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    initialize(scroller) {
        if (this.isInitialized) {
            return;
        }
        this.scroller = scroller;
        const { state, buffer } = scroller;
        this.isInitialized = true;
        this.callWorkflow = scroller.callWorkflow;
        this.getVersion = () => scroller.version;
        this.getIsLoading = () => state.isLoading;
        this.getIsLoading$ = () => state.isLoadingSource;
        this.getLoopPending = () => state.loopPending;
        this.getLoopPending$ = () => state.loopPendingSource;
        this.getCyclePending = () => state.workflowPending;
        this.getCyclePending$ = () => state.workflowPendingSource;
        this.getItemsCount = () => buffer.getVisibleItemsCount();
        this.initializeProtected(scroller);
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    initializeProtected(scroller) {
        const { state } = scroller;
        /** @type {?} */
        let getFirstVisibleProtected = () => {
            getFirstVisibleProtected = () => state.firstVisibleItem;
            state.firstVisibleWanted = true;
            return state.firstVisibleItem;
        };
        /** @type {?} */
        let getFirstVisible$Protected = () => {
            getFirstVisible$Protected = () => state.firstVisibleSource;
            state.firstVisibleWanted = true;
            return state.firstVisibleSource;
        };
        /** @type {?} */
        let getLastVisibleProtected = () => {
            getLastVisibleProtected = () => state.lastVisibleItem;
            state.lastVisibleWanted = true;
            return state.lastVisibleItem;
        };
        /** @type {?} */
        let getLastVisible$Protected = () => {
            getLastVisible$Protected = () => state.lastVisibleSource;
            state.lastVisibleWanted = true;
            return state.lastVisibleSource;
        };
        this.getFirstVisible = () => getFirstVisibleProtected();
        this.getFirstVisible$ = () => getFirstVisible$Protected();
        this.getLastVisible = () => getLastVisibleProtected();
        this.getLastVisible$ = () => getLastVisible$Protected();
    }
    /**
     * @param {?=} reloadIndex
     * @return {?}
     */
    reload(reloadIndex) {
        this.scroller.logger.log(() => `adapter: reload(${reloadIndex})`);
        this.callWorkflow((/** @type {?} */ ({
            process: Process.reload,
            status: ProcessStatus.start,
            payload: reloadIndex
        })));
    }
    /**
     * @return {?}
     */
    showLog() {
        this.scroller.logger.logForce();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setScrollPosition(value) {
        this.scroller.logger.log(() => `adapter: setScrollPosition(${value})`);
        /** @type {?} */
        const position = Number(value);
        /** @type {?} */
        const parsedValue = parseInt((/** @type {?} */ (value)), 10);
        if (position !== parsedValue) {
            this.scroller.logger.log(() => `can't set scroll position because ${value} is not an integer`);
        }
        else {
            this.scroller.state.syntheticScroll.reset();
            this.scroller.viewport.setPosition(value);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setMinIndex(value) {
        this.scroller.logger.log(() => `adapter: setMinIndex(${value})`);
        /** @type {?} */
        const index = Number(value);
        if (isNaN(index)) {
            this.scroller.logger.log(() => `can't set minIndex because ${value} is not a number`);
        }
        else {
            this.scroller.buffer.minIndexUser = index;
        }
    }
}
if (false) {
    /** @type {?} */
    Adapter.prototype.scroller;
    /** @type {?} */
    Adapter.prototype.isInitialized;
    /** @type {?} */
    Adapter.prototype.callWorkflow;
    /** @type {?} */
    Adapter.prototype.getVersion;
    /** @type {?} */
    Adapter.prototype.getIsLoading;
    /** @type {?} */
    Adapter.prototype.getIsLoading$;
    /** @type {?} */
    Adapter.prototype.getCyclePending;
    /** @type {?} */
    Adapter.prototype.getCyclePending$;
    /** @type {?} */
    Adapter.prototype.getLoopPending;
    /** @type {?} */
    Adapter.prototype.getLoopPending$;
    /** @type {?} */
    Adapter.prototype.getItemsCount;
    /** @type {?} */
    Adapter.prototype.getFirstVisible;
    /** @type {?} */
    Adapter.prototype.getFirstVisible$;
    /** @type {?} */
    Adapter.prototype.getLastVisible;
    /** @type {?} */
    Adapter.prototype.getLastVisible$;
}
export { ɵ0, ɵ1 };
//# sourceMappingURL=adapter.js.map