/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
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
export default Reload;
//# sourceMappingURL=reload.js.map