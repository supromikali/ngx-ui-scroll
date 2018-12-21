/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus as Status } from '../interfaces/index';
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
        var styles = [status === Status.error ? 'color: #cc0000;' : '', 'color: #000000;'];
        this.log(function () { return [processLog].concat(styles, (!payload.empty ? [payload] : [])); });
        // inner loop start-end log
        /** @type {?} */
        var workflowCycleData = this.getWorkflowCycleData(true);
        /** @type {?} */
        var loopCount = this.getInnerLoopCount();
        /** @type {?} */
        var loopLog = [];
        if (process === Process.init && status === Status.next ||
            process === Process.scroll && status === Status.next && payload.keepScroll ||
            process === Process.end && status === Status.next && payload.byTimer) {
            loopLog.push("%c---=== loop " + (workflowCycleData + (loopCount + 1)) + " start");
        }
        else if (process === Process.end && !payload.byTimer) {
            loopLog.push("%c---=== loop " + (workflowCycleData + loopCount) + " done");
            if (status === Status.next && !(payload.keepScroll)) {
                loopLog[0] += ", loop " + (workflowCycleData + (loopCount + 1)) + " start";
            }
        }
        if (loopLog.length) {
            this.log(function () { return loopLog.concat(['color: #006600;']); });
        }
        // workflow cycle start log
        if (process === Process.init && status === Status.start ||
            process === Process.reload && status === Status.next ||
            process === Process.scroll && status === Status.next && !(payload.keepScroll)) {
            /** @type {?} */
            var logData_1 = this.getWorkflowCycleData(false);
            /** @type {?} */
            var logStyles_3 = 'color: #0000aa; border: solid black 1px; border-width: 1px 0 0 1px; margin-left: -2px';
            this.log(function () { return ["%c   ~~~ WF Cycle " + logData_1 + " STARTED ~~~  ", logStyles_3]; });
        }
        // workflow run end log
        if (process === Process.end && status === Status.done) {
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
export { Logger };
if (false) {
    /** @type {?} */
    Logger.prototype.debug;
    /** @type {?} */
    Logger.prototype.immediateLog;
    /** @type {?} */
    Logger.prototype.logTime;
    /** @type {?} */
    Logger.prototype.getTime;
    /** @type {?} */
    Logger.prototype.getStat;
    /** @type {?} */
    Logger.prototype.getFetchRange;
    /** @type {?} */
    Logger.prototype.getInnerLoopCount;
    /** @type {?} */
    Logger.prototype.getWorkflowCycleData;
    /** @type {?} */
    Logger.prototype.logs;
}
//# sourceMappingURL=logger.js.map