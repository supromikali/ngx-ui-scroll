/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Observable } from 'rxjs';
import { Process, ProcessStatus } from '../interfaces/index';
export default class Fetch {
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
//# sourceMappingURL=fetch.js.map