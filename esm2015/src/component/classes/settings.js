/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { assignSettings, assignDevSettings } from '../utils/index';
/** @type {?} */
export const defaultSettings = {
    adapter: false,
    startIndex: 1,
    minIndex: -Infinity,
    maxIndex: Infinity,
    bufferSize: 5,
    padding: 0.5,
    infinite: false,
    horizontal: false,
    windowViewport: false
};
/** @type {?} */
export const minSettings = {
    itemSize: 1,
    bufferSize: 1,
    padding: 0.01
};
/** @type {?} */
export const defaultDevSettings = {
    debug: false,
    // if true, logging is enabled; need to turn off when release
    immediateLog: true,
    // if false, logging is not immediate and could be done via Workflow.logForce call
    logTime: false,
    // if true, time differences are being logged
    throttle: 40,
    // if > 0, scroll event handling is throttled (ms)
    inertia: false,
    // if true, inertia scroll delay (ms) and delta (px) are taken into the account
    inertiaScrollDelay: 125,
    inertiaScrollDelta: 35,
    initDelay: 1,
    // if set, the Workflow initialization will be postponed (ms)
    initWindowDelay: 40,
    // if set and the entire window is scrollable, the Workflow init will be postponed (ms)
    maxSynthScrollDelay: 450 // if > 0, synthetic scroll params will be reset after [value] (ms)
};
/** @type {?} */
export const minDevSettings = {
    throttle: 0,
    inertiaScrollDelay: 0,
    inertiaScrollDelta: 0,
    initDelay: 0,
    initWindowDelay: 0,
    maxSynthScrollDelay: 0
};
export class Settings {
    /**
     * @param {?} settings
     * @param {?} devSettings
     * @param {?} instanceIndex
     */
    constructor(settings, devSettings, instanceIndex) {
        assignSettings(this, settings || {}, defaultSettings, minSettings);
        assignDevSettings(this, devSettings || {}, defaultDevSettings, minDevSettings);
        this.instanceIndex = instanceIndex;
        this.initializeDelay = this.getInitializeDelay();
        // todo: min/max indexes must be ignored if infinite mode is enabled ??
    }
    /**
     * @return {?}
     */
    getInitializeDelay() {
        /** @type {?} */
        let result = 0;
        if (this.windowViewport && this.initWindowDelay && !('scrollRestoration' in history)) {
            result = this.initWindowDelay;
        }
        if (this.initDelay > 0) {
            result = Math.max(result, this.initDelay);
        }
        return result;
    }
}
if (false) {
    /** @type {?} */
    Settings.prototype.adapter;
    /** @type {?} */
    Settings.prototype.startIndex;
    /** @type {?} */
    Settings.prototype.minIndex;
    /** @type {?} */
    Settings.prototype.maxIndex;
    /** @type {?} */
    Settings.prototype.itemSize;
    /** @type {?} */
    Settings.prototype.bufferSize;
    /** @type {?} */
    Settings.prototype.padding;
    /** @type {?} */
    Settings.prototype.infinite;
    /** @type {?} */
    Settings.prototype.horizontal;
    /** @type {?} */
    Settings.prototype.windowViewport;
    /** @type {?} */
    Settings.prototype.debug;
    /** @type {?} */
    Settings.prototype.immediateLog;
    /** @type {?} */
    Settings.prototype.logTime;
    /** @type {?} */
    Settings.prototype.throttle;
    /** @type {?} */
    Settings.prototype.inertia;
    /** @type {?} */
    Settings.prototype.inertiaScrollDelay;
    /** @type {?} */
    Settings.prototype.inertiaScrollDelta;
    /** @type {?} */
    Settings.prototype.initDelay;
    /** @type {?} */
    Settings.prototype.initWindowDelay;
    /** @type {?} */
    Settings.prototype.maxSynthScrollDelay;
    /** @type {?} */
    Settings.prototype.instanceIndex;
    /** @type {?} */
    Settings.prototype.initializeDelay;
}
//# sourceMappingURL=settings.js.map