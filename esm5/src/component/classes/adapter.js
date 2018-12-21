/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Process, ProcessStatus } from '../interfaces/index';
/** @type {?} */
var getIsInitialized = function (adapter) {
    return Observable.create(function (observer) {
        /** @type {?} */
        var intervalId = setInterval(function () {
            if (adapter && adapter.init) {
                clearInterval(intervalId);
                observer.next(true);
                observer.complete();
            }
        }, 25);
    });
};
var ɵ0 = getIsInitialized;
/** @type {?} */
var getInitializedSubject = function (adapter, method) {
    return adapter.init ? method() :
        adapter.init$
            .pipe(switchMap(function () {
            return method();
        }));
};
var ɵ1 = getInitializedSubject;
/** @type {?} */
export var itemAdapterEmpty = (/** @type {?} */ ({
    data: {},
    element: {}
}));
/** @type {?} */
export var generateMockAdapter = function () { return ((/** @type {?} */ ({
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
    initialize: function () { return null; },
    reload: function () { return null; },
    showLog: function () { return null; },
    setMinIndex: function () { return null; },
    setScrollPosition: function () { return null; }
}))); };
var Adapter = /** @class */ (function () {
    function Adapter() {
        this.isInitialized = false;
    }
    Object.defineProperty(Adapter.prototype, "init", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "init$", {
        get: /**
         * @return {?}
         */
        function () {
            return getIsInitialized(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "version", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized ? this.getVersion() : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "isLoading", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized ? this.getIsLoading() : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "isLoading$", {
        get: /**
         * @return {?}
         */
        function () {
            var _this = this;
            return getInitializedSubject(this, function () { return _this.getIsLoading$(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "loopPending", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized ? this.getLoopPending() : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "loopPending$", {
        get: /**
         * @return {?}
         */
        function () {
            var _this = this;
            return getInitializedSubject(this, function () { return _this.getLoopPending$(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "cyclePending", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized ? this.getCyclePending() : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "cyclePending$", {
        get: /**
         * @return {?}
         */
        function () {
            var _this = this;
            return getInitializedSubject(this, function () { return _this.getCyclePending$(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "firstVisible", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized ? this.getFirstVisible() : {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "firstVisible$", {
        get: /**
         * @return {?}
         */
        function () {
            var _this = this;
            return getInitializedSubject(this, function () { return _this.getFirstVisible$(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "lastVisible", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized ? this.getLastVisible() : {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "lastVisible$", {
        get: /**
         * @return {?}
         */
        function () {
            var _this = this;
            return getInitializedSubject(this, function () { return _this.getLastVisible$(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "itemsCount", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isInitialized ? this.getItemsCount() : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} scroller
     * @return {?}
     */
    Adapter.prototype.initialize = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        if (this.isInitialized) {
            return;
        }
        this.scroller = scroller;
        var state = scroller.state, buffer = scroller.buffer;
        this.isInitialized = true;
        this.callWorkflow = scroller.callWorkflow;
        this.getVersion = function () { return scroller.version; };
        this.getIsLoading = function () { return state.isLoading; };
        this.getIsLoading$ = function () { return state.isLoadingSource; };
        this.getLoopPending = function () { return state.loopPending; };
        this.getLoopPending$ = function () { return state.loopPendingSource; };
        this.getCyclePending = function () { return state.workflowPending; };
        this.getCyclePending$ = function () { return state.workflowPendingSource; };
        this.getItemsCount = function () { return buffer.getVisibleItemsCount(); };
        this.initializeProtected(scroller);
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Adapter.prototype.initializeProtected = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state;
        /** @type {?} */
        var getFirstVisibleProtected = function () {
            getFirstVisibleProtected = function () { return state.firstVisibleItem; };
            state.firstVisibleWanted = true;
            return state.firstVisibleItem;
        };
        /** @type {?} */
        var getFirstVisible$Protected = function () {
            getFirstVisible$Protected = function () { return state.firstVisibleSource; };
            state.firstVisibleWanted = true;
            return state.firstVisibleSource;
        };
        /** @type {?} */
        var getLastVisibleProtected = function () {
            getLastVisibleProtected = function () { return state.lastVisibleItem; };
            state.lastVisibleWanted = true;
            return state.lastVisibleItem;
        };
        /** @type {?} */
        var getLastVisible$Protected = function () {
            getLastVisible$Protected = function () { return state.lastVisibleSource; };
            state.lastVisibleWanted = true;
            return state.lastVisibleSource;
        };
        this.getFirstVisible = function () { return getFirstVisibleProtected(); };
        this.getFirstVisible$ = function () { return getFirstVisible$Protected(); };
        this.getLastVisible = function () { return getLastVisibleProtected(); };
        this.getLastVisible$ = function () { return getLastVisible$Protected(); };
    };
    /**
     * @param {?=} reloadIndex
     * @return {?}
     */
    Adapter.prototype.reload = /**
     * @param {?=} reloadIndex
     * @return {?}
     */
    function (reloadIndex) {
        this.scroller.logger.log(function () { return "adapter: reload(" + reloadIndex + ")"; });
        this.callWorkflow((/** @type {?} */ ({
            process: Process.reload,
            status: ProcessStatus.start,
            payload: reloadIndex
        })));
    };
    /**
     * @return {?}
     */
    Adapter.prototype.showLog = /**
     * @return {?}
     */
    function () {
        this.scroller.logger.logForce();
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Adapter.prototype.setScrollPosition = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.scroller.logger.log(function () { return "adapter: setScrollPosition(" + value + ")"; });
        /** @type {?} */
        var position = Number(value);
        /** @type {?} */
        var parsedValue = parseInt((/** @type {?} */ (value)), 10);
        if (position !== parsedValue) {
            this.scroller.logger.log(function () {
                return "can't set scroll position because " + value + " is not an integer";
            });
        }
        else {
            this.scroller.state.syntheticScroll.reset();
            this.scroller.viewport.setPosition(value);
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Adapter.prototype.setMinIndex = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.scroller.logger.log(function () { return "adapter: setMinIndex(" + value + ")"; });
        /** @type {?} */
        var index = Number(value);
        if (isNaN(index)) {
            this.scroller.logger.log(function () {
                return "can't set minIndex because " + value + " is not a number";
            });
        }
        else {
            this.scroller.buffer.minIndexUser = index;
        }
    };
    return Adapter;
}());
export { Adapter };
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