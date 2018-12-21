/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {string} */
const Process = {
    init: 'init',
    scroll: 'scroll',
    reload: 'reload',
    start: 'start',
    preFetch: 'preFetch',
    fetch: 'fetch',
    postFetch: 'postFetch',
    render: 'render',
    clip: 'clip',
    adjust: 'adjust',
    end: 'end',
};
export { Process };
/** @enum {string} */
const ProcessStatus = {
    start: 'start',
    next: 'next',
    done: 'done',
    error: 'error',
};
export { ProcessStatus };
/**
 * @record
 */
export function ScrollPayload() { }
if (false) {
    /** @type {?|undefined} */
    ScrollPayload.prototype.event;
    /** @type {?|undefined} */
    ScrollPayload.prototype.byTimer;
}
/**
 * @record
 */
export function ProcessRun() { }
if (false) {
    /** @type {?|undefined} */
    ProcessRun.prototype.empty;
    /** @type {?|undefined} */
    ProcessRun.prototype.scroll;
    /** @type {?|undefined} */
    ProcessRun.prototype.keepScroll;
    /** @type {?|undefined} */
    ProcessRun.prototype.byTimer;
    /** @type {?|undefined} */
    ProcessRun.prototype.error;
}
/**
 * @record
 */
export function ProcessSubject() { }
if (false) {
    /** @type {?} */
    ProcessSubject.prototype.process;
    /** @type {?} */
    ProcessSubject.prototype.status;
    /** @type {?|undefined} */
    ProcessSubject.prototype.payload;
}
//# sourceMappingURL=process.js.map