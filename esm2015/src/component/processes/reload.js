/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
export default class Reload {
    /**
     * @param {?} scroller
     * @param {?} reloadIndex
     * @return {?}
     */
    static run(scroller, reloadIndex) {
        /** @type {?} */
        const scrollPosition = scroller.viewport.scrollPosition;
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
    }
}
//# sourceMappingURL=reload.js.map