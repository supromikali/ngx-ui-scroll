/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject } from 'rxjs';
import { FetchModel } from './fetch';
import { itemAdapterEmpty } from './adapter';
var WindowScrollState = /** @class */ (function () {
    function WindowScrollState() {
        this.reset();
    }
    /**
     * @return {?}
     */
    WindowScrollState.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.delta = 0;
        this.positionToUpdate = 0;
    };
    return WindowScrollState;
}());
if (false) {
    /** @type {?} */
    WindowScrollState.prototype.positionToUpdate;
    /** @type {?} */
    WindowScrollState.prototype.delta;
}
var ScrollState = /** @class */ (function () {
    function ScrollState() {
        this.window = new WindowScrollState();
        this.reset();
    }
    /**
     * @return {?}
     */
    ScrollState.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.firstScroll = false;
        this.firstScrollTime = 0;
        this.lastScrollTime = 0;
        this.scrollTimer = null;
        this.workflowTimer = null;
        this.scroll = false;
        this.keepScroll = false;
        this.window.reset();
    };
    return ScrollState;
}());
if (false) {
    /** @type {?} */
    ScrollState.prototype.firstScroll;
    /** @type {?} */
    ScrollState.prototype.firstScrollTime;
    /** @type {?} */
    ScrollState.prototype.lastScrollTime;
    /** @type {?} */
    ScrollState.prototype.scrollTimer;
    /** @type {?} */
    ScrollState.prototype.workflowTimer;
    /** @type {?} */
    ScrollState.prototype.scroll;
    /** @type {?} */
    ScrollState.prototype.keepScroll;
    /** @type {?} */
    ScrollState.prototype.window;
}
var SyntheticScroll = /** @class */ (function () {
    function SyntheticScroll() {
        this.reset(null);
    }
    /**
     * @param {?=} position
     * @return {?}
     */
    SyntheticScroll.prototype.reset = /**
     * @param {?=} position
     * @return {?}
     */
    function (position) {
        if (position === void 0) { position = null; }
        this.position = position;
        this.positionBefore = null;
        this.delta = 0;
        this.time = 0;
        this.readyToReset = false;
    };
    return SyntheticScroll;
}());
if (false) {
    /** @type {?} */
    SyntheticScroll.prototype.position;
    /** @type {?} */
    SyntheticScroll.prototype.positionBefore;
    /** @type {?} */
    SyntheticScroll.prototype.delta;
    /** @type {?} */
    SyntheticScroll.prototype.time;
    /** @type {?} */
    SyntheticScroll.prototype.readyToReset;
}
var State = /** @class */ (function () {
    function State(settings, logger) {
        this.settings = settings;
        this.logger = logger;
        this.initTime = Number(new Date());
        this.innerLoopCount = 0;
        this.isInitialLoop = false;
        this.workflowCycleCount = 1;
        this.isInitialWorkflowCycle = false;
        this.countDone = 0;
        this.setCurrentStartIndex(settings.startIndex);
        this.fetch = new FetchModel();
        this.clip = false;
        this.clipCall = 0;
        this.sizeBeforeRender = 0;
        this.fwdPaddingBeforeRender = 0;
        this.bwdPaddingAverageSizeItemsCount = 0;
        this.scrollState = new ScrollState();
        this.syntheticScroll = new SyntheticScroll();
        this.loopPendingSource = new BehaviorSubject(false);
        this.workflowPendingSource = new BehaviorSubject(false);
        this.isLoadingSource = new BehaviorSubject(false);
        this.firstVisibleSource = new BehaviorSubject(itemAdapterEmpty);
        this.lastVisibleSource = new BehaviorSubject(itemAdapterEmpty);
        this.firstVisibleWanted = false;
        this.lastVisibleWanted = false;
    }
    Object.defineProperty(State.prototype, "loopPending", {
        get: /**
         * @return {?}
         */
        function () {
            return this.loopPendingSource.getValue();
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this.loopPending !== value) {
                this.loopPendingSource.next(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "workflowPending", {
        get: /**
         * @return {?}
         */
        function () {
            return this.workflowPendingSource.getValue();
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this.workflowPending !== value) {
                this.workflowPendingSource.next(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isLoading", {
        get: /**
         * @return {?}
         */
        function () {
            return this.isLoadingSource.getValue();
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this.isLoading !== value) {
                this.isLoadingSource.next(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "firstVisibleItem", {
        get: /**
         * @return {?}
         */
        function () {
            return this.firstVisibleSource.getValue();
        },
        set: /**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (this.firstVisibleItem.$index !== item.$index) {
                this.firstVisibleSource.next(item);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "lastVisibleItem", {
        get: /**
         * @return {?}
         */
        function () {
            return this.lastVisibleSource.getValue();
        },
        set: /**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (this.lastVisibleItem.$index !== item.$index) {
                this.lastVisibleSource.next(item);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "time", {
        get: /**
         * @return {?}
         */
        function () {
            return Number(new Date()) - this.initTime;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?=} options
     * @return {?}
     */
    State.prototype.startLoop = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        this.loopPending = true;
        this.innerLoopCount++;
        this.fetch.reset();
        this.clip = false;
        if (options) {
            this.scrollState.scroll = options.scroll || false;
        }
        this.scrollState.keepScroll = false;
    };
    /**
     * @return {?}
     */
    State.prototype.endLoop = /**
     * @return {?}
     */
    function () {
        this.loopPending = false;
        this.countDone++;
        this.isInitialLoop = false;
    };
    /**
     * @param {?} newStartIndex
     * @return {?}
     */
    State.prototype.setCurrentStartIndex = /**
     * @param {?} newStartIndex
     * @return {?}
     */
    function (newStartIndex) {
        var _a = this.settings, startIndex = _a.startIndex, minIndex = _a.minIndex, maxIndex = _a.maxIndex;
        /** @type {?} */
        var index = Number(newStartIndex);
        if (isNaN(index)) {
            this.logger.log(function () {
                return "fallback startIndex to settings.startIndex (" + startIndex + ") because " + newStartIndex + " is not a number";
            });
            index = startIndex;
        }
        if (index < minIndex) {
            this.logger.log(function () { return "setting startIndex to settings.minIndex (" + minIndex + ") because " + index + " < " + minIndex; });
            index = minIndex;
        }
        if (index > maxIndex) {
            this.logger.log(function () { return "setting startIndex to settings.maxIndex (" + maxIndex + ") because " + index + " > " + maxIndex; });
            index = maxIndex;
        }
        this.startIndex = index;
    };
    return State;
}());
export { State };
if (false) {
    /** @type {?} */
    State.prototype.settings;
    /** @type {?} */
    State.prototype.logger;
    /** @type {?} */
    State.prototype.initTime;
    /** @type {?} */
    State.prototype.innerLoopCount;
    /** @type {?} */
    State.prototype.isInitialLoop;
    /** @type {?} */
    State.prototype.workflowCycleCount;
    /** @type {?} */
    State.prototype.isInitialWorkflowCycle;
    /** @type {?} */
    State.prototype.countDone;
    /** @type {?} */
    State.prototype.startIndex;
    /** @type {?} */
    State.prototype.fetch;
    /** @type {?} */
    State.prototype.clip;
    /** @type {?} */
    State.prototype.clipCall;
    /** @type {?} */
    State.prototype.lastPosition;
    /** @type {?} */
    State.prototype.preFetchPosition;
    /** @type {?} */
    State.prototype.preAdjustPosition;
    /** @type {?} */
    State.prototype.sizeBeforeRender;
    /** @type {?} */
    State.prototype.fwdPaddingBeforeRender;
    /** @type {?} */
    State.prototype.bwdPaddingAverageSizeItemsCount;
    /** @type {?} */
    State.prototype.scrollState;
    /** @type {?} */
    State.prototype.syntheticScroll;
    /** @type {?} */
    State.prototype.loopPendingSource;
    /** @type {?} */
    State.prototype.workflowPendingSource;
    /** @type {?} */
    State.prototype.isLoadingSource;
    /** @type {?} */
    State.prototype.firstVisibleSource;
    /** @type {?} */
    State.prototype.lastVisibleSource;
    /** @type {?} */
    State.prototype.firstVisibleWanted;
    /** @type {?} */
    State.prototype.lastVisibleWanted;
}
//# sourceMappingURL=state.js.map