/**
 * @license ngx-ui-scroll
 * MIT license
 */

import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef, ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const checkDatasource = (datasource) => {
    if (!datasource) {
        throw new Error('No datasource provided');
    }
    if (!('get' in datasource)) {
        throw new Error('Datasource get method is not implemented');
    }
    if (typeof datasource.get !== 'function') {
        throw new Error('Datasource get is not a function');
    }
    if (((/** @type {?} */ ((datasource.get)))).length < 2) {
        throw new Error('Datasource get method invalid signature');
    }
    return datasource;
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const assignBoolean = (target, source, token, defaults) => {
    /** @type {?} */
    const param = ((/** @type {?} */ (source)))[token];
    if (typeof param === 'undefined') {
        return;
    }
    if (typeof param !== 'boolean') {
        console.warn(token + ' setting parse error, set it to ' + ((/** @type {?} */ (defaults)))[token] + ' (default)');
        return;
    }
    ((/** @type {?} */ (target)))[token] = param;
    return true;
};
/** @type {?} */
const assignNumeric = (target, source, token, defaults, integer = false) => {
    /** @type {?} */
    const param = ((/** @type {?} */ (source)))[token];
    if (typeof param === 'undefined') {
        return;
    }
    if (typeof param !== 'number') {
        console.warn(token + ' setting parse error, set it to ' + ((/** @type {?} */ (defaults)))[token] + ' (default)');
        return;
    }
    if (integer && parseInt(param.toString(), 10) !== param) {
        console.warn(token + ' setting parse error, set it to ' + ((/** @type {?} */ (defaults)))[token] + ' (default)');
        return;
    }
    ((/** @type {?} */ (target)))[token] = param;
    return true;
};
/** @type {?} */
const assignMinimalNumeric = (target, source, token, defaults, minSettings, integer = false, mustExist = true) => {
    if (assignNumeric(target, source, token, defaults, integer) !== true) {
        if (!mustExist) {
            return;
        }
    }
    if (((/** @type {?} */ (target)))[token] < ((/** @type {?} */ (minSettings)))[token]) {
        console.warn(token + ' setting is less than minimum, set it to ' + ((/** @type {?} */ (minSettings)))[token]);
        ((/** @type {?} */ (target)))[token] = ((/** @type {?} */ (minSettings)))[token];
        return;
    }
    return true;
};
/** @type {?} */
const assignCommon = (target, settings, defaults) => {
    Object.assign(target, defaults);
    if (typeof settings === 'undefined') {
        return;
    }
    if (typeof settings !== 'object') {
        console.warn('settings is not an object, fallback to the defaults');
        return;
    }
};
/** @type {?} */
const assignSettings = (target, settings, defaults, minSettings) => {
    assignCommon(target, settings, defaults);
    assignBoolean(target, settings, 'adapter', defaults);
    assignNumeric(target, settings, 'startIndex', defaults);
    assignNumeric(target, settings, 'minIndex', defaults);
    assignNumeric(target, settings, 'maxIndex', defaults);
    assignMinimalNumeric(target, settings, 'itemSize', defaults, minSettings, true, false);
    assignMinimalNumeric(target, settings, 'bufferSize', defaults, minSettings, true);
    assignMinimalNumeric(target, settings, 'padding', defaults, minSettings);
    assignBoolean(target, settings, 'infinite', defaults);
    assignBoolean(target, settings, 'horizontal', defaults);
    assignBoolean(target, settings, 'windowViewport', defaults);
};
/** @type {?} */
const assignDevSettings = (target, devSettings, defaults, minDevSettings) => {
    assignCommon(target, devSettings, defaults);
    assignBoolean(target, devSettings, 'debug', defaults);
    assignBoolean(target, devSettings, 'immediateLog', defaults);
    assignBoolean(target, devSettings, 'logTime', defaults);
    assignMinimalNumeric(target, devSettings, 'throttle', defaults, minDevSettings, true);
    assignBoolean(target, devSettings, 'inertia', defaults);
    assignMinimalNumeric(target, devSettings, 'inertiaScrollDelay', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'inertiaScrollDelta', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'initDelay', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'initWindowDelay', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'maxSynthScrollDelay', defaults, minDevSettings, true);
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {string} */
const Direction = {
    forward: 'forward',
    backward: 'backward',
};

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
/** @enum {string} */
const ProcessStatus = {
    start: 'start',
    next: 'next',
    done: 'done',
    error: 'error',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
/** @type {?} */
const getInitializedSubject = (adapter, method) => {
    return adapter.init ? method() :
        adapter.init$
            .pipe(switchMap(() => method()));
};
/** @type {?} */
const itemAdapterEmpty = (/** @type {?} */ ({
    data: {},
    element: {}
}));
/** @type {?} */
const generateMockAdapter = () => ((/** @type {?} */ ({
    version: null,
    init: false,
    init$: of(false),
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
class Adapter {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Datasource {
    /**
     * @param {?} datasource
     * @param {?=} hasNoAdapter
     */
    constructor(datasource, hasNoAdapter) {
        this.constructed = true;
        Object.assign((/** @type {?} */ (this)), datasource);
        if (hasNoAdapter) {
            this.adapter = (/** @type {?} */ (generateMockAdapter()));
        }
        else {
            this.adapter = new Adapter();
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const defaultSettings = {
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
const minSettings = {
    itemSize: 1,
    bufferSize: 1,
    padding: 0.01
};
/** @type {?} */
const defaultDevSettings = {
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
const minDevSettings = {
    throttle: 0,
    inertiaScrollDelay: 0,
    inertiaScrollDelta: 0,
    initDelay: 0,
    initWindowDelay: 0,
    maxSynthScrollDelay: 0
};
class Settings {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Logger {
    /**
     * @param {?} scroller
     */
    constructor(scroller) {
        this.logs = [];
        const { settings } = scroller;
        this.debug = settings.debug;
        this.immediateLog = settings.immediateLog;
        this.logTime = settings.logTime;
        this.getTime = () => scroller.state && ` // time: ${scroller.state.time}`;
        this.getStat = () => {
            const { buffer, viewport } = scroller;
            /** @type {?} */
            const first = buffer.getFirstVisibleItem();
            /** @type {?} */
            const last = buffer.getLastVisibleItem();
            return 'pos: ' + viewport.scrollPosition + ', ' +
                'size: ' + viewport.getScrollableSize() + ', ' +
                'bwd_p: ' + viewport.paddings.backward.size + ', ' +
                'fwd_p: ' + viewport.paddings.forward.size + ', ' +
                'aver: ' + (buffer.hasItemSize ? buffer.averageSize : 'no') + ', ' +
                'items: ' + buffer.getVisibleItemsCount() + ', ' +
                'range: ' + (first && last ? `[${first.$index}..${last.$index}]` : 'no');
        };
        this.getFetchRange = () => {
            const { firstIndex, lastIndex } = scroller.state.fetch;
            /** @type {?} */
            const hasInterval = firstIndex !== null && lastIndex !== null && !isNaN(firstIndex) && !isNaN(lastIndex);
            return hasInterval ? `[${firstIndex}..${lastIndex}]` : 'no';
        };
        this.getInnerLoopCount = () => scroller.state.innerLoopCount;
        this.getWorkflowCycleData = (more) => `${scroller.settings.instanceIndex}-${scroller.state.workflowCycleCount}` + (more ? '-' : '');
        this.log(() => `uiScroll Workflow has been started (v${scroller.version}, instance ${settings.instanceIndex})`);
    }
    /**
     * @param {?} str
     * @param {?} obj
     * @param {?=} stringify
     * @return {?}
     */
    object(str, obj, stringify) {
        this.log(() => [
            str,
            stringify
                ? JSON.stringify(obj)
                    .replace(/"/g, '')
                    .replace(/(\{|\:|\,)/g, '$1 ')
                : obj
        ]);
    }
    /**
     * @param {?=} str
     * @return {?}
     */
    stat(str) {
        if (this.debug) {
            /** @type {?} */
            const logStyles = ['color: #888; border: dashed #888 0; border-bottom-width: 0px', 'color: #000; border-width: 0'];
            this.log(() => ['%cstat' + (str ? ` ${str}` : '') + ',%c ' + this.getStat(), ...logStyles]);
        }
    }
    /**
     * @param {?=} str
     * @return {?}
     */
    fetch(str) {
        if (this.debug) {
            /** @type {?} */
            const _text = 'fetch interval' + (str ? ` ${str}` : '');
            /** @type {?} */
            const logStyles = ['color: #888', 'color: #000'];
            this.log(() => [`%c${_text}: %c${this.getFetchRange()}`, ...logStyles]);
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    logProcess(data) {
        if (!this.debug) {
            return;
        }
        const { process, status } = data;
        /** @type {?} */
        const payload = data.payload || { empty: true };
        // standard process log
        /** @type {?} */
        const processLog = `process ${process}, %c${status}%c` + (!payload.empty ? ',' : '');
        /** @type {?} */
        const styles = [status === ProcessStatus.error ? 'color: #cc0000;' : '', 'color: #000000;'];
        this.log(() => [processLog, ...styles, ...(!payload.empty ? [payload] : [])]);
        // inner loop start-end log
        /** @type {?} */
        const workflowCycleData = this.getWorkflowCycleData(true);
        /** @type {?} */
        const loopCount = this.getInnerLoopCount();
        /** @type {?} */
        const loopLog = [];
        if (process === Process.init && status === ProcessStatus.next ||
            process === Process.scroll && status === ProcessStatus.next && payload.keepScroll ||
            process === Process.end && status === ProcessStatus.next && payload.byTimer) {
            loopLog.push(`%c---=== loop ${workflowCycleData + (loopCount + 1)} start`);
        }
        else if (process === Process.end && !payload.byTimer) {
            loopLog.push(`%c---=== loop ${workflowCycleData + loopCount} done`);
            if (status === ProcessStatus.next && !(payload.keepScroll)) {
                loopLog[0] += `, loop ${workflowCycleData + (loopCount + 1)} start`;
            }
        }
        if (loopLog.length) {
            this.log(() => [...loopLog, 'color: #006600;']);
        }
        // workflow cycle start log
        if (process === Process.init && status === ProcessStatus.start ||
            process === Process.reload && status === ProcessStatus.next ||
            process === Process.scroll && status === ProcessStatus.next && !(payload.keepScroll)) {
            /** @type {?} */
            const logData = this.getWorkflowCycleData(false);
            /** @type {?} */
            const logStyles = 'color: #0000aa; border: solid black 1px; border-width: 1px 0 0 1px; margin-left: -2px';
            this.log(() => [`%c   ~~~ WF Cycle ${logData} STARTED ~~~  `, logStyles]);
        }
        // workflow run end log
        if (process === Process.end && status === ProcessStatus.done) {
            /** @type {?} */
            const logData = this.getWorkflowCycleData(false);
            /** @type {?} */
            const logStyles = 'color: #0000aa; border: solid #555 1px; border-width: 0 0 1px 1px; margin-left: -2px';
            this.log(() => [`%c   ~~~ WF Cycle ${logData} FINALIZED ~~~  `, logStyles]);
        }
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    log(...args) {
        if (this.debug) {
            if (typeof args[0] === 'function') {
                args = args[0]();
                if (!Array.isArray(args)) {
                    args = [args];
                }
            }
            if (args.every(item => item === undefined)) {
                return;
            }
            if (this.logTime) {
                args = [...args, this.getTime()];
            }
            if (this.immediateLog) {
                console.log.apply(this, args);
            }
            else {
                this.logs.push(args);
            }
        }
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    logForce(...args) {
        if (this.debug) {
            if (!this.immediateLog && this.logs.length) {
                this.logs.forEach(logArgs => console.log.apply(this, logArgs));
                this.logs = [];
            }
            if (args.length) {
                console.log.apply(this, args);
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Routines {
    /**
     * @param {?} settings
     */
    constructor(settings) {
        this.horizontal = settings.horizontal;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getScrollPosition(element) {
        return element[this.horizontal ? 'scrollLeft' : 'scrollTop'];
    }
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    setScrollPosition(element, value) {
        element[this.horizontal ? 'scrollLeft' : 'scrollTop'] = value;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getParams(element) {
        if (element.tagName.toLowerCase() === 'body') {
            element = (/** @type {?} */ (element.parentElement));
            return (/** @type {?} */ ({
                'height': element.clientHeight,
                'width': element.clientWidth,
                'top': element.clientTop,
                'bottom': element.clientTop + element.clientHeight,
                'left': element.clientLeft,
                'right': element.clientLeft + element.clientWidth
            }));
        }
        return element.getBoundingClientRect();
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getSize(element) {
        return this.getParams(element)[this.horizontal ? 'width' : 'height'];
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getSizeStyle(element) {
        /** @type {?} */
        const size = element.style[this.horizontal ? 'width' : 'height'];
        return parseInt((/** @type {?} */ (size)), 10) || 0;
    }
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    setSizeStyle(element, value) {
        element.style[this.horizontal ? 'width' : 'height'] = `${value}px`;
    }
    /**
     * @param {?} params
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getRectEdge(params, direction, opposite) {
        /** @type {?} */
        const forward = !opposite ? Direction.forward : Direction.backward;
        return params[direction === forward ? (this.horizontal ? 'right' : 'bottom') : (this.horizontal ? 'left' : 'top')];
    }
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getEdge(element, direction, opposite) {
        /** @type {?} */
        const params = this.getParams(element);
        return this.getRectEdge(params, direction, opposite);
    }
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?} relativeElement
     * @param {?} opposite
     * @return {?}
     */
    getEdge2(element, direction, relativeElement, opposite) {
        // vertical only ?
        return element.offsetTop - (relativeElement ? relativeElement.scrollTop : 0) +
            (direction === (!opposite ? Direction.forward : Direction.backward) ? this.getSize(element) : 0);
    }
    /**
     * @param {?} element
     * @return {?}
     */
    hideElement(element) {
        element.style.display = 'none';
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getOffset(element) {
        return this.horizontal ? element.offsetLeft : element.offsetTop;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Padding {
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?} routines
     */
    constructor(element, direction, routines) {
        this.element = (/** @type {?} */ (element.querySelector(`[data-padding-${direction}]`)));
        this.direction = direction;
        this.routines = routines;
    }
    /**
     * @param {?=} size
     * @return {?}
     */
    reset(size) {
        this.size = size || 0;
    }
    /**
     * @return {?}
     */
    get size() {
        return this.routines.getSizeStyle(this.element);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set size(value) {
        this.routines.setSizeStyle(this.element, Math.round(value));
    }
}
class Paddings {
    /**
     * @param {?} element
     * @param {?} routines
     * @param {?} settings
     */
    constructor(element, routines, settings) {
        this.settings = settings;
        this.forward = new Padding(element, Direction.forward, routines);
        this.backward = new Padding(element, Direction.backward, routines);
    }
    /**
     * @param {?} viewportSize
     * @param {?} startIndex
     * @return {?}
     */
    reset(viewportSize, startIndex) {
        this.forward.reset(this.getPositiveSize(startIndex, viewportSize));
        this.backward.reset(this.getNegativeSize(startIndex));
    }
    /**
     * @param {?} startIndex
     * @param {?} viewportSize
     * @return {?}
     */
    getPositiveSize(startIndex, viewportSize) {
        const { settings } = this;
        /** @type {?} */
        let positiveSize = viewportSize;
        if (isFinite(settings.maxIndex)) {
            positiveSize = (settings.maxIndex - startIndex + 1) * settings.itemSize;
        }
        return positiveSize;
    }
    /**
     * @param {?} startIndex
     * @return {?}
     */
    getNegativeSize(startIndex) {
        const { settings } = this;
        /** @type {?} */
        let negativeSize = 0;
        if (isFinite(settings.minIndex)) {
            negativeSize = (startIndex - settings.minIndex) * settings.itemSize;
        }
        return negativeSize;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Viewport {
    /**
     * @param {?} elementRef
     * @param {?} settings
     * @param {?} routines
     * @param {?} state
     * @param {?} logger
     */
    constructor(elementRef, settings, routines, state, logger) {
        this.settings = settings;
        this.routines = routines;
        this.state = state;
        this.logger = logger;
        this.element = elementRef.nativeElement;
        if (settings.windowViewport) {
            this.host = ((/** @type {?} */ (this.element.ownerDocument))).body;
            this.scrollEventElement = (/** @type {?} */ ((this.element.ownerDocument)));
            this.scrollable = (/** @type {?} */ (this.scrollEventElement.scrollingElement));
        }
        else {
            this.host = (/** @type {?} */ (this.element.parentElement));
            this.scrollEventElement = this.host;
            this.scrollable = (/** @type {?} */ (this.element.parentElement));
        }
        this.paddings = new Paddings(this.element, this.routines, settings);
        if (settings.windowViewport && 'scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }
    /**
     * @param {?} scrollPosition
     * @return {?}
     */
    reset(scrollPosition) {
        /** @type {?} */
        let newPosition = 0;
        this.paddings.reset(this.getSize(), this.state.startIndex);
        /** @type {?} */
        const negativeSize = this.paddings.backward.size;
        if (negativeSize) {
            newPosition = negativeSize;
            this.state.bwdPaddingAverageSizeItemsCount = negativeSize / this.settings.itemSize;
        }
        this.scrollPosition = newPosition;
        this.state.scrollState.reset();
        this.state.syntheticScroll.reset(scrollPosition !== newPosition ? newPosition : null);
        this.startDelta = 0;
    }
    /**
     * @param {?} value
     * @param {?=} oldPosition
     * @return {?}
     */
    setPosition(value, oldPosition) {
        if (oldPosition === undefined) {
            oldPosition = this.scrollPosition;
        }
        if (oldPosition === value) {
            this.logger.log(() => ['setting scroll position at', value, '[cancelled]']);
            return value;
        }
        this.routines.setScrollPosition(this.scrollable, value);
        /** @type {?} */
        const position = this.scrollPosition;
        this.logger.log(() => ['setting scroll position at', position]);
        return position;
    }
    /**
     * @return {?}
     */
    get scrollPosition() {
        return this.routines.getScrollPosition(this.scrollable);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set scrollPosition(value) {
        /** @type {?} */
        const oldPosition = this.scrollPosition;
        /** @type {?} */
        const newPosition = this.setPosition(value, oldPosition);
        /** @type {?} */
        const synthState = this.state.syntheticScroll;
        synthState.time = Number(Date.now());
        synthState.position = newPosition;
        synthState.delta = newPosition - oldPosition;
        if (synthState.positionBefore === null) {
            // syntheticScroll.positionBefore should be set once per cycle
            synthState.positionBefore = oldPosition;
        }
    }
    /**
     * @return {?}
     */
    getSize() {
        return this.routines.getSize(this.host);
    }
    /**
     * @return {?}
     */
    getScrollableSize() {
        return this.routines.getSize(this.element);
    }
    /**
     * @return {?}
     */
    getBufferPadding() {
        return this.getSize() * this.settings.padding;
    }
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getEdge(direction, opposite) {
        return this.routines.getEdge(this.host, direction, opposite);
    }
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getElementEdge(element, direction, opposite) {
        return this.routines.getEdge(element, direction, opposite);
    }
    /**
     * @return {?}
     */
    getOffset() {
        return this.routines.getOffset(this.element);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ItemCache {
    /**
     * @param {?} item
     */
    constructor(item) {
        this.$index = item.$index;
        this.nodeId = item.nodeId;
        this.data = item.data;
        this.size = item.size;
    }
}
class RecalculateAverage {
    constructor() {
        this.reset();
    }
    /**
     * @return {?}
     */
    reset() {
        this.newItems = [];
        this.oldItems = [];
    }
}
class Cache {
    /**
     * @param {?} itemSize
     * @param {?} logger
     */
    constructor(itemSize, logger) {
        this.averageSizeFloat = itemSize;
        this.averageSize = itemSize;
        this.itemSize = itemSize;
        this.items = new Map();
        this.recalculateAverage = new RecalculateAverage();
        this.reset();
        this.logger = logger;
    }
    /**
     * @return {?}
     */
    reset() {
        this.minIndex = +Infinity;
        this.maxIndex = -Infinity;
        this.items.clear();
        this.averageSizeFloat = this.itemSize;
        this.averageSize = this.itemSize;
        this.recalculateAverage.reset();
    }
    /**
     * @return {?}
     */
    recalculateAverageSize() {
        const { oldItems: { length: oldItemsLength }, newItems: { length: newItemsLength } } = this.recalculateAverage;
        if (!oldItemsLength && !newItemsLength) {
            return;
        }
        /** @type {?} */
        const oldItemsSize = this.recalculateAverage.oldItems.reduce((acc, index) => acc + this.getItemSize(index), 0);
        /** @type {?} */
        const newItemsSize = this.recalculateAverage.newItems.reduce((acc, index) => acc + this.getItemSize(index), 0);
        if (oldItemsLength) {
            /** @type {?} */
            const averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            const averageSizeLength = this.items.size - newItemsLength - oldItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + oldItemsSize) / averageSizeLength;
        }
        if (newItemsLength) {
            /** @type {?} */
            const averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            const averageSizeLength = this.items.size - newItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + newItemsSize) / this.items.size;
        }
        this.averageSize = Math.round(this.averageSizeFloat);
        this.recalculateAverage.reset();
        this.logger.log(() => `average size has been updated: ${this.averageSize}`);
    }
    /**
     * @param {?} item
     * @return {?}
     */
    add(item) {
        /** @type {?} */
        let itemCache = this.get(item.$index);
        if (itemCache) {
            itemCache.data = item.data;
            if (itemCache.size !== item.size) {
                itemCache.size = item.size;
                this.recalculateAverage.oldItems.push(item.$index);
            }
        }
        else {
            itemCache = new ItemCache(item);
            this.items.set(item.$index, itemCache);
            if (this.averageSize !== itemCache.size) {
                this.recalculateAverage.newItems.push(item.$index);
            }
        }
        if (item.$index < this.minIndex) {
            this.minIndex = item.$index;
        }
        if (item.$index > this.maxIndex) {
            this.maxIndex = item.$index;
        }
        return itemCache;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    getItemSize(index) {
        /** @type {?} */
        const item = this.get(index);
        return item ? item.size : 0;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    get(index) {
        return this.items.get(index);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Buffer {
    /**
     * @param {?} settings
     * @param {?} startIndex
     * @param {?} logger
     */
    constructor(settings, startIndex, logger) {
        this.$items = new BehaviorSubject([]);
        this.cache = new Cache(settings.itemSize, logger);
        this.minIndexUser = settings.minIndex;
        this.maxIndexUser = settings.maxIndex;
        this.reset();
        this.startIndex = startIndex;
        this.minBufferSize = settings.bufferSize;
        this.logger = logger;
    }
    /**
     * @param {?=} reload
     * @param {?=} startIndex
     * @return {?}
     */
    reset(reload, startIndex) {
        if (reload) {
            this.items.forEach(item => item.hide());
        }
        this.items = [];
        this.pristine = true;
        this.cache.reset();
        this.absMinIndex = this.minIndexUser;
        this.absMaxIndex = this.maxIndexUser;
        if (typeof startIndex !== 'undefined') {
            this.startIndex = startIndex;
        }
    }
    /**
     * @param {?} items
     * @return {?}
     */
    set items(items) {
        this.pristine = false;
        this._items = items;
        this.$items.next(items);
    }
    /**
     * @return {?}
     */
    get items() {
        return this._items;
    }
    /**
     * @return {?}
     */
    get size() {
        return this._items.length;
    }
    /**
     * @return {?}
     */
    get averageSize() {
        return this.cache.averageSize;
    }
    /**
     * @return {?}
     */
    get hasItemSize() {
        return this.averageSize !== undefined;
    }
    /**
     * @return {?}
     */
    get minIndex() {
        return isFinite(this.cache.minIndex) ? this.cache.minIndex : this.startIndex;
    }
    /**
     * @return {?}
     */
    get maxIndex() {
        return isFinite(this.cache.maxIndex) ? this.cache.maxIndex : this.startIndex;
    }
    /**
     * @return {?}
     */
    get bof() {
        return this.items.length ? (this.items[0].$index === this.absMinIndex) :
            isFinite(this.absMinIndex);
    }
    /**
     * @return {?}
     */
    get eof() {
        return this.items.length ? (this.items[this.items.length - 1].$index === this.absMaxIndex) :
            isFinite(this.absMaxIndex);
    }
    /**
     * @param {?} $index
     * @return {?}
     */
    get($index) {
        return this.items.find((item) => item.$index === $index);
    }
    /**
     * @param {?} items
     * @return {?}
     */
    setItems(items) {
        if (!this.items.length) {
            this.items = items;
        }
        else if (this.items[0].$index > items[items.length - 1].$index) {
            this.items = [...items, ...this.items];
        }
        else if (items[0].$index > this.items[this.items.length - 1].$index) {
            this.items = [...this.items, ...items];
        }
        else {
            return false;
        }
        return true;
    }
    /**
     * @return {?}
     */
    getFirstVisibleItemIndex() {
        /** @type {?} */
        const length = this.items.length;
        for (let i = 0; i < length; i++) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    }
    /**
     * @return {?}
     */
    getLastVisibleItemIndex() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    }
    /**
     * @return {?}
     */
    getFirstVisibleItem() {
        /** @type {?} */
        const index = this.getFirstVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    }
    /**
     * @return {?}
     */
    getLastVisibleItem() {
        /** @type {?} */
        const index = this.getLastVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    }
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getEdgeVisibleItem(direction, opposite) {
        return direction === (!opposite ? Direction.forward : Direction.backward) ?
            this.getLastVisibleItem() : this.getFirstVisibleItem();
    }
    /**
     * @return {?}
     */
    getVisibleItemsCount() {
        return this.items.reduce((acc, item) => acc + (item.invisible ? 0 : 1), 0);
    }
    /**
     * @param {?} index
     * @return {?}
     */
    getSizeByIndex(index) {
        /** @type {?} */
        const item = this.cache.get(index);
        return item ? item.size : this.averageSize;
    }
    /**
     * @return {?}
     */
    checkAverageSize() {
        this.cache.recalculateAverageSize();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FetchModel {
    constructor() {
        this.callCount = 0;
        this.reset();
    }
    /**
     * @return {?}
     */
    reset() {
        this._newItemsData = null;
        this.items = [];
        this.firstIndexBuffer = null;
        this.lastIndexBuffer = null;
        this.firstIndex = null;
        this.lastIndex = null;
        this.hasAnotherPack = false;
        this.negativeSize = 0;
        this.direction = null;
        this.isPrepend = false;
    }
    /**
     * @return {?}
     */
    get newItemsData() {
        return this._newItemsData;
    }
    /**
     * @param {?} items
     * @return {?}
     */
    set newItemsData(items) {
        this._newItemsData = items;
        this.callCount++;
    }
    /**
     * @return {?}
     */
    get shouldFetch() {
        return !!this.count;
    }
    /**
     * @return {?}
     */
    get hasNewItems() {
        return !!((this._newItemsData && this._newItemsData.length));
    }
    /**
     * @return {?}
     */
    get index() {
        return this.firstIndex;
    }
    /**
     * @return {?}
     */
    get count() {
        return this.firstIndex !== null && this.lastIndex !== null ? this.lastIndex - this.firstIndex + 1 : 0;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
class State {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let instanceCount = 0;
class Scroller {
    /**
     * @param {?} context
     * @param {?} callWorkflow
     */
    constructor(context, callWorkflow) {
        /** @type {?} */
        const datasource = (/** @type {?} */ (checkDatasource(context.datasource)));
        this.datasource = datasource;
        this.version = context.version;
        this.runChangeDetector = () => context.changeDetector.markForCheck();
        // this.runChangeDetector = () => context.changeDetector.detectChanges();
        this.callWorkflow = callWorkflow;
        this.innerLoopSubscriptions = [];
        this.settings = new Settings(datasource.settings, datasource.devSettings, ++instanceCount);
        this.logger = new Logger(this);
        this.routines = new Routines(this.settings);
        this.state = new State(this.settings, this.logger);
        this.buffer = new Buffer(this.settings, this.state.startIndex, this.logger);
        this.viewport = new Viewport(context.elementRef, this.settings, this.routines, this.state, this.logger);
        this.logger.object('uiScroll settings object', this.settings, true);
        if (!datasource.constructed) {
            this.datasource = new Datasource(datasource, !this.settings.adapter);
            if (this.settings.adapter) {
                this.datasource.adapter.initialize(this);
            }
        }
        else {
            this.datasource.adapter.initialize(this);
        }
    }
    /**
     * @return {?}
     */
    init() {
        this.viewport.reset(0);
    }
    /**
     * @return {?}
     */
    bindData() {
        this.runChangeDetector();
        return Observable.create((observer) => {
            setTimeout(() => {
                observer.next(true);
                observer.complete();
            });
        });
    }
    /**
     * @return {?}
     */
    purgeInnerLoopSubscriptions() {
        this.innerLoopSubscriptions.forEach((item) => item.unsubscribe());
        this.innerLoopSubscriptions = [];
    }
    /**
     * @param {?=} localOnly
     * @return {?}
     */
    purgeScrollTimers(localOnly) {
        const { state: { scrollState } } = this;
        if (scrollState.scrollTimer) {
            clearTimeout(scrollState.scrollTimer);
            scrollState.scrollTimer = null;
        }
        if (!localOnly && scrollState.workflowTimer) {
            clearTimeout(scrollState.workflowTimer);
            scrollState.workflowTimer = null;
        }
    }
    /**
     * @return {?}
     */
    dispose() {
        this.purgeInnerLoopSubscriptions();
        this.purgeScrollTimers();
    }
    /**
     * @return {?}
     */
    finalize() {
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Init {
    /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    static run(scroller, payload) {
        scroller.state.isInitialWorkflowCycle = !payload;
        scroller.state.isInitialLoop = !payload;
        scroller.state.workflowPending = true;
        scroller.state.isLoading = true;
        scroller.callWorkflow({
            process: Process.init,
            status: ProcessStatus.next,
            payload: {
                scroll: payload && payload.scroll || false
            }
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Scroll {
    /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    static run(scroller, payload = {}) {
        scroller.logger.log(scroller.viewport.scrollPosition);
        if (scroller.state.syntheticScroll.position !== null) {
            if (!Scroll.processSyntheticScroll(scroller)) {
                return;
            }
        }
        this.delayScroll(scroller, payload);
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static processSyntheticScroll(scroller) {
        const { viewport, state: { syntheticScroll }, settings, logger } = scroller;
        /** @type {?} */
        const time = Number(new Date());
        /** @type {?} */
        const synthetic = Object.assign({}, syntheticScroll);
        /** @type {?} */
        const position = viewport.scrollPosition;
        /** @type {?} */
        const synthScrollDelay = time - synthetic.time;
        if (synthScrollDelay > settings.maxSynthScrollDelay) {
            logger.log(() => `reset synthetic scroll params (${synthScrollDelay} > ${settings.maxSynthScrollDelay})`);
            syntheticScroll.reset();
            return position !== synthetic.position;
        }
        // synthetic scroll
        syntheticScroll.readyToReset = true;
        if (position === synthetic.position) {
            // let's reset syntheticScroll.position on first change
            logger.log(() => `skip synthetic scroll (${position})`);
            return false;
        }
        else if (synthetic.readyToReset) {
            syntheticScroll.position = null;
            syntheticScroll.positionBefore = null;
            logger.log(() => 'reset synthetic scroll params');
        }
        if (settings.windowViewport) {
            if (!synthetic.readyToReset) {
                logger.log(() => 'reset synthetic scroll params (window)');
                syntheticScroll.reset();
            }
            return true;
        }
        // inertia scroll over synthetic scroll
        if (position !== synthetic.position) {
            /** @type {?} */
            const inertiaDelta = (/** @type {?} */ (synthetic.positionBefore)) - position;
            /** @type {?} */
            const syntheticDelta = (/** @type {?} */ (synthetic.position)) - position;
            if (inertiaDelta > 0 && inertiaDelta < syntheticDelta) {
                /** @type {?} */
                const newPosition = Math.max(0, position + syntheticScroll.delta);
                logger.log(() => 'inertia scroll adjustment' +
                    '. Position: ' + position +
                    ', synthetic position: ' + synthetic.position +
                    ', synthetic position before: ' + synthetic.positionBefore +
                    ', synthetic delay: ' + synthScrollDelay +
                    ', synthetic delta: ' + syntheticDelta +
                    ', inertia delta: ' + inertiaDelta +
                    ', new position: ' + newPosition);
                if (settings.inertia) { // precise inertia settings
                    if (inertiaDelta <= settings.inertiaScrollDelta && synthScrollDelay <= settings.inertiaScrollDelay) {
                        viewport.scrollPosition = newPosition;
                    }
                }
                else {
                    viewport.scrollPosition = newPosition;
                }
            } /* else {
              logger.log(() => 'inertia scroll adjustment [cancelled]' +
                '. Position: ' + position +
                ', synthetic position: ' + synthetic.position +
                ', synthetic position before: ' + synthetic.positionBefore +
                ', synthetic delta: ' + syntheticDelta + ', inertia delta: ' + inertiaDelta);
            } */
        }
        return true;
    }
    /**
     * @param {?} scroller
     * @param {?} payload
     * @return {?}
     */
    static delayScroll(scroller, payload) {
        if (!scroller.settings.throttle || payload.byTimer) {
            Scroll.doScroll(scroller);
            return;
        }
        const { state: { scrollState } } = scroller;
        /** @type {?} */
        const time = Number(Date.now());
        /** @type {?} */
        const tDiff = scrollState.lastScrollTime + scroller.settings.throttle - time;
        /** @type {?} */
        const dDiff = scroller.settings.throttle + (scrollState.firstScrollTime ? scrollState.firstScrollTime - time : 0);
        /** @type {?} */
        const diff = Math.max(tDiff, dDiff);
        // scroller.logger.log('tDiff:', tDiff, 'dDiff:', dDiff, 'diff:', diff);
        if (diff <= 0) {
            scroller.purgeScrollTimers(true);
            scrollState.lastScrollTime = time;
            scrollState.firstScrollTime = 0;
            Scroll.doScroll(scroller);
        }
        else if (!scrollState.scrollTimer && !scrollState.keepScroll) {
            scroller.logger.log(() => `setting the timer at ${scroller.state.time + diff}`);
            scrollState.firstScrollTime = time;
            scrollState.scrollTimer = (/** @type {?} */ (setTimeout(() => {
                scrollState.scrollTimer = null;
                scroller.logger.log(() => `fire the timer (${scroller.state.time})`);
                Scroll.run(scroller, { byTimer: true });
            }, diff)));
        } /* else {
          scroller.logger.log('MISS TIMER');
        } */
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static doScroll(scroller) {
        const { state, state: { scrollState } } = scroller;
        if (state.workflowPending) {
            scroller.logger.log(() => !scrollState.keepScroll ? [
                `setting %ckeepScroll%c flag (scrolling while the Workflow is pending)`,
                'color: #006600;', 'color: #000000;'
            ] : undefined);
            scrollState.keepScroll = true;
            return;
        }
        scroller.callWorkflow({
            process: Process.scroll,
            status: ProcessStatus.next,
            payload: Object.assign({ scroll: true }, (scrollState.keepScroll ? { keepScroll: scrollState.keepScroll } : {}))
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Reload {
    /**
     * @param {?} scroller
     * @param {?} reloadIndex
     * @return {?}
     */
    static run(scroller, reloadIndex) {
        /** @type {?} */
        const scrollPosition = scroller.viewport.scrollPosition;
        scroller.state.setCurrentStartIndex(reloadIndex);
        scroller.buffer.reset(true, scroller.state.startIndex);
        scroller.viewport.reset(scrollPosition);
        scroller.purgeInnerLoopSubscriptions();
        scroller.purgeScrollTimers();
        // todo: do we need to have Process.end before?
        scroller.callWorkflow({
            process: Process.reload,
            status: ProcessStatus.next
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Start {
    /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    static run(scroller, payload) {
        scroller.state.startLoop(payload);
        scroller.callWorkflow({
            process: Process.start,
            status: ProcessStatus.next
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PreFetch {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        const { fetch } = scroller.state;
        scroller.state.preFetchPosition = scroller.viewport.scrollPosition;
        fetch.minIndex = scroller.buffer.minIndex;
        fetch.averageItemSize = scroller.buffer.averageSize || 0;
        // calculate size before start index
        PreFetch.setStartDelta(scroller);
        // set first and last indexes to fetch
        PreFetch.setFetchIndexes(scroller);
        // skip indexes that are in buffer
        PreFetch.skipBufferedItems(scroller);
        // add indexes if there are too few items to fetch (clip padding)
        PreFetch.checkFetchPackSize(scroller);
        // set fetch direction
        PreFetch.setFetchDirection(scroller);
        if (fetch.shouldFetch) {
            scroller.logger.log(() => `going to fetch ${fetch.count} items started from index ${fetch.index}`);
        }
        scroller.callWorkflow({
            process: Process.preFetch,
            status: scroller.state.fetch.shouldFetch ? ProcessStatus.next : ProcessStatus.done
        });
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setStartDelta(scroller) {
        const { buffer, viewport } = scroller;
        viewport.startDelta = 0;
        if (!buffer.hasItemSize) {
            return;
        }
        /** @type {?} */
        const minIndex = isFinite(buffer.absMinIndex) ? buffer.absMinIndex : buffer.minIndex;
        for (let index = minIndex; index < scroller.state.startIndex; index++) {
            /** @type {?} */
            const item = buffer.cache.get(index);
            viewport.startDelta += item ? item.size : buffer.averageSize;
        }
        if (scroller.settings.windowViewport) {
            viewport.startDelta += viewport.getOffset();
        }
        scroller.logger.log(() => `start delta is ${viewport.startDelta}`);
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setFetchIndexes(scroller) {
        const { state, viewport } = scroller;
        /** @type {?} */
        const paddingDelta = viewport.getBufferPadding();
        /** @type {?} */
        const relativePosition = state.preFetchPosition - viewport.startDelta;
        /** @type {?} */
        const startPosition = relativePosition - paddingDelta;
        /** @type {?} */
        const endPosition = relativePosition + viewport.getSize() + paddingDelta;
        /** @type {?} */
        const firstIndexPosition = PreFetch.setFirstIndexBuffer(scroller, startPosition);
        PreFetch.setLastIndexBuffer(scroller, firstIndexPosition, endPosition);
        scroller.logger.fetch();
    }
    /**
     * @param {?} scroller
     * @param {?} startPosition
     * @return {?}
     */
    static setFirstIndexBuffer(scroller, startPosition) {
        const { state, buffer, state: { fetch } } = scroller;
        /** @type {?} */
        let firstIndex = state.startIndex;
        /** @type {?} */
        let firstIndexPosition = 0;
        if (scroller.state.isInitialLoop) {
            scroller.logger.log(`skipping fetch backward direction [initial loop]`);
        }
        else {
            /** @type {?} */
            const inc = startPosition < 0 ? -1 : 1;
            /** @type {?} */
            let position = firstIndexPosition;
            /** @type {?} */
            let index = firstIndex;
            while (1) {
                index += inc;
                if (index < buffer.absMinIndex) {
                    break;
                }
                position += inc * buffer.getSizeByIndex(index);
                if (inc < 0) {
                    firstIndex = index;
                    firstIndexPosition = position;
                    if (position <= startPosition) {
                        break;
                    }
                }
                else {
                    if (position > startPosition) {
                        break;
                    }
                    firstIndex = index;
                    firstIndexPosition = position;
                }
            }
        }
        fetch.firstIndex = fetch.firstIndexBuffer = Math.max(firstIndex, buffer.absMinIndex);
        return firstIndexPosition;
    }
    /**
     * @param {?} scroller
     * @param {?} startPosition
     * @param {?} endPosition
     * @return {?}
     */
    static setLastIndexBuffer(scroller, startPosition, endPosition) {
        const { state, buffer, settings } = scroller;
        /** @type {?} */
        let lastIndex;
        if (!buffer.hasItemSize) {
            // just to fetch forward bufferSize items if neither averageItemSize nor itemSize are present
            lastIndex = state.startIndex + settings.bufferSize - 1;
            scroller.logger.log(`forcing fetch forward direction [no item size]`);
        }
        else {
            /** @type {?} */
            let index = (/** @type {?} */ (state.fetch.firstIndexBuffer));
            /** @type {?} */
            let position = startPosition;
            lastIndex = index;
            while (1) {
                lastIndex = index;
                index++;
                position += buffer.getSizeByIndex(index);
                if (position >= endPosition) {
                    break;
                }
                if (index > buffer.absMaxIndex) {
                    break;
                }
            }
        }
        state.fetch.lastIndex = state.fetch.lastIndexBuffer = Math.min(lastIndex, buffer.absMaxIndex);
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static skipBufferedItems(scroller) {
        /** @type {?} */
        const buffer = scroller.buffer;
        if (!buffer.size) {
            return;
        }
        const { fetch } = scroller.state;
        /** @type {?} */
        const firstIndex = (/** @type {?} */ (fetch.firstIndex));
        /** @type {?} */
        const lastIndex = (/** @type {?} */ (fetch.lastIndex));
        /** @type {?} */
        const packs = [[]];
        /** @type {?} */
        let p = 0;
        for (let i = firstIndex; i <= lastIndex; i++) {
            if (!buffer.get(i)) {
                packs[p].push(i);
            }
            else if (packs[p].length) {
                packs[++p] = [];
            }
        }
        /** @type {?} */
        let pack = packs[0];
        if (packs[0].length && packs[1] && packs[1].length) {
            fetch.hasAnotherPack = true;
            // todo: need to look for biggest pack in visible area
            // todo: or think about merging two requests in a single Fetch process
            if (packs[1].length >= packs[0].length) {
                pack = packs[1];
            }
        }
        fetch.firstIndex = Math.max(pack[0], buffer.absMinIndex);
        fetch.lastIndex = Math.min(pack[pack.length - 1], buffer.absMaxIndex);
        if (fetch.firstIndex !== firstIndex || fetch.lastIndex !== lastIndex) {
            scroller.logger.fetch('after Buffer flushing');
        }
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static checkFetchPackSize(scroller) {
        const { buffer, state: { fetch } } = scroller;
        if (!fetch.shouldFetch) {
            return;
        }
        /** @type {?} */
        const firstIndex = (/** @type {?} */ (fetch.firstIndex));
        /** @type {?} */
        const lastIndex = (/** @type {?} */ (fetch.lastIndex));
        /** @type {?} */
        const diff = scroller.settings.bufferSize - (lastIndex - firstIndex + 1);
        if (diff <= 0) {
            return;
        }
        if (!buffer.size || lastIndex > buffer.items[0].$index) { // forward
            // forward
            /** @type {?} */
            const newLastIndex = Math.min(lastIndex + diff, buffer.absMaxIndex);
            if (newLastIndex > lastIndex) {
                fetch.lastIndex = fetch.lastIndexBuffer = newLastIndex;
            }
        }
        else {
            /** @type {?} */
            const newFirstIndex = Math.max(firstIndex - diff, buffer.absMinIndex);
            if (newFirstIndex < firstIndex) {
                fetch.firstIndex = fetch.firstIndexBuffer = newFirstIndex;
            }
        }
        if (fetch.firstIndex !== firstIndex || fetch.lastIndex !== lastIndex) {
            scroller.logger.fetch('after bufferSize adjustment');
            PreFetch.skipBufferedItems(scroller);
        }
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setFetchDirection(scroller) {
        const { buffer, state: { fetch } } = scroller;
        if (fetch.lastIndex) {
            /** @type {?} */
            let direction = Direction.forward;
            if (buffer.size) {
                direction = fetch.lastIndex < buffer.items[0].$index ? Direction.backward : Direction.forward;
            }
            fetch.direction = direction;
            scroller.logger.log(() => `fetch direction is "${direction}"`);
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Fetch {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        /** @type {?} */
        const result = Fetch.get(scroller);
        if (typeof result.subscribe !== 'function') {
            if (!result.isError) {
                Fetch.success(result.data, scroller);
            }
            else {
                Fetch.fail(result.error, scroller);
            }
        }
        else {
            scroller.innerLoopSubscriptions.push(result.subscribe((data) => Fetch.success(data, scroller), (error) => Fetch.fail(error, scroller)));
        }
    }
    /**
     * @param {?} data
     * @param {?} scroller
     * @return {?}
     */
    static success(data, scroller) {
        scroller.logger.log(() => `resolved ${data.length} items ` +
            `(index = ${scroller.state.fetch.index}, count = ${scroller.state.fetch.count})`);
        scroller.state.fetch.newItemsData = data;
        scroller.callWorkflow({
            process: Process.fetch,
            status: ProcessStatus.next
        });
    }
    /**
     * @param {?} error
     * @param {?} scroller
     * @return {?}
     */
    static fail(error, scroller) {
        scroller.callWorkflow({
            process: Process.fetch,
            status: ProcessStatus.error,
            payload: { error }
        });
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static get(scroller) {
        /** @type {?} */
        const _get = (/** @type {?} */ (scroller.datasource.get));
        /** @type {?} */
        let immediateData;
        /** @type {?} */
        let immediateError;
        /** @type {?} */
        let observer;
        /** @type {?} */
        const success = (data) => {
            if (!observer) {
                immediateData = data || null;
                return;
            }
            observer.next(data);
            observer.complete();
        };
        /** @type {?} */
        const reject = (error) => {
            if (!observer) {
                immediateError = error || null;
                return;
            }
            observer.error(error);
        };
        /** @type {?} */
        const result = _get(scroller.state.fetch.index, scroller.state.fetch.count, success, reject);
        if (result && typeof result.then === 'function') { // DatasourceGetPromise
            result.then(success, reject);
        }
        else if (result && typeof result.subscribe === 'function') { // DatasourceGetObservable
            return result; // do not wrap observable
        }
        if (immediateData !== undefined || immediateError !== undefined) {
            return {
                data: immediateData,
                error: immediateError,
                isError: immediateError !== undefined
            };
        }
        return Observable.create((_observer) => {
            observer = _observer;
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Item {
    /**
     * @param {?} $index
     * @param {?} data
     * @param {?} routines
     */
    constructor($index, data, routines) {
        this.$index = $index;
        this.data = data;
        this.nodeId = String($index);
        this.routines = routines;
        this.invisible = true;
    }
    /**
     * @return {?}
     */
    setSize() {
        this.size = this.routines.getSize(this.element);
    }
    /**
     * @return {?}
     */
    hide() {
        if (this.element) {
            this.routines.hideElement(this.element);
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PostFetch {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        if (PostFetch.setItems(scroller)) {
            PostFetch.setBufferLimits(scroller);
            scroller.callWorkflow({
                process: Process.postFetch,
                status: scroller.state.fetch.hasNewItems ? ProcessStatus.next : ProcessStatus.done
            });
        }
        else {
            scroller.callWorkflow({
                process: Process.postFetch,
                status: ProcessStatus.error,
                payload: { error: 'Can\'t set buffer items' }
            });
        }
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setBufferLimits(scroller) {
        const { buffer, state: { fetch: { firstIndex, lastIndex, items } } } = scroller;
        if (!items.length) {
            if ((/** @type {?} */ (lastIndex)) < buffer.minIndex) {
                buffer.absMinIndex = buffer.minIndex;
            }
            if ((/** @type {?} */ (firstIndex)) > buffer.maxIndex) {
                buffer.absMaxIndex = buffer.maxIndex;
            }
        }
        else {
            /** @type {?} */
            const last = items.length - 1;
            if ((/** @type {?} */ (firstIndex)) < items[0].$index) {
                buffer.absMinIndex = items[0].$index;
            }
            if ((/** @type {?} */ (lastIndex)) > items[last].$index) {
                buffer.absMaxIndex = items[last].$index;
            }
        }
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setItems(scroller) {
        const { buffer, state: { fetch } } = scroller;
        /** @type {?} */
        const items = fetch.newItemsData;
        if (!items || !items.length) { // empty result
            return true;
        }
        // eof/bof case, need to shift fetch index if bof
        /** @type {?} */
        let fetchIndex = (/** @type {?} */ (fetch.index));
        if (items.length < fetch.count) {
            if (scroller.state.isInitialLoop) {
                // let's treat initial poor fetch as startIndex-bof
                fetchIndex = scroller.state.startIndex;
            }
            else if ((/** @type {?} */ (fetch.firstIndex)) < buffer.minIndex) { // normal bof
                fetchIndex = buffer.minIndex - items.length;
            }
        }
        fetch.items = items.map((item, index) => new Item(fetchIndex + index, item, scroller.routines));
        fetch.isPrepend = !!buffer.items.length && buffer.items[0].$index > fetch.items[fetch.items.length - 1].$index;
        return buffer.setItems(fetch.items);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Render {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        scroller.logger.stat('before new items render');
        scroller.innerLoopSubscriptions.push(scroller.bindData().subscribe(() => {
            if (Render.processElements(scroller)) {
                scroller.callWorkflow({
                    process: Process.render,
                    status: ProcessStatus.next
                });
            }
            else {
                scroller.callWorkflow({
                    process: Process.render,
                    status: ProcessStatus.error,
                    payload: { error: 'Can\'t associate item with element' }
                });
            }
        }));
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static processElements(scroller) {
        const { state, state: { fetch, fetch: { items } }, viewport, buffer } = scroller;
        /** @type {?} */
        const itemsLength = items.length;
        /** @type {?} */
        const scrollBeforeRender = scroller.settings.windowViewport ? scroller.viewport.scrollPosition : 0;
        state.sizeBeforeRender = viewport.getScrollableSize();
        state.fwdPaddingBeforeRender = viewport.paddings.forward.size;
        for (let j = 0; j < itemsLength; j++) {
            /** @type {?} */
            const item = items[j];
            /** @type {?} */
            const element = viewport.element.querySelector(`[data-sid="${item.nodeId}"]`);
            if (!element) {
                return false;
            }
            item.element = (/** @type {?} */ (element));
            item.element.style.left = '';
            item.element.style.position = '';
            item.invisible = false;
            item.setSize();
            buffer.cache.add(item);
            if (item.$index < fetch.minIndex) {
                fetch.negativeSize += item.size;
            }
        }
        buffer.checkAverageSize();
        if (scroller.settings.windowViewport && fetch.isPrepend) {
            Render.processWindowScrollBackJump(scroller, scrollBeforeRender);
        }
        scroller.logger.stat('after new items render');
        return true;
    }
    /**
     * @param {?} scroller
     * @param {?} scrollBeforeRender
     * @return {?}
     */
    static processWindowScrollBackJump(scroller, scrollBeforeRender) {
        const { state, state: { scrollState: { window } }, viewport } = scroller;
        // if new items have been rendered in the area that is before current scroll position
        // then this position will be updated silently in case of entire window scrollable
        // so we need to remember the delta and to update scroll position manually right after it is changed silently
        /** @type {?} */
        const inc = scrollBeforeRender >= viewport.paddings.backward.size ? 1 : -1;
        /** @type {?} */
        const delta = inc * Math.abs(viewport.getScrollableSize() - state.sizeBeforeRender);
        /** @type {?} */
        const positionToUpdate = scrollBeforeRender - delta;
        if (delta && positionToUpdate > 0) {
            window.positionToUpdate = positionToUpdate;
            window.delta = delta;
            scroller.logger.log(() => {
                /** @type {?} */
                const token = delta < 0 ? 'reduced' : 'increased';
                return [`next scroll position (if ${positionToUpdate}) should be ${token} by`, Math.abs(delta)];
            });
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Adjust {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        scroller.state.preAdjustPosition = scroller.viewport.scrollPosition;
        // padding-elements adjustments
        /** @type {?} */
        const setPaddingsResult = Adjust.setPaddings(scroller);
        if (setPaddingsResult === false) {
            scroller.callWorkflow({
                process: Process.adjust,
                status: ProcessStatus.error,
                payload: { error: 'Can\'t get visible item' }
            });
            return;
        }
        // scroll position adjustments
        Adjust.fixScrollPosition(scroller, (/** @type {?} */ (setPaddingsResult)));
        scroller.callWorkflow({
            process: Process.adjust,
            status: ProcessStatus.done
        });
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setPaddings(scroller) {
        const { viewport, buffer, state: { fetch } } = scroller;
        /** @type {?} */
        const firstItem = buffer.getFirstVisibleItem();
        /** @type {?} */
        const lastItem = buffer.getLastVisibleItem();
        if (!firstItem || !lastItem) {
            return false;
        }
        /** @type {?} */
        const forwardPadding = viewport.paddings.forward;
        /** @type {?} */
        const backwardPadding = viewport.paddings.backward;
        /** @type {?} */
        const firstIndex = firstItem.$index;
        /** @type {?} */
        const lastIndex = lastItem.$index;
        /** @type {?} */
        const minIndex = isFinite(buffer.absMinIndex) ? buffer.absMinIndex : buffer.minIndex;
        /** @type {?} */
        const maxIndex = isFinite(buffer.absMaxIndex) ? buffer.absMaxIndex : buffer.maxIndex;
        /** @type {?} */
        const hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        let index;
        /** @type {?} */
        let bwdSize = 0;
        /** @type {?} */
        let fwdSize = 0;
        /** @type {?} */
        let bwdPaddingAverageSizeItemsCount = 0;
        // new backward padding
        for (index = minIndex; index < firstIndex; index++) {
            /** @type {?} */
            const item = buffer.cache.get(index);
            bwdSize += item ? item.size : buffer.cache.averageSize;
            if (hasAverageItemSizeChanged) {
                bwdPaddingAverageSizeItemsCount += !item ? 1 : 0;
            }
        }
        if (hasAverageItemSizeChanged) {
            for (index = firstIndex; index < (/** @type {?} */ (fetch.firstIndexBuffer)); index++) {
                bwdPaddingAverageSizeItemsCount += !buffer.cache.get(index) ? 1 : 0;
            }
        }
        // new forward padding
        for (index = lastIndex + 1; index <= maxIndex; index++) {
            /** @type {?} */
            const item = buffer.cache.get(index);
            fwdSize += item ? item.size : buffer.cache.averageSize;
        }
        /** @type {?} */
        const fwdPaddingDiff = forwardPadding.size - fwdSize;
        /** @type {?} */
        const viewportSizeDiff = viewport.getSize() - viewport.getScrollableSize() + fwdPaddingDiff;
        if (viewportSizeDiff > 0) {
            fwdSize += viewportSizeDiff;
            scroller.logger.log(`forward padding will be increased by ${viewportSizeDiff} to fill the viewport`);
        }
        forwardPadding.size = fwdSize;
        backwardPadding.size = bwdSize;
        scroller.logger.stat('after paddings adjustments');
        return bwdPaddingAverageSizeItemsCount;
    }
    /**
     * @param {?} scroller
     * @param {?} bwdPaddingAverageSizeItemsCount
     * @return {?}
     */
    static fixScrollPosition(scroller, bwdPaddingAverageSizeItemsCount) {
        const { viewport, buffer, state, state: { fetch, fetch: { items, negativeSize } } } = scroller;
        if (scroller.settings.windowViewport) {
            /** @type {?} */
            const newPosition = viewport.scrollPosition;
            /** @type {?} */
            const posDiff = state.preAdjustPosition - newPosition;
            if (posDiff) {
                /** @type {?} */
                const winState = state.scrollState.window;
                if (newPosition === winState.positionToUpdate) {
                    winState.reset();
                    state.syntheticScroll.readyToReset = false;
                    scroller.logger.log(() => `process window scroll preventive: sum(${newPosition}, ${posDiff})`);
                    Adjust.setScroll(scroller, posDiff);
                    scroller.logger.stat('after scroll position adjustment (window)');
                    return;
                }
            }
        }
        // if backward padding has been changed due to average item size change
        /** @type {?} */
        const hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        const bwdAverageItemsCountDiff = state.bwdPaddingAverageSizeItemsCount - bwdPaddingAverageSizeItemsCount;
        /** @type {?} */
        const hasBwdParamsChanged = bwdPaddingAverageSizeItemsCount > 0 || bwdAverageItemsCountDiff > 0;
        if (hasAverageItemSizeChanged && hasBwdParamsChanged) {
            /** @type {?} */
            const _bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * buffer.averageSize;
            /** @type {?} */
            const bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * fetch.averageItemSize;
            /** @type {?} */
            const bwdPaddingAverageSizeDiff = _bwdPaddingAverageSize - bwdPaddingAverageSize;
            /** @type {?} */
            const bwdAverageItemsSizeDiff = bwdAverageItemsCountDiff * fetch.averageItemSize;
            /** @type {?} */
            const positionDiff = bwdPaddingAverageSizeDiff - bwdAverageItemsSizeDiff;
            if (positionDiff) {
                Adjust.setScroll(scroller, positionDiff);
                scroller.logger.stat('after scroll position adjustment (average)');
            }
            state.bwdPaddingAverageSizeItemsCount = bwdPaddingAverageSizeItemsCount;
        }
        // if scrollable area size padding forward size have not been changed during this cycle
        if (state.sizeBeforeRender === viewport.getScrollableSize() &&
            viewport.paddings.forward.size === state.fwdPaddingBeforeRender) {
            return;
        }
        // no negative area items
        if (items[0].$index >= fetch.minIndex) {
            return;
        }
        if (negativeSize > 0) {
            Adjust.setScroll(scroller, negativeSize);
        }
        else if (negativeSize < 0) {
            viewport.paddings.forward.size -= negativeSize;
            viewport.scrollPosition -= negativeSize;
        }
        scroller.logger.stat('after scroll position adjustment (negative)');
    }
    /**
     * @param {?} scroller
     * @param {?} delta
     * @return {?}
     */
    static setScroll(scroller, delta) {
        const { viewport } = scroller;
        /** @type {?} */
        const forwardPadding = viewport.paddings[Direction.forward];
        /** @type {?} */
        const oldPosition = viewport.scrollPosition;
        /** @type {?} */
        const newPosition = Math.round(oldPosition + delta);
        for (let i = 0; i < Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT; i++) {
            viewport.scrollPosition = newPosition;
            /** @type {?} */
            const positionDiff = newPosition - viewport.scrollPosition;
            if (positionDiff > 0) {
                forwardPadding.size += positionDiff;
            }
            else {
                break;
            }
        }
    }
}
Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT = 10;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Clip {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        Clip.prepareClip(scroller);
        if (scroller.state.clip) {
            Clip.doClip(scroller);
        }
        scroller.callWorkflow({
            process: Process.clip,
            status: ProcessStatus.next
        });
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static prepareClip(scroller) {
        const { buffer, state, state: { fetch, fetch: { direction } } } = scroller;
        if (!buffer.size) {
            return;
        }
        if (state.isInitialWorkflowCycle && !state.scrollState.scroll) {
            scroller.logger.log(`skipping clip [initial cycle, no scroll]`);
            return;
        }
        /** @type {?} */
        const firstIndex = (/** @type {?} */ (fetch.firstIndexBuffer));
        /** @type {?} */
        const lastIndex = (/** @type {?} */ (fetch.lastIndexBuffer));
        scroller.logger.log(() => `looking for ${direction ? 'anti-' + direction + ' ' : ''}items ` +
            `that are out of [${firstIndex}..${lastIndex}] range`);
        if (!direction || direction === Direction.forward) {
            if (firstIndex - 1 >= buffer.absMinIndex) {
                Clip.prepareClipByDirection(scroller, Direction.forward, firstIndex);
            }
        }
        if (!direction || direction === Direction.backward) {
            if (lastIndex + 1 <= buffer.absMaxIndex) {
                Clip.prepareClipByDirection(scroller, Direction.backward, lastIndex);
            }
        }
        return;
    }
    /**
     * @param {?} scroller
     * @param {?} direction
     * @param {?} edgeIndex
     * @return {?}
     */
    static prepareClipByDirection(scroller, direction, edgeIndex) {
        /** @type {?} */
        const forward = direction === Direction.forward;
        scroller.buffer.items.forEach(item => {
            if ((forward && item.$index < edgeIndex) ||
                (!forward && item.$index > edgeIndex)) {
                item.toRemove = true;
                item.removeDirection = direction;
                scroller.state.clip = true;
            }
        });
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static doClip(scroller) {
        const { buffer, viewport: { paddings }, logger } = scroller;
        /** @type {?} */
        const clipped = [];
        /** @type {?} */
        const size = { backward: 0, forward: 0 };
        scroller.state.clipCall++;
        logger.stat(`before clip (${scroller.state.clipCall})`);
        buffer.items = buffer.items.filter(item => {
            if (item.toRemove) {
                size[item.removeDirection] += item.size;
                item.hide();
                clipped.push(item.$index);
                return false;
            }
            return true;
        });
        if (size.backward) {
            paddings.forward.size += size.backward;
        }
        if (size.forward) {
            paddings.backward.size += size.forward;
        }
        logger.log(() => [
            `clipped ${clipped.length} items` +
                (size.backward ? `, +${size.backward} fwd px,` : '') +
                (size.forward ? `, +${size.forward} bwd px,` : ''),
            `range: [${clipped[0]}..${clipped[clipped.length - 1]}]`
        ]);
        logger.stat('after clip');
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class End {
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    static run(scroller, error) {
        // finalize current workflow loop
        End.endWorkflowLoop(scroller);
        // set out params, accessible via Adapter
        End.calculateParams(scroller);
        // what next? done?
        /** @type {?} */
        const next = End.getNext(scroller, error);
        // need to apply Buffer.items changes if clip
        if (scroller.state.clip) {
            scroller.runChangeDetector();
        }
        // stub method call
        scroller.finalize();
        // continue the Workflow synchronously; current cycle could be finilized immediately
        scroller.callWorkflow({
            process: Process.end,
            status: next ? ProcessStatus.next : ProcessStatus.done,
            payload: next || { empty: true }
        });
        // if the Workflow isn't finilized, it may freeze for no more than settings.throttle ms
        if (scroller.state.workflowPending && !scroller.state.loopPending) {
            // continue the Workflow asynchronously
            End.continueWorkflowByTimer(scroller);
        }
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static endWorkflowLoop(scroller) {
        const { state } = scroller;
        state.endLoop();
        state.lastPosition = scroller.viewport.scrollPosition;
        scroller.purgeInnerLoopSubscriptions();
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static calculateParams(scroller) {
        const { items } = scroller.buffer;
        // first visible item
        if (scroller.state.firstVisibleWanted) {
            /** @type {?} */
            const viewportBackwardEdge = scroller.viewport.getEdge(Direction.backward);
            /** @type {?} */
            const firstItem = items.find(item => scroller.viewport.getElementEdge(item.element, Direction.forward) > viewportBackwardEdge);
            scroller.state.firstVisibleItem = firstItem ? {
                $index: firstItem.$index,
                data: firstItem.data,
                element: firstItem.element
            } : itemAdapterEmpty;
        }
        // last visible item
        if (scroller.state.lastVisibleWanted) {
            /** @type {?} */
            const viewportForwardEdge = scroller.viewport.getEdge(Direction.forward);
            /** @type {?} */
            let lastItem = null;
            for (let i = items.length - 1; i >= 0; i--) {
                /** @type {?} */
                const edge = scroller.viewport.getElementEdge(items[i].element, Direction.backward);
                if (edge < viewportForwardEdge) {
                    lastItem = items[i];
                    break;
                }
            }
            scroller.state.lastVisibleItem = lastItem ? {
                $index: lastItem.$index,
                data: lastItem.data,
                element: lastItem.element
            } : itemAdapterEmpty;
        }
    }
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    static getNext(scroller, error) {
        const { state: { fetch, scrollState } } = scroller;
        /** @type {?} */
        let next = null;
        if (!error) {
            if (fetch.hasNewItems) {
                next = { scroll: false };
            }
            else if (fetch.hasAnotherPack) {
                next = { scroll: false };
            }
            if (scrollState.keepScroll) {
                next = { scroll: true, keepScroll: true };
            }
        }
        return next;
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static continueWorkflowByTimer(scroller) {
        const { state, state: { workflowCycleCount, innerLoopCount } } = scroller;
        scroller.logger.log(() => `setting Workflow timer (${workflowCycleCount}-${innerLoopCount})`);
        state.scrollState.workflowTimer = (/** @type {?} */ (setTimeout(() => {
            // if the WF isn't finilized while the old sub-cycle is done and there's no new sub-cycle
            if (state.workflowPending && !state.loopPending && innerLoopCount === state.innerLoopCount) {
                scroller.callWorkflow({
                    process: Process.end,
                    status: ProcessStatus.next,
                    payload: { scroll: true, byTimer: true }
                });
            }
        }, scroller.settings.throttle)));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Workflow {
    /**
     * @param {?} context
     */
    constructor(context) {
        this.context = context;
        this.scroller = new Scroller(this.context, this.callWorkflow.bind(this));
        this.process$ = new BehaviorSubject((/** @type {?} */ ({
            process: Process.init,
            status: ProcessStatus.start
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
        if (status === ProcessStatus.error) {
            End.run(scroller, payload);
            return;
        }
        switch (data.process) {
            case Process.init:
                if (status === ProcessStatus.start) {
                    Init.run(scroller);
                }
                if (status === ProcessStatus.next) {
                    Start.run(scroller, payload);
                }
                break;
            case Process.reload:
                if (status === ProcessStatus.start) {
                    Reload.run(scroller, payload);
                }
                if (status === ProcessStatus.next) {
                    Init.run(scroller);
                }
                break;
            case Process.scroll:
                if (status === ProcessStatus.next) {
                    if (!(payload && payload.keepScroll)) {
                        Init.run(scroller, payload);
                    }
                    else {
                        Start.run(scroller, payload);
                    }
                }
                break;
            case Process.start:
                if (status === ProcessStatus.next) {
                    PreFetch.run(scroller);
                }
                break;
            case Process.preFetch:
                if (status === ProcessStatus.done) {
                    End.run(scroller);
                }
                if (status === ProcessStatus.next) {
                    Fetch.run(scroller);
                }
                break;
            case Process.fetch:
                if (status === ProcessStatus.next) {
                    PostFetch.run(scroller);
                }
                break;
            case Process.postFetch:
                if (status === ProcessStatus.next) {
                    Render.run(scroller);
                }
                if (status === ProcessStatus.done) {
                    End.run(scroller);
                }
                break;
            case Process.render:
                if (status === ProcessStatus.next) {
                    if (scroller.settings.infinite) {
                        Adjust.run(scroller);
                    }
                    else {
                        Clip.run(scroller);
                    }
                }
                break;
            case Process.clip:
                if (status === ProcessStatus.next) {
                    Adjust.run(scroller);
                }
                break;
            case Process.adjust:
                if (status === ProcessStatus.done) {
                    End.run(scroller);
                }
                break;
            case Process.end:
                if (status === ProcessStatus.next) {
                    if (payload && payload.keepScroll) {
                        Scroll.run(scroller);
                    }
                    else {
                        Start.run(scroller, payload);
                    }
                }
                if (status === ProcessStatus.done) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class UiScrollComponent {
    /**
     * @param {?} changeDetector
     * @param {?} elementRef
     */
    constructor(changeDetector, elementRef) {
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.workflow = new Workflow(this);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.workflow.dispose();
    }
}
UiScrollComponent.decorators = [
    { type: Component, args: [{
                selector: '[ui-scroll]',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<div data-padding-backward></div><div
  *ngFor="let item of items"
  [attr.data-sid]="item.nodeId"
  [style.position]="item.invisible ? 'fixed' : null"
  [style.left]="item.invisible ? '-99999px' : null"
><ng-template
  [ngTemplateOutlet]="template"
  [ngTemplateOutletContext]="{
    $implicit: item.data,
    index: item.$index,
    odd: item.$index % 2,
    even: !(item.$index % 2)
 }"
></ng-template></div><div data-padding-forward></div>`
            }] }
];
/** @nocollapse */
UiScrollComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var version = '1.0.1';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class UiScrollDirective {
    /**
     * @param {?} templateRef
     * @param {?} viewContainer
     * @param {?} resolver
     */
    constructor(templateRef, viewContainer, resolver) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    /**
     * @param {?} datasource
     * @return {?}
     */
    set uiScrollOf(datasource) {
        this.datasource = datasource;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const templateView = this.templateRef.createEmbeddedView({});
        /** @type {?} */
        const compFactory = this.resolver.resolveComponentFactory(UiScrollComponent);
        /** @type {?} */
        const componentRef = this.viewContainer.createComponent(compFactory, undefined, this.viewContainer.injector, [templateView.rootNodes]);
        componentRef.instance.datasource = this.datasource;
        componentRef.instance.template = this.templateRef;
        componentRef.instance.version = version;
    }
}
UiScrollDirective.decorators = [
    { type: Directive, args: [{ selector: '[uiScroll][uiScrollOf]' },] }
];
/** @nocollapse */
UiScrollDirective.ctorParameters = () => [
    { type: TemplateRef },
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver }
];
UiScrollDirective.propDecorators = {
    uiScrollOf: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class UiScrollModule {
}
UiScrollModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    UiScrollComponent,
                    UiScrollDirective
                ],
                imports: [CommonModule],
                entryComponents: [UiScrollComponent],
                exports: [UiScrollDirective],
                providers: []
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { UiScrollModule, Datasource, UiScrollComponent as ɵa, UiScrollDirective as ɵb };
//# sourceMappingURL=ngx-ui-scroll.js.map
