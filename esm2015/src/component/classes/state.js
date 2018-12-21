/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject } from 'rxjs';
import { FetchModel } from './fetch';
import { itemAdapterEmpty } from './adapter';
class WindowScrollState {
    constructor() {
        this.reset();
    }
    /**
     * @return {?}
     */
    reset() {
        this.delta = 0;
        this.positionToUpdate = 0;
    }
}
if (false) {
    /** @type {?} */
    WindowScrollState.prototype.positionToUpdate;
    /** @type {?} */
    WindowScrollState.prototype.delta;
}
class ScrollState {
    constructor() {
        this.window = new WindowScrollState();
        this.reset();
    }
    /**
     * @return {?}
     */
    reset() {
        this.firstScroll = false;
        this.firstScrollTime = 0;
        this.lastScrollTime = 0;
        this.scrollTimer = null;
        this.workflowTimer = null;
        this.scroll = false;
        this.keepScroll = false;
        this.window.reset();
    }
}
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
class SyntheticScroll {
    constructor() {
        this.reset(null);
    }
    /**
     * @param {?=} position
     * @return {?}
     */
    reset(position = null) {
        this.position = position;
        this.positionBefore = null;
        this.delta = 0;
        this.time = 0;
        this.readyToReset = false;
    }
}
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
export class State {
    /**
     * @return {?}
     */
    get loopPending() {
        return this.loopPendingSource.getValue();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set loopPending(value) {
        if (this.loopPending !== value) {
            this.loopPendingSource.next(value);
        }
    }
    /**
     * @return {?}
     */
    get workflowPending() {
        return this.workflowPendingSource.getValue();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set workflowPending(value) {
        if (this.workflowPending !== value) {
            this.workflowPendingSource.next(value);
        }
    }
    /**
     * @return {?}
     */
    get isLoading() {
        return this.isLoadingSource.getValue();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set isLoading(value) {
        if (this.isLoading !== value) {
            this.isLoadingSource.next(value);
        }
    }
    /**
     * @return {?}
     */
    get firstVisibleItem() {
        return this.firstVisibleSource.getValue();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    set firstVisibleItem(item) {
        if (this.firstVisibleItem.$index !== item.$index) {
            this.firstVisibleSource.next(item);
        }
    }
    /**
     * @return {?}
     */
    get lastVisibleItem() {
        return this.lastVisibleSource.getValue();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    set lastVisibleItem(item) {
        if (this.lastVisibleItem.$index !== item.$index) {
            this.lastVisibleSource.next(item);
        }
    }
    /**
     * @return {?}
     */
    get time() {
        return Number(new Date()) - this.initTime;
    }
    /**
     * @param {?} settings
     * @param {?} logger
     */
    constructor(settings, logger) {
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
    /**
     * @param {?=} options
     * @return {?}
     */
    startLoop(options) {
        this.loopPending = true;
        this.innerLoopCount++;
        this.fetch.reset();
        this.clip = false;
        if (options) {
            this.scrollState.scroll = options.scroll || false;
        }
        this.scrollState.keepScroll = false;
    }
    /**
     * @return {?}
     */
    endLoop() {
        this.loopPending = false;
        this.countDone++;
        this.isInitialLoop = false;
    }
    /**
     * @param {?} newStartIndex
     * @return {?}
     */
    setCurrentStartIndex(newStartIndex) {
        const { startIndex, minIndex, maxIndex } = this.settings;
        /** @type {?} */
        let index = Number(newStartIndex);
        if (isNaN(index)) {
            this.logger.log(() => `fallback startIndex to settings.startIndex (${startIndex}) because ${newStartIndex} is not a number`);
            index = startIndex;
        }
        if (index < minIndex) {
            this.logger.log(() => `setting startIndex to settings.minIndex (${minIndex}) because ${index} < ${minIndex}`);
            index = minIndex;
        }
        if (index > maxIndex) {
            this.logger.log(() => `setting startIndex to settings.maxIndex (${maxIndex}) because ${index} > ${maxIndex}`);
            index = maxIndex;
        }
        this.startIndex = index;
    }
}
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