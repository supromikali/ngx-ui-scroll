/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus as Status } from '../interfaces/index';
export class Logger {
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
        const styles = [status === Status.error ? 'color: #cc0000;' : '', 'color: #000000;'];
        this.log(() => [processLog, ...styles, ...(!payload.empty ? [payload] : [])]);
        // inner loop start-end log
        /** @type {?} */
        const workflowCycleData = this.getWorkflowCycleData(true);
        /** @type {?} */
        const loopCount = this.getInnerLoopCount();
        /** @type {?} */
        const loopLog = [];
        if (process === Process.init && status === Status.next ||
            process === Process.scroll && status === Status.next && payload.keepScroll ||
            process === Process.end && status === Status.next && payload.byTimer) {
            loopLog.push(`%c---=== loop ${workflowCycleData + (loopCount + 1)} start`);
        }
        else if (process === Process.end && !payload.byTimer) {
            loopLog.push(`%c---=== loop ${workflowCycleData + loopCount} done`);
            if (status === Status.next && !(payload.keepScroll)) {
                loopLog[0] += `, loop ${workflowCycleData + (loopCount + 1)} start`;
            }
        }
        if (loopLog.length) {
            this.log(() => [...loopLog, 'color: #006600;']);
        }
        // workflow cycle start log
        if (process === Process.init && status === Status.start ||
            process === Process.reload && status === Status.next ||
            process === Process.scroll && status === Status.next && !(payload.keepScroll)) {
            /** @type {?} */
            const logData = this.getWorkflowCycleData(false);
            /** @type {?} */
            const logStyles = 'color: #0000aa; border: solid black 1px; border-width: 1px 0 0 1px; margin-left: -2px';
            this.log(() => [`%c   ~~~ WF Cycle ${logData} STARTED ~~~  `, logStyles]);
        }
        // workflow run end log
        if (process === Process.end && status === Status.done) {
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