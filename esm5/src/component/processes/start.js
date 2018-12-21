/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
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
export default Start;
//# sourceMappingURL=start.js.map