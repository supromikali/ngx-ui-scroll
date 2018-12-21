/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
export default class Start {
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
//# sourceMappingURL=start.js.map