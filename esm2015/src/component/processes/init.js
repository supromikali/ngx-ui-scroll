/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
export default class Init {
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
//# sourceMappingURL=init.js.map