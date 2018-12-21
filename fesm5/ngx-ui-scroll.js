/**
 * @license ngx-ui-scroll
 * MIT license
 */

import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { __assign } from 'tslib';
import { Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef, ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var checkDatasource = function (datasource) {
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
var assignBoolean = function (target, source, token, defaults) {
    /** @type {?} */
    var param = ((/** @type {?} */ (source)))[token];
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
var assignNumeric = function (target, source, token, defaults, integer) {
    if (integer === void 0) { integer = false; }
    /** @type {?} */
    var param = ((/** @type {?} */ (source)))[token];
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
var assignMinimalNumeric = function (target, source, token, defaults, minSettings, integer, mustExist) {
    if (integer === void 0) { integer = false; }
    if (mustExist === void 0) { mustExist = true; }
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
var assignCommon = function (target, settings, defaults) {
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
var assignSettings = function (target, settings, defaults, minSettings) {
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
var assignDevSettings = function (target, devSettings, defaults, minDevSettings) {
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
var Direction = {
    forward: 'forward',
    backward: 'backward',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {string} */
var Process = {
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
var ProcessStatus = {
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
/** @type {?} */
var getInitializedSubject = function (adapter, method) {
    return adapter.init ? method() :
        adapter.init$
            .pipe(switchMap(function () {
            return method();
        }));
};
/** @type {?} */
var itemAdapterEmpty = (/** @type {?} */ ({
    data: {},
    element: {}
}));
/** @type {?} */
var generateMockAdapter = function () { return ((/** @type {?} */ ({
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Datasource = /** @class */ (function () {
    function Datasource(datasource, hasNoAdapter) {
        this.constructed = true;
        Object.assign((/** @type {?} */ (this)), datasource);
        if (hasNoAdapter) {
            this.adapter = (/** @type {?} */ (generateMockAdapter()));
        }
        else {
            this.adapter = new Adapter();
        }
    }
    return Datasource;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var defaultSettings = {
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
var minSettings = {
    itemSize: 1,
    bufferSize: 1,
    padding: 0.01
};
/** @type {?} */
var defaultDevSettings = {
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
var minDevSettings = {
    throttle: 0,
    inertiaScrollDelay: 0,
    inertiaScrollDelta: 0,
    initDelay: 0,
    initWindowDelay: 0,
    maxSynthScrollDelay: 0
};
var Settings = /** @class */ (function () {
    function Settings(settings, devSettings, instanceIndex) {
        assignSettings(this, settings || {}, defaultSettings, minSettings);
        assignDevSettings(this, devSettings || {}, defaultDevSettings, minDevSettings);
        this.instanceIndex = instanceIndex;
        this.initializeDelay = this.getInitializeDelay();
        // todo: min/max indexes must be ignored if infinite mode is enabled ??
    }
    /**
     * @return {?}
     */
    Settings.prototype.getInitializeDelay = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = 0;
        if (this.windowViewport && this.initWindowDelay && !('scrollRestoration' in history)) {
            result = this.initWindowDelay;
        }
        if (this.initDelay > 0) {
            result = Math.max(result, this.initDelay);
        }
        return result;
    };
    return Settings;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Logger = /** @class */ (function () {
    function Logger(scroller) {
        this.logs = [];
        var settings = scroller.settings;
        this.debug = settings.debug;
        this.immediateLog = settings.immediateLog;
        this.logTime = settings.logTime;
        this.getTime = function () {
            return scroller.state && " // time: " + scroller.state.time;
        };
        this.getStat = function () {
            var buffer = scroller.buffer, viewport = scroller.viewport;
            /** @type {?} */
            var first = buffer.getFirstVisibleItem();
            /** @type {?} */
            var last = buffer.getLastVisibleItem();
            return 'pos: ' + viewport.scrollPosition + ', ' +
                'size: ' + viewport.getScrollableSize() + ', ' +
                'bwd_p: ' + viewport.paddings.backward.size + ', ' +
                'fwd_p: ' + viewport.paddings.forward.size + ', ' +
                'aver: ' + (buffer.hasItemSize ? buffer.averageSize : 'no') + ', ' +
                'items: ' + buffer.getVisibleItemsCount() + ', ' +
                'range: ' + (first && last ? "[" + first.$index + ".." + last.$index + "]" : 'no');
        };
        this.getFetchRange = function () {
            var _a = scroller.state.fetch, firstIndex = _a.firstIndex, lastIndex = _a.lastIndex;
            /** @type {?} */
            var hasInterval = firstIndex !== null && lastIndex !== null && !isNaN(firstIndex) && !isNaN(lastIndex);
            return hasInterval ? "[" + firstIndex + ".." + lastIndex + "]" : 'no';
        };
        this.getInnerLoopCount = function () { return scroller.state.innerLoopCount; };
        this.getWorkflowCycleData = function (more) {
            return scroller.settings.instanceIndex + "-" + scroller.state.workflowCycleCount + (more ? '-' : '');
        };
        this.log(function () { return "uiScroll Workflow has been started (v" + scroller.version + ", instance " + settings.instanceIndex + ")"; });
    }
    /**
     * @param {?} str
     * @param {?} obj
     * @param {?=} stringify
     * @return {?}
     */
    Logger.prototype.object = /**
     * @param {?} str
     * @param {?} obj
     * @param {?=} stringify
     * @return {?}
     */
    function (str, obj, stringify) {
        this.log(function () { return [
            str,
            stringify
                ? JSON.stringify(obj)
                    .replace(/"/g, '')
                    .replace(/(\{|\:|\,)/g, '$1 ')
                : obj
        ]; });
    };
    /**
     * @param {?=} str
     * @return {?}
     */
    Logger.prototype.stat = /**
     * @param {?=} str
     * @return {?}
     */
    function (str) {
        var _this = this;
        if (this.debug) {
            /** @type {?} */
            var logStyles_1 = ['color: #888; border: dashed #888 0; border-bottom-width: 0px', 'color: #000; border-width: 0'];
            this.log(function () { return ['%cstat' + (str ? " " + str : '') + ',%c ' + _this.getStat()].concat(logStyles_1); });
        }
    };
    /**
     * @param {?=} str
     * @return {?}
     */
    Logger.prototype.fetch = /**
     * @param {?=} str
     * @return {?}
     */
    function (str) {
        var _this = this;
        if (this.debug) {
            /** @type {?} */
            var _text_1 = 'fetch interval' + (str ? " " + str : '');
            /** @type {?} */
            var logStyles_2 = ['color: #888', 'color: #000'];
            this.log(function () { return ["%c" + _text_1 + ": %c" + _this.getFetchRange()].concat(logStyles_2); });
        }
    };
    /**
     * @param {?} data
     * @return {?}
     */
    Logger.prototype.logProcess = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (!this.debug) {
            return;
        }
        var process = data.process, status = data.status;
        /** @type {?} */
        var payload = data.payload || { empty: true };
        // standard process log
        /** @type {?} */
        var processLog = "process " + process + ", %c" + status + "%c" + (!payload.empty ? ',' : '');
        /** @type {?} */
        var styles = [status === ProcessStatus.error ? 'color: #cc0000;' : '', 'color: #000000;'];
        this.log(function () { return [processLog].concat(styles, (!payload.empty ? [payload] : [])); });
        // inner loop start-end log
        /** @type {?} */
        var workflowCycleData = this.getWorkflowCycleData(true);
        /** @type {?} */
        var loopCount = this.getInnerLoopCount();
        /** @type {?} */
        var loopLog = [];
        if (process === Process.init && status === ProcessStatus.next ||
            process === Process.scroll && status === ProcessStatus.next && payload.keepScroll ||
            process === Process.end && status === ProcessStatus.next && payload.byTimer) {
            loopLog.push("%c---=== loop " + (workflowCycleData + (loopCount + 1)) + " start");
        }
        else if (process === Process.end && !payload.byTimer) {
            loopLog.push("%c---=== loop " + (workflowCycleData + loopCount) + " done");
            if (status === ProcessStatus.next && !(payload.keepScroll)) {
                loopLog[0] += ", loop " + (workflowCycleData + (loopCount + 1)) + " start";
            }
        }
        if (loopLog.length) {
            this.log(function () { return loopLog.concat(['color: #006600;']); });
        }
        // workflow cycle start log
        if (process === Process.init && status === ProcessStatus.start ||
            process === Process.reload && status === ProcessStatus.next ||
            process === Process.scroll && status === ProcessStatus.next && !(payload.keepScroll)) {
            /** @type {?} */
            var logData_1 = this.getWorkflowCycleData(false);
            /** @type {?} */
            var logStyles_3 = 'color: #0000aa; border: solid black 1px; border-width: 1px 0 0 1px; margin-left: -2px';
            this.log(function () { return ["%c   ~~~ WF Cycle " + logData_1 + " STARTED ~~~  ", logStyles_3]; });
        }
        // workflow run end log
        if (process === Process.end && status === ProcessStatus.done) {
            /** @type {?} */
            var logData_2 = this.getWorkflowCycleData(false);
            /** @type {?} */
            var logStyles_4 = 'color: #0000aa; border: solid #555 1px; border-width: 0 0 1px 1px; margin-left: -2px';
            this.log(function () { return ["%c   ~~~ WF Cycle " + logData_2 + " FINALIZED ~~~  ", logStyles_4]; });
        }
    };
    /**
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.log = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.debug) {
            if (typeof args[0] === 'function') {
                args = args[0]();
                if (!Array.isArray(args)) {
                    args = [args];
                }
            }
            if (args.every(function (item) { return item === undefined; })) {
                return;
            }
            if (this.logTime) {
                args = args.concat([this.getTime()]);
            }
            if (this.immediateLog) {
                console.log.apply(this, args);
            }
            else {
                this.logs.push(args);
            }
        }
    };
    /**
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.logForce = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.debug) {
            if (!this.immediateLog && this.logs.length) {
                this.logs.forEach(function (logArgs) { return console.log.apply(_this, logArgs); });
                this.logs = [];
            }
            if (args.length) {
                console.log.apply(this, args);
            }
        }
    };
    return Logger;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Routines = /** @class */ (function () {
    function Routines(settings) {
        this.horizontal = settings.horizontal;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getScrollPosition = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return element[this.horizontal ? 'scrollLeft' : 'scrollTop'];
    };
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    Routines.prototype.setScrollPosition = /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    function (element, value) {
        element[this.horizontal ? 'scrollLeft' : 'scrollTop'] = value;
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getParams = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
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
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getSize = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return this.getParams(element)[this.horizontal ? 'width' : 'height'];
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getSizeStyle = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var size = element.style[this.horizontal ? 'width' : 'height'];
        return parseInt((/** @type {?} */ (size)), 10) || 0;
    };
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    Routines.prototype.setSizeStyle = /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    function (element, value) {
        element.style[this.horizontal ? 'width' : 'height'] = value + "px";
    };
    /**
     * @param {?} params
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Routines.prototype.getRectEdge = /**
     * @param {?} params
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (params, direction, opposite) {
        /** @type {?} */
        var forward = !opposite ? Direction.forward : Direction.backward;
        return params[direction === forward ? (this.horizontal ? 'right' : 'bottom') : (this.horizontal ? 'left' : 'top')];
    };
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Routines.prototype.getEdge = /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (element, direction, opposite) {
        /** @type {?} */
        var params = this.getParams(element);
        return this.getRectEdge(params, direction, opposite);
    };
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?} relativeElement
     * @param {?} opposite
     * @return {?}
     */
    Routines.prototype.getEdge2 = /**
     * @param {?} element
     * @param {?} direction
     * @param {?} relativeElement
     * @param {?} opposite
     * @return {?}
     */
    function (element, direction, relativeElement, opposite) {
        // vertical only ?
        return element.offsetTop - (relativeElement ? relativeElement.scrollTop : 0) +
            (direction === (!opposite ? Direction.forward : Direction.backward) ? this.getSize(element) : 0);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.hideElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        element.style.display = 'none';
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getOffset = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return this.horizontal ? element.offsetLeft : element.offsetTop;
    };
    return Routines;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Padding = /** @class */ (function () {
    function Padding(element, direction, routines) {
        this.element = (/** @type {?} */ (element.querySelector("[data-padding-" + direction + "]")));
        this.direction = direction;
        this.routines = routines;
    }
    /**
     * @param {?=} size
     * @return {?}
     */
    Padding.prototype.reset = /**
     * @param {?=} size
     * @return {?}
     */
    function (size) {
        this.size = size || 0;
    };
    Object.defineProperty(Padding.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this.routines.getSizeStyle(this.element);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.routines.setSizeStyle(this.element, Math.round(value));
        },
        enumerable: true,
        configurable: true
    });
    return Padding;
}());
var Paddings = /** @class */ (function () {
    function Paddings(element, routines, settings) {
        this.settings = settings;
        this.forward = new Padding(element, Direction.forward, routines);
        this.backward = new Padding(element, Direction.backward, routines);
    }
    /**
     * @param {?} viewportSize
     * @param {?} startIndex
     * @return {?}
     */
    Paddings.prototype.reset = /**
     * @param {?} viewportSize
     * @param {?} startIndex
     * @return {?}
     */
    function (viewportSize, startIndex) {
        this.forward.reset(this.getPositiveSize(startIndex, viewportSize));
        this.backward.reset(this.getNegativeSize(startIndex));
    };
    /**
     * @param {?} startIndex
     * @param {?} viewportSize
     * @return {?}
     */
    Paddings.prototype.getPositiveSize = /**
     * @param {?} startIndex
     * @param {?} viewportSize
     * @return {?}
     */
    function (startIndex, viewportSize) {
        var settings = this.settings;
        /** @type {?} */
        var positiveSize = viewportSize;
        if (isFinite(settings.maxIndex)) {
            positiveSize = (settings.maxIndex - startIndex + 1) * settings.itemSize;
        }
        return positiveSize;
    };
    /**
     * @param {?} startIndex
     * @return {?}
     */
    Paddings.prototype.getNegativeSize = /**
     * @param {?} startIndex
     * @return {?}
     */
    function (startIndex) {
        var settings = this.settings;
        /** @type {?} */
        var negativeSize = 0;
        if (isFinite(settings.minIndex)) {
            negativeSize = (startIndex - settings.minIndex) * settings.itemSize;
        }
        return negativeSize;
    };
    return Paddings;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Viewport = /** @class */ (function () {
    function Viewport(elementRef, settings, routines, state, logger) {
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
    Viewport.prototype.reset = /**
     * @param {?} scrollPosition
     * @return {?}
     */
    function (scrollPosition) {
        /** @type {?} */
        var newPosition = 0;
        this.paddings.reset(this.getSize(), this.state.startIndex);
        /** @type {?} */
        var negativeSize = this.paddings.backward.size;
        if (negativeSize) {
            newPosition = negativeSize;
            this.state.bwdPaddingAverageSizeItemsCount = negativeSize / this.settings.itemSize;
        }
        this.scrollPosition = newPosition;
        this.state.scrollState.reset();
        this.state.syntheticScroll.reset(scrollPosition !== newPosition ? newPosition : null);
        this.startDelta = 0;
    };
    /**
     * @param {?} value
     * @param {?=} oldPosition
     * @return {?}
     */
    Viewport.prototype.setPosition = /**
     * @param {?} value
     * @param {?=} oldPosition
     * @return {?}
     */
    function (value, oldPosition) {
        if (oldPosition === undefined) {
            oldPosition = this.scrollPosition;
        }
        if (oldPosition === value) {
            this.logger.log(function () { return ['setting scroll position at', value, '[cancelled]']; });
            return value;
        }
        this.routines.setScrollPosition(this.scrollable, value);
        /** @type {?} */
        var position = this.scrollPosition;
        this.logger.log(function () { return ['setting scroll position at', position]; });
        return position;
    };
    Object.defineProperty(Viewport.prototype, "scrollPosition", {
        get: /**
         * @return {?}
         */
        function () {
            return this.routines.getScrollPosition(this.scrollable);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            /** @type {?} */
            var oldPosition = this.scrollPosition;
            /** @type {?} */
            var newPosition = this.setPosition(value, oldPosition);
            /** @type {?} */
            var synthState = this.state.syntheticScroll;
            synthState.time = Number(Date.now());
            synthState.position = newPosition;
            synthState.delta = newPosition - oldPosition;
            if (synthState.positionBefore === null) {
                // syntheticScroll.positionBefore should be set once per cycle
                synthState.positionBefore = oldPosition;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Viewport.prototype.getSize = /**
     * @return {?}
     */
    function () {
        return this.routines.getSize(this.host);
    };
    /**
     * @return {?}
     */
    Viewport.prototype.getScrollableSize = /**
     * @return {?}
     */
    function () {
        return this.routines.getSize(this.element);
    };
    /**
     * @return {?}
     */
    Viewport.prototype.getBufferPadding = /**
     * @return {?}
     */
    function () {
        return this.getSize() * this.settings.padding;
    };
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Viewport.prototype.getEdge = /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (direction, opposite) {
        return this.routines.getEdge(this.host, direction, opposite);
    };
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Viewport.prototype.getElementEdge = /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (element, direction, opposite) {
        return this.routines.getEdge(element, direction, opposite);
    };
    /**
     * @return {?}
     */
    Viewport.prototype.getOffset = /**
     * @return {?}
     */
    function () {
        return this.routines.getOffset(this.element);
    };
    return Viewport;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ItemCache = /** @class */ (function () {
    function ItemCache(item) {
        this.$index = item.$index;
        this.nodeId = item.nodeId;
        this.data = item.data;
        this.size = item.size;
    }
    return ItemCache;
}());
var RecalculateAverage = /** @class */ (function () {
    function RecalculateAverage() {
        this.reset();
    }
    /**
     * @return {?}
     */
    RecalculateAverage.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.newItems = [];
        this.oldItems = [];
    };
    return RecalculateAverage;
}());
var Cache = /** @class */ (function () {
    function Cache(itemSize, logger) {
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
    Cache.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.minIndex = +Infinity;
        this.maxIndex = -Infinity;
        this.items.clear();
        this.averageSizeFloat = this.itemSize;
        this.averageSize = this.itemSize;
        this.recalculateAverage.reset();
    };
    /**
     * @return {?}
     */
    Cache.prototype.recalculateAverageSize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var _a = this.recalculateAverage, oldItemsLength = _a.oldItems.length, newItemsLength = _a.newItems.length;
        if (!oldItemsLength && !newItemsLength) {
            return;
        }
        /** @type {?} */
        var oldItemsSize = this.recalculateAverage.oldItems.reduce(function (acc, index) { return acc + _this.getItemSize(index); }, 0);
        /** @type {?} */
        var newItemsSize = this.recalculateAverage.newItems.reduce(function (acc, index) { return acc + _this.getItemSize(index); }, 0);
        if (oldItemsLength) {
            /** @type {?} */
            var averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            var averageSizeLength = this.items.size - newItemsLength - oldItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + oldItemsSize) / averageSizeLength;
        }
        if (newItemsLength) {
            /** @type {?} */
            var averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            var averageSizeLength = this.items.size - newItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + newItemsSize) / this.items.size;
        }
        this.averageSize = Math.round(this.averageSizeFloat);
        this.recalculateAverage.reset();
        this.logger.log(function () { return "average size has been updated: " + _this.averageSize; });
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Cache.prototype.add = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var itemCache = this.get(item.$index);
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
    };
    /**
     * @param {?} index
     * @return {?}
     */
    Cache.prototype.getItemSize = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var item = this.get(index);
        return item ? item.size : 0;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    Cache.prototype.get = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        return this.items.get(index);
    };
    return Cache;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Buffer = /** @class */ (function () {
    function Buffer(settings, startIndex, logger) {
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
    Buffer.prototype.reset = /**
     * @param {?=} reload
     * @param {?=} startIndex
     * @return {?}
     */
    function (reload, startIndex) {
        if (reload) {
            this.items.forEach(function (item) { return item.hide(); });
        }
        this.items = [];
        this.pristine = true;
        this.cache.reset();
        this.absMinIndex = this.minIndexUser;
        this.absMaxIndex = this.maxIndexUser;
        if (typeof startIndex !== 'undefined') {
            this.startIndex = startIndex;
        }
    };
    Object.defineProperty(Buffer.prototype, "items", {
        get: /**
         * @return {?}
         */
        function () {
            return this._items;
        },
        set: /**
         * @param {?} items
         * @return {?}
         */
        function (items) {
            this.pristine = false;
            this._items = items;
            this.$items.next(items);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._items.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "averageSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this.cache.averageSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "hasItemSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this.averageSize !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "minIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return isFinite(this.cache.minIndex) ? this.cache.minIndex : this.startIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "maxIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return isFinite(this.cache.maxIndex) ? this.cache.maxIndex : this.startIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "bof", {
        get: /**
         * @return {?}
         */
        function () {
            return this.items.length ? (this.items[0].$index === this.absMinIndex) :
                isFinite(this.absMinIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "eof", {
        get: /**
         * @return {?}
         */
        function () {
            return this.items.length ? (this.items[this.items.length - 1].$index === this.absMaxIndex) :
                isFinite(this.absMaxIndex);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} $index
     * @return {?}
     */
    Buffer.prototype.get = /**
     * @param {?} $index
     * @return {?}
     */
    function ($index) {
        return this.items.find(function (item) { return item.$index === $index; });
    };
    /**
     * @param {?} items
     * @return {?}
     */
    Buffer.prototype.setItems = /**
     * @param {?} items
     * @return {?}
     */
    function (items) {
        if (!this.items.length) {
            this.items = items;
        }
        else if (this.items[0].$index > items[items.length - 1].$index) {
            this.items = items.concat(this.items);
        }
        else if (items[0].$index > this.items[this.items.length - 1].$index) {
            this.items = this.items.concat(items);
        }
        else {
            return false;
        }
        return true;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getFirstVisibleItemIndex = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var length = this.items.length;
        for (var i = 0; i < length; i++) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getLastVisibleItemIndex = /**
     * @return {?}
     */
    function () {
        for (var i = this.items.length - 1; i >= 0; i--) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getFirstVisibleItem = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var index = this.getFirstVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getLastVisibleItem = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var index = this.getLastVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    };
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Buffer.prototype.getEdgeVisibleItem = /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (direction, opposite) {
        return direction === (!opposite ? Direction.forward : Direction.backward) ?
            this.getLastVisibleItem() : this.getFirstVisibleItem();
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getVisibleItemsCount = /**
     * @return {?}
     */
    function () {
        return this.items.reduce(function (acc, item) { return acc + (item.invisible ? 0 : 1); }, 0);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    Buffer.prototype.getSizeByIndex = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var item = this.cache.get(index);
        return item ? item.size : this.averageSize;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.checkAverageSize = /**
     * @return {?}
     */
    function () {
        this.cache.recalculateAverageSize();
    };
    return Buffer;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FetchModel = /** @class */ (function () {
    function FetchModel() {
        this.callCount = 0;
        this.reset();
    }
    /**
     * @return {?}
     */
    FetchModel.prototype.reset = /**
     * @return {?}
     */
    function () {
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
    };
    Object.defineProperty(FetchModel.prototype, "newItemsData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._newItemsData;
        },
        set: /**
         * @param {?} items
         * @return {?}
         */
        function (items) {
            this._newItemsData = items;
            this.callCount++;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "shouldFetch", {
        get: /**
         * @return {?}
         */
        function () {
            return !!this.count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "hasNewItems", {
        get: /**
         * @return {?}
         */
        function () {
            return !!((this._newItemsData && this._newItemsData.length));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "index", {
        get: /**
         * @return {?}
         */
        function () {
            return this.firstIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "count", {
        get: /**
         * @return {?}
         */
        function () {
            return this.firstIndex !== null && this.lastIndex !== null ? this.lastIndex - this.firstIndex + 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    return FetchModel;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var instanceCount = 0;
var Scroller = /** @class */ (function () {
    function Scroller(context, callWorkflow) {
        /** @type {?} */
        var datasource = (/** @type {?} */ (checkDatasource(context.datasource)));
        this.datasource = datasource;
        this.version = context.version;
        this.runChangeDetector = function () { return context.changeDetector.markForCheck(); };
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
    Scroller.prototype.init = /**
     * @return {?}
     */
    function () {
        this.viewport.reset(0);
    };
    /**
     * @return {?}
     */
    Scroller.prototype.bindData = /**
     * @return {?}
     */
    function () {
        this.runChangeDetector();
        return Observable.create(function (observer) {
            setTimeout(function () {
                observer.next(true);
                observer.complete();
            });
        });
    };
    /**
     * @return {?}
     */
    Scroller.prototype.purgeInnerLoopSubscriptions = /**
     * @return {?}
     */
    function () {
        this.innerLoopSubscriptions.forEach(function (item) { return item.unsubscribe(); });
        this.innerLoopSubscriptions = [];
    };
    /**
     * @param {?=} localOnly
     * @return {?}
     */
    Scroller.prototype.purgeScrollTimers = /**
     * @param {?=} localOnly
     * @return {?}
     */
    function (localOnly) {
        var scrollState = this.state.scrollState;
        if (scrollState.scrollTimer) {
            clearTimeout(scrollState.scrollTimer);
            scrollState.scrollTimer = null;
        }
        if (!localOnly && scrollState.workflowTimer) {
            clearTimeout(scrollState.workflowTimer);
            scrollState.workflowTimer = null;
        }
    };
    /**
     * @return {?}
     */
    Scroller.prototype.dispose = /**
     * @return {?}
     */
    function () {
        this.purgeInnerLoopSubscriptions();
        this.purgeScrollTimers();
    };
    /**
     * @return {?}
     */
    Scroller.prototype.finalize = /**
     * @return {?}
     */
    function () {
    };
    return Scroller;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Init = /** @class */ (function () {
    function Init() {
    }
    /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    Init.run = /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    function (scroller, payload) {
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
    };
    return Init;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Scroll = /** @class */ (function () {
    function Scroll() {
    }
    /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    Scroll.run = /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    function (scroller, payload) {
        if (payload === void 0) { payload = {}; }
        scroller.logger.log(scroller.viewport.scrollPosition);
        if (scroller.state.syntheticScroll.position !== null) {
            if (!Scroll.processSyntheticScroll(scroller)) {
                return;
            }
        }
        this.delayScroll(scroller, payload);
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Scroll.processSyntheticScroll = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var viewport = scroller.viewport, syntheticScroll = scroller.state.syntheticScroll, settings = scroller.settings, logger = scroller.logger;
        /** @type {?} */
        var time = Number(new Date());
        /** @type {?} */
        var synthetic = __assign({}, syntheticScroll);
        /** @type {?} */
        var position = viewport.scrollPosition;
        /** @type {?} */
        var synthScrollDelay = time - synthetic.time;
        if (synthScrollDelay > settings.maxSynthScrollDelay) {
            logger.log(function () { return "reset synthetic scroll params (" + synthScrollDelay + " > " + settings.maxSynthScrollDelay + ")"; });
            syntheticScroll.reset();
            return position !== synthetic.position;
        }
        // synthetic scroll
        syntheticScroll.readyToReset = true;
        if (position === synthetic.position) {
            // let's reset syntheticScroll.position on first change
            logger.log(function () { return "skip synthetic scroll (" + position + ")"; });
            return false;
        }
        else if (synthetic.readyToReset) {
            syntheticScroll.position = null;
            syntheticScroll.positionBefore = null;
            logger.log(function () { return 'reset synthetic scroll params'; });
        }
        if (settings.windowViewport) {
            if (!synthetic.readyToReset) {
                logger.log(function () { return 'reset synthetic scroll params (window)'; });
                syntheticScroll.reset();
            }
            return true;
        }
        // inertia scroll over synthetic scroll
        if (position !== synthetic.position) {
            /** @type {?} */
            var inertiaDelta_1 = (/** @type {?} */ (synthetic.positionBefore)) - position;
            /** @type {?} */
            var syntheticDelta_1 = (/** @type {?} */ (synthetic.position)) - position;
            if (inertiaDelta_1 > 0 && inertiaDelta_1 < syntheticDelta_1) {
                /** @type {?} */
                var newPosition_1 = Math.max(0, position + syntheticScroll.delta);
                logger.log(function () { return 'inertia scroll adjustment' +
                    '. Position: ' + position +
                    ', synthetic position: ' + synthetic.position +
                    ', synthetic position before: ' + synthetic.positionBefore +
                    ', synthetic delay: ' + synthScrollDelay +
                    ', synthetic delta: ' + syntheticDelta_1 +
                    ', inertia delta: ' + inertiaDelta_1 +
                    ', new position: ' + newPosition_1; });
                if (settings.inertia) { // precise inertia settings
                    if (inertiaDelta_1 <= settings.inertiaScrollDelta && synthScrollDelay <= settings.inertiaScrollDelay) {
                        viewport.scrollPosition = newPosition_1;
                    }
                }
                else {
                    viewport.scrollPosition = newPosition_1;
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
    };
    /**
     * @param {?} scroller
     * @param {?} payload
     * @return {?}
     */
    Scroll.delayScroll = /**
     * @param {?} scroller
     * @param {?} payload
     * @return {?}
     */
    function (scroller, payload) {
        if (!scroller.settings.throttle || payload.byTimer) {
            Scroll.doScroll(scroller);
            return;
        }
        var scrollState = scroller.state.scrollState;
        /** @type {?} */
        var time = Number(Date.now());
        /** @type {?} */
        var tDiff = scrollState.lastScrollTime + scroller.settings.throttle - time;
        /** @type {?} */
        var dDiff = scroller.settings.throttle + (scrollState.firstScrollTime ? scrollState.firstScrollTime - time : 0);
        /** @type {?} */
        var diff = Math.max(tDiff, dDiff);
        // scroller.logger.log('tDiff:', tDiff, 'dDiff:', dDiff, 'diff:', diff);
        if (diff <= 0) {
            scroller.purgeScrollTimers(true);
            scrollState.lastScrollTime = time;
            scrollState.firstScrollTime = 0;
            Scroll.doScroll(scroller);
        }
        else if (!scrollState.scrollTimer && !scrollState.keepScroll) {
            scroller.logger.log(function () { return "setting the timer at " + (scroller.state.time + diff); });
            scrollState.firstScrollTime = time;
            scrollState.scrollTimer = (/** @type {?} */ (setTimeout(function () {
                scrollState.scrollTimer = null;
                scroller.logger.log(function () { return "fire the timer (" + scroller.state.time + ")"; });
                Scroll.run(scroller, { byTimer: true });
            }, diff)));
        } /* else {
          scroller.logger.log('MISS TIMER');
        } */
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Scroll.doScroll = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, scrollState = scroller.state.scrollState;
        if (state.workflowPending) {
            scroller.logger.log(function () {
                return !scrollState.keepScroll ? [
                    "setting %ckeepScroll%c flag (scrolling while the Workflow is pending)",
                    'color: #006600;', 'color: #000000;'
                ] : undefined;
            });
            scrollState.keepScroll = true;
            return;
        }
        scroller.callWorkflow({
            process: Process.scroll,
            status: ProcessStatus.next,
            payload: __assign({ scroll: true }, (scrollState.keepScroll ? { keepScroll: scrollState.keepScroll } : {}))
        });
    };
    return Scroll;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Reload = /** @class */ (function () {
    function Reload() {
    }
    /**
     * @param {?} scroller
     * @param {?} reloadIndex
     * @return {?}
     */
    Reload.run = /**
     * @param {?} scroller
     * @param {?} reloadIndex
     * @return {?}
     */
    function (scroller, reloadIndex) {
        /** @type {?} */
        var scrollPosition = scroller.viewport.scrollPosition;
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
    };
    return Reload;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Start = /** @class */ (function () {
    function Start() {
    }
    /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    Start.run = /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    function (scroller, payload) {
        scroller.state.startLoop(payload);
        scroller.callWorkflow({
            process: Process.start,
            status: ProcessStatus.next
        });
    };
    return Start;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var PreFetch = /** @class */ (function () {
    function PreFetch() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var fetch = scroller.state.fetch;
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
            scroller.logger.log(function () { return "going to fetch " + fetch.count + " items started from index " + fetch.index; });
        }
        scroller.callWorkflow({
            process: Process.preFetch,
            status: scroller.state.fetch.shouldFetch ? ProcessStatus.next : ProcessStatus.done
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.setStartDelta = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, viewport = scroller.viewport;
        viewport.startDelta = 0;
        if (!buffer.hasItemSize) {
            return;
        }
        /** @type {?} */
        var minIndex = isFinite(buffer.absMinIndex) ? buffer.absMinIndex : buffer.minIndex;
        for (var index = minIndex; index < scroller.state.startIndex; index++) {
            /** @type {?} */
            var item = buffer.cache.get(index);
            viewport.startDelta += item ? item.size : buffer.averageSize;
        }
        if (scroller.settings.windowViewport) {
            viewport.startDelta += viewport.getOffset();
        }
        scroller.logger.log(function () { return "start delta is " + viewport.startDelta; });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.setFetchIndexes = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, viewport = scroller.viewport;
        /** @type {?} */
        var paddingDelta = viewport.getBufferPadding();
        /** @type {?} */
        var relativePosition = state.preFetchPosition - viewport.startDelta;
        /** @type {?} */
        var startPosition = relativePosition - paddingDelta;
        /** @type {?} */
        var endPosition = relativePosition + viewport.getSize() + paddingDelta;
        /** @type {?} */
        var firstIndexPosition = PreFetch.setFirstIndexBuffer(scroller, startPosition);
        PreFetch.setLastIndexBuffer(scroller, firstIndexPosition, endPosition);
        scroller.logger.fetch();
    };
    /**
     * @param {?} scroller
     * @param {?} startPosition
     * @return {?}
     */
    PreFetch.setFirstIndexBuffer = /**
     * @param {?} scroller
     * @param {?} startPosition
     * @return {?}
     */
    function (scroller, startPosition) {
        var state = scroller.state, buffer = scroller.buffer, fetch = scroller.state.fetch;
        /** @type {?} */
        var firstIndex = state.startIndex;
        /** @type {?} */
        var firstIndexPosition = 0;
        if (scroller.state.isInitialLoop) {
            scroller.logger.log("skipping fetch backward direction [initial loop]");
        }
        else {
            /** @type {?} */
            var inc = startPosition < 0 ? -1 : 1;
            /** @type {?} */
            var position = firstIndexPosition;
            /** @type {?} */
            var index = firstIndex;
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
    };
    /**
     * @param {?} scroller
     * @param {?} startPosition
     * @param {?} endPosition
     * @return {?}
     */
    PreFetch.setLastIndexBuffer = /**
     * @param {?} scroller
     * @param {?} startPosition
     * @param {?} endPosition
     * @return {?}
     */
    function (scroller, startPosition, endPosition) {
        var state = scroller.state, buffer = scroller.buffer, settings = scroller.settings;
        /** @type {?} */
        var lastIndex;
        if (!buffer.hasItemSize) {
            // just to fetch forward bufferSize items if neither averageItemSize nor itemSize are present
            lastIndex = state.startIndex + settings.bufferSize - 1;
            scroller.logger.log("forcing fetch forward direction [no item size]");
        }
        else {
            /** @type {?} */
            var index = (/** @type {?} */ (state.fetch.firstIndexBuffer));
            /** @type {?} */
            var position = startPosition;
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.skipBufferedItems = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        /** @type {?} */
        var buffer = scroller.buffer;
        if (!buffer.size) {
            return;
        }
        var fetch = scroller.state.fetch;
        /** @type {?} */
        var firstIndex = (/** @type {?} */ (fetch.firstIndex));
        /** @type {?} */
        var lastIndex = (/** @type {?} */ (fetch.lastIndex));
        /** @type {?} */
        var packs = [[]];
        /** @type {?} */
        var p = 0;
        for (var i = firstIndex; i <= lastIndex; i++) {
            if (!buffer.get(i)) {
                packs[p].push(i);
            }
            else if (packs[p].length) {
                packs[++p] = [];
            }
        }
        /** @type {?} */
        var pack = packs[0];
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.checkFetchPackSize = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, fetch = scroller.state.fetch;
        if (!fetch.shouldFetch) {
            return;
        }
        /** @type {?} */
        var firstIndex = (/** @type {?} */ (fetch.firstIndex));
        /** @type {?} */
        var lastIndex = (/** @type {?} */ (fetch.lastIndex));
        /** @type {?} */
        var diff = scroller.settings.bufferSize - (lastIndex - firstIndex + 1);
        if (diff <= 0) {
            return;
        }
        if (!buffer.size || lastIndex > buffer.items[0].$index) { // forward
            // forward
            /** @type {?} */
            var newLastIndex = Math.min(lastIndex + diff, buffer.absMaxIndex);
            if (newLastIndex > lastIndex) {
                fetch.lastIndex = fetch.lastIndexBuffer = newLastIndex;
            }
        }
        else {
            /** @type {?} */
            var newFirstIndex = Math.max(firstIndex - diff, buffer.absMinIndex);
            if (newFirstIndex < firstIndex) {
                fetch.firstIndex = fetch.firstIndexBuffer = newFirstIndex;
            }
        }
        if (fetch.firstIndex !== firstIndex || fetch.lastIndex !== lastIndex) {
            scroller.logger.fetch('after bufferSize adjustment');
            PreFetch.skipBufferedItems(scroller);
        }
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.setFetchDirection = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, fetch = scroller.state.fetch;
        if (fetch.lastIndex) {
            /** @type {?} */
            var direction_1 = Direction.forward;
            if (buffer.size) {
                direction_1 = fetch.lastIndex < buffer.items[0].$index ? Direction.backward : Direction.forward;
            }
            fetch.direction = direction_1;
            scroller.logger.log(function () { return "fetch direction is \"" + direction_1 + "\""; });
        }
    };
    return PreFetch;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Fetch = /** @class */ (function () {
    function Fetch() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    Fetch.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        /** @type {?} */
        var result = Fetch.get(scroller);
        if (typeof result.subscribe !== 'function') {
            if (!result.isError) {
                Fetch.success(result.data, scroller);
            }
            else {
                Fetch.fail(result.error, scroller);
            }
        }
        else {
            scroller.innerLoopSubscriptions.push(result.subscribe(function (data) { return Fetch.success(data, scroller); }, function (error) { return Fetch.fail(error, scroller); }));
        }
    };
    /**
     * @param {?} data
     * @param {?} scroller
     * @return {?}
     */
    Fetch.success = /**
     * @param {?} data
     * @param {?} scroller
     * @return {?}
     */
    function (data, scroller) {
        scroller.logger.log(function () { return "resolved " + data.length + " items " +
            ("(index = " + scroller.state.fetch.index + ", count = " + scroller.state.fetch.count + ")"); });
        scroller.state.fetch.newItemsData = data;
        scroller.callWorkflow({
            process: Process.fetch,
            status: ProcessStatus.next
        });
    };
    /**
     * @param {?} error
     * @param {?} scroller
     * @return {?}
     */
    Fetch.fail = /**
     * @param {?} error
     * @param {?} scroller
     * @return {?}
     */
    function (error, scroller) {
        scroller.callWorkflow({
            process: Process.fetch,
            status: ProcessStatus.error,
            payload: { error: error }
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Fetch.get = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        /** @type {?} */
        var _get = (/** @type {?} */ (scroller.datasource.get));
        /** @type {?} */
        var immediateData;
        /** @type {?} */
        var immediateError;
        /** @type {?} */
        var observer;
        /** @type {?} */
        var success = function (data) {
            if (!observer) {
                immediateData = data || null;
                return;
            }
            observer.next(data);
            observer.complete();
        };
        /** @type {?} */
        var reject = function (error) {
            if (!observer) {
                immediateError = error || null;
                return;
            }
            observer.error(error);
        };
        /** @type {?} */
        var result = _get(scroller.state.fetch.index, scroller.state.fetch.count, success, reject);
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
        return Observable.create(function (_observer) {
            observer = _observer;
        });
    };
    return Fetch;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Item = /** @class */ (function () {
    function Item($index, data, routines) {
        this.$index = $index;
        this.data = data;
        this.nodeId = String($index);
        this.routines = routines;
        this.invisible = true;
    }
    /**
     * @return {?}
     */
    Item.prototype.setSize = /**
     * @return {?}
     */
    function () {
        this.size = this.routines.getSize(this.element);
    };
    /**
     * @return {?}
     */
    Item.prototype.hide = /**
     * @return {?}
     */
    function () {
        if (this.element) {
            this.routines.hideElement(this.element);
        }
    };
    return Item;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var PostFetch = /** @class */ (function () {
    function PostFetch() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    PostFetch.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PostFetch.setBufferLimits = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, _a = scroller.state.fetch, firstIndex = _a.firstIndex, lastIndex = _a.lastIndex, items = _a.items;
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
            var last = items.length - 1;
            if ((/** @type {?} */ (firstIndex)) < items[0].$index) {
                buffer.absMinIndex = items[0].$index;
            }
            if ((/** @type {?} */ (lastIndex)) > items[last].$index) {
                buffer.absMaxIndex = items[last].$index;
            }
        }
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PostFetch.setItems = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, fetch = scroller.state.fetch;
        /** @type {?} */
        var items = fetch.newItemsData;
        if (!items || !items.length) { // empty result
            return true;
        }
        // eof/bof case, need to shift fetch index if bof
        /** @type {?} */
        var fetchIndex = (/** @type {?} */ (fetch.index));
        if (items.length < fetch.count) {
            if (scroller.state.isInitialLoop) {
                // let's treat initial poor fetch as startIndex-bof
                fetchIndex = scroller.state.startIndex;
            }
            else if ((/** @type {?} */ (fetch.firstIndex)) < buffer.minIndex) { // normal bof
                fetchIndex = buffer.minIndex - items.length;
            }
        }
        fetch.items = items.map(function (item, index) {
            return new Item(fetchIndex + index, item, scroller.routines);
        });
        fetch.isPrepend = !!buffer.items.length && buffer.items[0].$index > fetch.items[fetch.items.length - 1].$index;
        return buffer.setItems(fetch.items);
    };
    return PostFetch;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Render = /** @class */ (function () {
    function Render() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    Render.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        scroller.logger.stat('before new items render');
        scroller.innerLoopSubscriptions.push(scroller.bindData().subscribe(function () {
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Render.processElements = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, _a = scroller.state, fetch = _a.fetch, items = _a.fetch.items, viewport = scroller.viewport, buffer = scroller.buffer;
        /** @type {?} */
        var itemsLength = items.length;
        /** @type {?} */
        var scrollBeforeRender = scroller.settings.windowViewport ? scroller.viewport.scrollPosition : 0;
        state.sizeBeforeRender = viewport.getScrollableSize();
        state.fwdPaddingBeforeRender = viewport.paddings.forward.size;
        for (var j = 0; j < itemsLength; j++) {
            /** @type {?} */
            var item = items[j];
            /** @type {?} */
            var element = viewport.element.querySelector("[data-sid=\"" + item.nodeId + "\"]");
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
    };
    /**
     * @param {?} scroller
     * @param {?} scrollBeforeRender
     * @return {?}
     */
    Render.processWindowScrollBackJump = /**
     * @param {?} scroller
     * @param {?} scrollBeforeRender
     * @return {?}
     */
    function (scroller, scrollBeforeRender) {
        var state = scroller.state, window = scroller.state.scrollState.window, viewport = scroller.viewport;
        // if new items have been rendered in the area that is before current scroll position
        // then this position will be updated silently in case of entire window scrollable
        // so we need to remember the delta and to update scroll position manually right after it is changed silently
        /** @type {?} */
        var inc = scrollBeforeRender >= viewport.paddings.backward.size ? 1 : -1;
        /** @type {?} */
        var delta = inc * Math.abs(viewport.getScrollableSize() - state.sizeBeforeRender);
        /** @type {?} */
        var positionToUpdate = scrollBeforeRender - delta;
        if (delta && positionToUpdate > 0) {
            window.positionToUpdate = positionToUpdate;
            window.delta = delta;
            scroller.logger.log(function () {
                /** @type {?} */
                var token = delta < 0 ? 'reduced' : 'increased';
                return ["next scroll position (if " + positionToUpdate + ") should be " + token + " by", Math.abs(delta)];
            });
        }
    };
    return Render;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Adjust = /** @class */ (function () {
    function Adjust() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    Adjust.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        scroller.state.preAdjustPosition = scroller.viewport.scrollPosition;
        // padding-elements adjustments
        /** @type {?} */
        var setPaddingsResult = Adjust.setPaddings(scroller);
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Adjust.setPaddings = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var viewport = scroller.viewport, buffer = scroller.buffer, fetch = scroller.state.fetch;
        /** @type {?} */
        var firstItem = buffer.getFirstVisibleItem();
        /** @type {?} */
        var lastItem = buffer.getLastVisibleItem();
        if (!firstItem || !lastItem) {
            return false;
        }
        /** @type {?} */
        var forwardPadding = viewport.paddings.forward;
        /** @type {?} */
        var backwardPadding = viewport.paddings.backward;
        /** @type {?} */
        var firstIndex = firstItem.$index;
        /** @type {?} */
        var lastIndex = lastItem.$index;
        /** @type {?} */
        var minIndex = isFinite(buffer.absMinIndex) ? buffer.absMinIndex : buffer.minIndex;
        /** @type {?} */
        var maxIndex = isFinite(buffer.absMaxIndex) ? buffer.absMaxIndex : buffer.maxIndex;
        /** @type {?} */
        var hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        var index;
        /** @type {?} */
        var bwdSize = 0;
        /** @type {?} */
        var fwdSize = 0;
        /** @type {?} */
        var bwdPaddingAverageSizeItemsCount = 0;
        // new backward padding
        for (index = minIndex; index < firstIndex; index++) {
            /** @type {?} */
            var item = buffer.cache.get(index);
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
            var item = buffer.cache.get(index);
            fwdSize += item ? item.size : buffer.cache.averageSize;
        }
        /** @type {?} */
        var fwdPaddingDiff = forwardPadding.size - fwdSize;
        /** @type {?} */
        var viewportSizeDiff = viewport.getSize() - viewport.getScrollableSize() + fwdPaddingDiff;
        if (viewportSizeDiff > 0) {
            fwdSize += viewportSizeDiff;
            scroller.logger.log("forward padding will be increased by " + viewportSizeDiff + " to fill the viewport");
        }
        forwardPadding.size = fwdSize;
        backwardPadding.size = bwdSize;
        scroller.logger.stat('after paddings adjustments');
        return bwdPaddingAverageSizeItemsCount;
    };
    /**
     * @param {?} scroller
     * @param {?} bwdPaddingAverageSizeItemsCount
     * @return {?}
     */
    Adjust.fixScrollPosition = /**
     * @param {?} scroller
     * @param {?} bwdPaddingAverageSizeItemsCount
     * @return {?}
     */
    function (scroller, bwdPaddingAverageSizeItemsCount) {
        var viewport = scroller.viewport, buffer = scroller.buffer, state = scroller.state, _a = scroller.state, fetch = _a.fetch, _b = _a.fetch, items = _b.items, negativeSize = _b.negativeSize;
        if (scroller.settings.windowViewport) {
            /** @type {?} */
            var newPosition_1 = viewport.scrollPosition;
            /** @type {?} */
            var posDiff_1 = state.preAdjustPosition - newPosition_1;
            if (posDiff_1) {
                /** @type {?} */
                var winState = state.scrollState.window;
                if (newPosition_1 === winState.positionToUpdate) {
                    winState.reset();
                    state.syntheticScroll.readyToReset = false;
                    scroller.logger.log(function () { return "process window scroll preventive: sum(" + newPosition_1 + ", " + posDiff_1 + ")"; });
                    Adjust.setScroll(scroller, posDiff_1);
                    scroller.logger.stat('after scroll position adjustment (window)');
                    return;
                }
            }
        }
        // if backward padding has been changed due to average item size change
        /** @type {?} */
        var hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        var bwdAverageItemsCountDiff = state.bwdPaddingAverageSizeItemsCount - bwdPaddingAverageSizeItemsCount;
        /** @type {?} */
        var hasBwdParamsChanged = bwdPaddingAverageSizeItemsCount > 0 || bwdAverageItemsCountDiff > 0;
        if (hasAverageItemSizeChanged && hasBwdParamsChanged) {
            /** @type {?} */
            var _bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * buffer.averageSize;
            /** @type {?} */
            var bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * fetch.averageItemSize;
            /** @type {?} */
            var bwdPaddingAverageSizeDiff = _bwdPaddingAverageSize - bwdPaddingAverageSize;
            /** @type {?} */
            var bwdAverageItemsSizeDiff = bwdAverageItemsCountDiff * fetch.averageItemSize;
            /** @type {?} */
            var positionDiff = bwdPaddingAverageSizeDiff - bwdAverageItemsSizeDiff;
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
    };
    /**
     * @param {?} scroller
     * @param {?} delta
     * @return {?}
     */
    Adjust.setScroll = /**
     * @param {?} scroller
     * @param {?} delta
     * @return {?}
     */
    function (scroller, delta) {
        var viewport = scroller.viewport;
        /** @type {?} */
        var forwardPadding = viewport.paddings[Direction.forward];
        /** @type {?} */
        var oldPosition = viewport.scrollPosition;
        /** @type {?} */
        var newPosition = Math.round(oldPosition + delta);
        for (var i = 0; i < Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT; i++) {
            viewport.scrollPosition = newPosition;
            /** @type {?} */
            var positionDiff = newPosition - viewport.scrollPosition;
            if (positionDiff > 0) {
                forwardPadding.size += positionDiff;
            }
            else {
                break;
            }
        }
    };
    Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT = 10;
    return Adjust;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Clip = /** @class */ (function () {
    function Clip() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    Clip.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        Clip.prepareClip(scroller);
        if (scroller.state.clip) {
            Clip.doClip(scroller);
        }
        scroller.callWorkflow({
            process: Process.clip,
            status: ProcessStatus.next
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Clip.prepareClip = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, state = scroller.state, _a = scroller.state, fetch = _a.fetch, direction = _a.fetch.direction;
        if (!buffer.size) {
            return;
        }
        if (state.isInitialWorkflowCycle && !state.scrollState.scroll) {
            scroller.logger.log("skipping clip [initial cycle, no scroll]");
            return;
        }
        /** @type {?} */
        var firstIndex = (/** @type {?} */ (fetch.firstIndexBuffer));
        /** @type {?} */
        var lastIndex = (/** @type {?} */ (fetch.lastIndexBuffer));
        scroller.logger.log(function () {
            return "looking for " + (direction ? 'anti-' + direction + ' ' : '') + "items " +
                ("that are out of [" + firstIndex + ".." + lastIndex + "] range");
        });
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
    };
    /**
     * @param {?} scroller
     * @param {?} direction
     * @param {?} edgeIndex
     * @return {?}
     */
    Clip.prepareClipByDirection = /**
     * @param {?} scroller
     * @param {?} direction
     * @param {?} edgeIndex
     * @return {?}
     */
    function (scroller, direction, edgeIndex) {
        /** @type {?} */
        var forward = direction === Direction.forward;
        scroller.buffer.items.forEach(function (item) {
            if ((forward && item.$index < edgeIndex) ||
                (!forward && item.$index > edgeIndex)) {
                item.toRemove = true;
                item.removeDirection = direction;
                scroller.state.clip = true;
            }
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Clip.doClip = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, paddings = scroller.viewport.paddings, logger = scroller.logger;
        /** @type {?} */
        var clipped = [];
        /** @type {?} */
        var size = { backward: 0, forward: 0 };
        scroller.state.clipCall++;
        logger.stat("before clip (" + scroller.state.clipCall + ")");
        buffer.items = buffer.items.filter(function (item) {
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
        logger.log(function () { return [
            "clipped " + clipped.length + " items" +
                (size.backward ? ", +" + size.backward + " fwd px," : '') +
                (size.forward ? ", +" + size.forward + " bwd px," : ''),
            "range: [" + clipped[0] + ".." + clipped[clipped.length - 1] + "]"
        ]; });
        logger.stat('after clip');
    };
    return Clip;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var End = /** @class */ (function () {
    function End() {
    }
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    End.run = /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    function (scroller, error) {
        // finalize current workflow loop
        End.endWorkflowLoop(scroller);
        // set out params, accessible via Adapter
        End.calculateParams(scroller);
        // what next? done?
        /** @type {?} */
        var next = End.getNext(scroller, error);
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    End.endWorkflowLoop = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state;
        state.endLoop();
        state.lastPosition = scroller.viewport.scrollPosition;
        scroller.purgeInnerLoopSubscriptions();
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    End.calculateParams = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var items = scroller.buffer.items;
        // first visible item
        if (scroller.state.firstVisibleWanted) {
            /** @type {?} */
            var viewportBackwardEdge_1 = scroller.viewport.getEdge(Direction.backward);
            /** @type {?} */
            var firstItem = items.find(function (item) {
                return scroller.viewport.getElementEdge(item.element, Direction.forward) > viewportBackwardEdge_1;
            });
            scroller.state.firstVisibleItem = firstItem ? {
                $index: firstItem.$index,
                data: firstItem.data,
                element: firstItem.element
            } : itemAdapterEmpty;
        }
        // last visible item
        if (scroller.state.lastVisibleWanted) {
            /** @type {?} */
            var viewportForwardEdge = scroller.viewport.getEdge(Direction.forward);
            /** @type {?} */
            var lastItem = null;
            for (var i = items.length - 1; i >= 0; i--) {
                /** @type {?} */
                var edge = scroller.viewport.getElementEdge(items[i].element, Direction.backward);
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
    };
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    End.getNext = /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    function (scroller, error) {
        var _a = scroller.state, fetch = _a.fetch, scrollState = _a.scrollState;
        /** @type {?} */
        var next = null;
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    End.continueWorkflowByTimer = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, _a = scroller.state, workflowCycleCount = _a.workflowCycleCount, innerLoopCount = _a.innerLoopCount;
        scroller.logger.log(function () { return "setting Workflow timer (" + workflowCycleCount + "-" + innerLoopCount + ")"; });
        state.scrollState.workflowTimer = (/** @type {?} */ (setTimeout(function () {
            // if the WF isn't finilized while the old sub-cycle is done and there's no new sub-cycle
            if (state.workflowPending && !state.loopPending && innerLoopCount === state.innerLoopCount) {
                scroller.callWorkflow({
                    process: Process.end,
                    status: ProcessStatus.next,
                    payload: { scroll: true, byTimer: true }
                });
            }
        }, scroller.settings.throttle)));
    };
    return End;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Workflow = /** @class */ (function () {
    function Workflow(context) {
        var _this = this;
        this.context = context;
        this.scroller = new Scroller(this.context, this.callWorkflow.bind(this));
        this.process$ = new BehaviorSubject((/** @type {?} */ ({
            process: Process.init,
            status: ProcessStatus.start
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var UiScrollComponent = /** @class */ (function () {
    function UiScrollComponent(changeDetector, elementRef) {
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
    }
    /**
     * @return {?}
     */
    UiScrollComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.workflow = new Workflow(this);
    };
    /**
     * @return {?}
     */
    UiScrollComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.workflow.dispose();
    };
    UiScrollComponent.decorators = [
        { type: Component, args: [{
                    selector: '[ui-scroll]',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "<div data-padding-backward></div><div\n  *ngFor=\"let item of items\"\n  [attr.data-sid]=\"item.nodeId\"\n  [style.position]=\"item.invisible ? 'fixed' : null\"\n  [style.left]=\"item.invisible ? '-99999px' : null\"\n><ng-template\n  [ngTemplateOutlet]=\"template\"\n  [ngTemplateOutletContext]=\"{\n    $implicit: item.data,\n    index: item.$index,\n    odd: item.$index % 2,\n    even: !(item.$index % 2)\n }\"\n></ng-template></div><div data-padding-forward></div>"
                }] }
    ];
    /** @nocollapse */
    UiScrollComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef }
    ]; };
    return UiScrollComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var version = '1.0.1';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var UiScrollDirective = /** @class */ (function () {
    function UiScrollDirective(templateRef, viewContainer, resolver) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    Object.defineProperty(UiScrollDirective.prototype, "uiScrollOf", {
        set: /**
         * @param {?} datasource
         * @return {?}
         */
        function (datasource) {
            this.datasource = datasource;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    UiScrollDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var templateView = this.templateRef.createEmbeddedView({});
        /** @type {?} */
        var compFactory = this.resolver.resolveComponentFactory(UiScrollComponent);
        /** @type {?} */
        var componentRef = this.viewContainer.createComponent(compFactory, undefined, this.viewContainer.injector, [templateView.rootNodes]);
        componentRef.instance.datasource = this.datasource;
        componentRef.instance.template = this.templateRef;
        componentRef.instance.version = version;
    };
    UiScrollDirective.decorators = [
        { type: Directive, args: [{ selector: '[uiScroll][uiScrollOf]' },] }
    ];
    /** @nocollapse */
    UiScrollDirective.ctorParameters = function () { return [
        { type: TemplateRef },
        { type: ViewContainerRef },
        { type: ComponentFactoryResolver }
    ]; };
    UiScrollDirective.propDecorators = {
        uiScrollOf: [{ type: Input }]
    };
    return UiScrollDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var UiScrollModule = /** @class */ (function () {
    function UiScrollModule() {
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
    return UiScrollModule;
}());

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
