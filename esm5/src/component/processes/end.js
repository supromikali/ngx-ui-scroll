/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus, Direction } from '../interfaces/index';
import { itemAdapterEmpty } from '../classes/adapter';
var End = /** @class */ (function () {
    function End() {
    }
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    End.run = /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    function (scroller, error) {
        // finalize current workflow loop
        End.endWorkflowLoop(scroller);
        // set out params, accessible via Adapter
        End.calculateParams(scroller);
        // what next? done?
        /** @type {?} */
        var next = End.getNext(scroller, error);
        // need to apply Buffer.items changes if clip
        if (scroller.state.clip) {
            scroller.runChangeDetector();
        }
        // stub method call
        scroller.finalize();
        // continue the Workflow synchronously; current cycle could be finilized immediately
        scroller.callWorkflow({
            process: Process.end,
            status: next ? ProcessStatus.next : ProcessStatus.done,
            payload: next || { empty: true }
        });
        // if the Workflow isn't finilized, it may freeze for no more than settings.throttle ms
        if (scroller.state.workflowPending && !scroller.state.loopPending) {
            // continue the Workflow asynchronously
            End.continueWorkflowByTimer(scroller);
        }
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    End.endWorkflowLoop = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state;
        state.endLoop();
        state.lastPosition = scroller.viewport.scrollPosition;
        scroller.purgeInnerLoopSubscriptions();
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    End.calculateParams = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var items = scroller.buffer.items;
        // first visible item
        if (scroller.state.firstVisibleWanted) {
            /** @type {?} */
            var viewportBackwardEdge_1 = scroller.viewport.getEdge(Direction.backward);
            /** @type {?} */
            var firstItem = items.find(function (item) {
                return scroller.viewport.getElementEdge(item.element, Direction.forward) > viewportBackwardEdge_1;
            });
            scroller.state.firstVisibleItem = firstItem ? {
                $index: firstItem.$index,
                data: firstItem.data,
                element: firstItem.element
            } : itemAdapterEmpty;
        }
        // last visible item
        if (scroller.state.lastVisibleWanted) {
            /** @type {?} */
            var viewportForwardEdge = scroller.viewport.getEdge(Direction.forward);
            /** @type {?} */
            var lastItem = null;
            for (var i = items.length - 1; i >= 0; i--) {
                /** @type {?} */
                var edge = scroller.viewport.getElementEdge(items[i].element, Direction.backward);
                if (edge < viewportForwardEdge) {
                    lastItem = items[i];
                    break;
                }
            }
            scroller.state.lastVisibleItem = lastItem ? {
                $index: lastItem.$index,
                data: lastItem.data,
                element: lastItem.element
            } : itemAdapterEmpty;
        }
    };
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    End.getNext = /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    function (scroller, error) {
        var _a = scroller.state, fetch = _a.fetch, scrollState = _a.scrollState;
        /** @type {?} */
        var next = null;
        if (!error) {
            if (fetch.hasNewItems) {
                next = { scroll: false };
            }
            else if (fetch.hasAnotherPack) {
                next = { scroll: false };
            }
            if (scrollState.keepScroll) {
                next = { scroll: true, keepScroll: true };
            }
        }
        return next;
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    End.continueWorkflowByTimer = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, _a = scroller.state, workflowCycleCount = _a.workflowCycleCount, innerLoopCount = _a.innerLoopCount;
        scroller.logger.log(function () { return "setting Workflow timer (" + workflowCycleCount + "-" + innerLoopCount + ")"; });
        state.scrollState.workflowTimer = (/** @type {?} */ (setTimeout(function () {
            // if the WF isn't finilized while the old sub-cycle is done and there's no new sub-cycle
            if (state.workflowPending && !state.loopPending && innerLoopCount === state.innerLoopCount) {
                scroller.callWorkflow({
                    process: Process.end,
                    status: ProcessStatus.next,
                    payload: { scroll: true, byTimer: true }
                });
            }
        }, scroller.settings.throttle)));
    };
    return End;
}());
export default End;
//# sourceMappingURL=end.js.map