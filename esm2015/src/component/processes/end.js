/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus, Direction } from '../interfaces/index';
import { itemAdapterEmpty } from '../classes/adapter';
export default class End {
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    static run(scroller, error) {
        // finalize current workflow loop
        End.endWorkflowLoop(scroller);
        // set out params, accessible via Adapter
        End.calculateParams(scroller);
        // what next? done?
        /** @type {?} */
        const next = End.getNext(scroller, error);
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
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static endWorkflowLoop(scroller) {
        const { state } = scroller;
        state.endLoop();
        state.lastPosition = scroller.viewport.scrollPosition;
        scroller.purgeInnerLoopSubscriptions();
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static calculateParams(scroller) {
        const { items } = scroller.buffer;
        // first visible item
        if (scroller.state.firstVisibleWanted) {
            /** @type {?} */
            const viewportBackwardEdge = scroller.viewport.getEdge(Direction.backward);
            /** @type {?} */
            const firstItem = items.find(item => scroller.viewport.getElementEdge(item.element, Direction.forward) > viewportBackwardEdge);
            scroller.state.firstVisibleItem = firstItem ? {
                $index: firstItem.$index,
                data: firstItem.data,
                element: firstItem.element
            } : itemAdapterEmpty;
        }
        // last visible item
        if (scroller.state.lastVisibleWanted) {
            /** @type {?} */
            const viewportForwardEdge = scroller.viewport.getEdge(Direction.forward);
            /** @type {?} */
            let lastItem = null;
            for (let i = items.length - 1; i >= 0; i--) {
                /** @type {?} */
                const edge = scroller.viewport.getElementEdge(items[i].element, Direction.backward);
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
    }
    /**
     * @param {?} scroller
     * @param {?=} error
     * @return {?}
     */
    static getNext(scroller, error) {
        const { state: { fetch, scrollState } } = scroller;
        /** @type {?} */
        let next = null;
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
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static continueWorkflowByTimer(scroller) {
        const { state, state: { workflowCycleCount, innerLoopCount } } = scroller;
        scroller.logger.log(() => `setting Workflow timer (${workflowCycleCount}-${innerLoopCount})`);
        state.scrollState.workflowTimer = (/** @type {?} */ (setTimeout(() => {
            // if the WF isn't finilized while the old sub-cycle is done and there's no new sub-cycle
            if (state.workflowPending && !state.loopPending && innerLoopCount === state.innerLoopCount) {
                scroller.callWorkflow({
                    process: Process.end,
                    status: ProcessStatus.next,
                    payload: { scroll: true, byTimer: true }
                });
            }
        }, scroller.settings.throttle)));
    }
}
//# sourceMappingURL=end.js.map