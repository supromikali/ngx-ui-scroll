/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Observable } from 'rxjs';
import { Process, ProcessStatus } from '../interfaces/index';
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
export default Fetch;
//# sourceMappingURL=fetch.js.map