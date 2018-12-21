/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
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
export default Init;
//# sourceMappingURL=init.js.map