/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
export default class Render {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        scroller.logger.stat('before new items render');
        scroller.innerLoopSubscriptions.push(scroller.bindData().subscribe(() => {
            if (Render.processElements(scroller)) {
                scroller.callWorkflow({
                    process: Process.render,
                    status: ProcessStatus.next
                });
            }
            else {
                scroller.callWorkflow({
                    process: Process.render,
                    status: ProcessStatus.error,
                    payload: { error: 'Can\'t associate item with element' }
                });
            }
        }));
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static processElements(scroller) {
        const { state, state: { fetch, fetch: { items } }, viewport, buffer } = scroller;
        /** @type {?} */
        const itemsLength = items.length;
        /** @type {?} */
        const scrollBeforeRender = scroller.settings.windowViewport ? scroller.viewport.scrollPosition : 0;
        state.sizeBeforeRender = viewport.getScrollableSize();
        state.fwdPaddingBeforeRender = viewport.paddings.forward.size;
        for (let j = 0; j < itemsLength; j++) {
            /** @type {?} */
            const item = items[j];
            /** @type {?} */
            const element = viewport.element.querySelector(`[data-sid="${item.nodeId}"]`);
            if (!element) {
                return false;
            }
            item.element = (/** @type {?} */ (element));
            item.element.style.left = '';
            item.element.style.position = '';
            item.invisible = false;
            item.setSize();
            buffer.cache.add(item);
            if (item.$index < fetch.minIndex) {
                fetch.negativeSize += item.size;
            }
        }
        buffer.checkAverageSize();
        if (scroller.settings.windowViewport && fetch.isPrepend) {
            Render.processWindowScrollBackJump(scroller, scrollBeforeRender);
        }
        scroller.logger.stat('after new items render');
        return true;
    }
    /**
     * @param {?} scroller
     * @param {?} scrollBeforeRender
     * @return {?}
     */
    static processWindowScrollBackJump(scroller, scrollBeforeRender) {
        const { state, state: { scrollState: { window } }, viewport } = scroller;
        // if new items have been rendered in the area that is before current scroll position
        // then this position will be updated silently in case of entire window scrollable
        // so we need to remember the delta and to update scroll position manually right after it is changed silently
        /** @type {?} */
        const inc = scrollBeforeRender >= viewport.paddings.backward.size ? 1 : -1;
        /** @type {?} */
        const delta = inc * Math.abs(viewport.getScrollableSize() - state.sizeBeforeRender);
        /** @type {?} */
        const positionToUpdate = scrollBeforeRender - delta;
        if (delta && positionToUpdate > 0) {
            window.positionToUpdate = positionToUpdate;
            window.delta = delta;
            scroller.logger.log(() => {
                /** @type {?} */
                const token = delta < 0 ? 'reduced' : 'increased';
                return [`next scroll position (if ${positionToUpdate}) should be ${token} by`, Math.abs(delta)];
            });
        }
    }
}
//# sourceMappingURL=render.js.map