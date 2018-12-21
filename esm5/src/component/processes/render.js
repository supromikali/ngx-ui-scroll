/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus } from '../interfaces/index';
var Render = /** @class */ (function () {
    function Render() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    Render.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        scroller.logger.stat('before new items render');
        scroller.innerLoopSubscriptions.push(scroller.bindData().subscribe(function () {
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
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Render.processElements = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, _a = scroller.state, fetch = _a.fetch, items = _a.fetch.items, viewport = scroller.viewport, buffer = scroller.buffer;
        /** @type {?} */
        var itemsLength = items.length;
        /** @type {?} */
        var scrollBeforeRender = scroller.settings.windowViewport ? scroller.viewport.scrollPosition : 0;
        state.sizeBeforeRender = viewport.getScrollableSize();
        state.fwdPaddingBeforeRender = viewport.paddings.forward.size;
        for (var j = 0; j < itemsLength; j++) {
            /** @type {?} */
            var item = items[j];
            /** @type {?} */
            var element = viewport.element.querySelector("[data-sid=\"" + item.nodeId + "\"]");
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
    };
    /**
     * @param {?} scroller
     * @param {?} scrollBeforeRender
     * @return {?}
     */
    Render.processWindowScrollBackJump = /**
     * @param {?} scroller
     * @param {?} scrollBeforeRender
     * @return {?}
     */
    function (scroller, scrollBeforeRender) {
        var state = scroller.state, window = scroller.state.scrollState.window, viewport = scroller.viewport;
        // if new items have been rendered in the area that is before current scroll position
        // then this position will be updated silently in case of entire window scrollable
        // so we need to remember the delta and to update scroll position manually right after it is changed silently
        /** @type {?} */
        var inc = scrollBeforeRender >= viewport.paddings.backward.size ? 1 : -1;
        /** @type {?} */
        var delta = inc * Math.abs(viewport.getScrollableSize() - state.sizeBeforeRender);
        /** @type {?} */
        var positionToUpdate = scrollBeforeRender - delta;
        if (delta && positionToUpdate > 0) {
            window.positionToUpdate = positionToUpdate;
            window.delta = delta;
            scroller.logger.log(function () {
                /** @type {?} */
                var token = delta < 0 ? 'reduced' : 'increased';
                return ["next scroll position (if " + positionToUpdate + ") should be " + token + " by", Math.abs(delta)];
            });
        }
    };
    return Render;
}());
export default Render;
//# sourceMappingURL=render.js.map