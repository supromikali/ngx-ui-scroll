/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Observable } from 'rxjs';
import { checkDatasource } from './utils/index';
import { Datasource } from './classes/datasource';
import { Settings } from './classes/settings';
import { Logger } from './classes/logger';
import { Routines } from './classes/domRoutines';
import { Viewport } from './classes/viewport';
import { Buffer } from './classes/buffer';
import { State } from './classes/state';
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
export { Scroller };
if (false) {
    /** @type {?} */
    Scroller.prototype.runChangeDetector;
    /** @type {?} */
    Scroller.prototype.callWorkflow;
    /** @type {?} */
    Scroller.prototype.version;
    /** @type {?} */
    Scroller.prototype.datasource;
    /** @type {?} */
    Scroller.prototype.settings;
    /** @type {?} */
    Scroller.prototype.logger;
    /** @type {?} */
    Scroller.prototype.routines;
    /** @type {?} */
    Scroller.prototype.viewport;
    /** @type {?} */
    Scroller.prototype.buffer;
    /** @type {?} */
    Scroller.prototype.state;
    /** @type {?} */
    Scroller.prototype.innerLoopSubscriptions;
}
//# sourceMappingURL=scroller.js.map