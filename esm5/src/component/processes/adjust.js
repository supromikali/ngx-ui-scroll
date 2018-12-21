/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Direction, Process, ProcessStatus } from '../interfaces/index';
var Adjust = /** @class */ (function () {
    function Adjust() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    Adjust.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        scroller.state.preAdjustPosition = scroller.viewport.scrollPosition;
        // padding-elements adjustments
        /** @type {?} */
        var setPaddingsResult = Adjust.setPaddings(scroller);
        if (setPaddingsResult === false) {
            scroller.callWorkflow({
                process: Process.adjust,
                status: ProcessStatus.error,
                payload: { error: 'Can\'t get visible item' }
            });
            return;
        }
        // scroll position adjustments
        Adjust.fixScrollPosition(scroller, (/** @type {?} */ (setPaddingsResult)));
        scroller.callWorkflow({
            process: Process.adjust,
            status: ProcessStatus.done
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Adjust.setPaddings = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var viewport = scroller.viewport, buffer = scroller.buffer, fetch = scroller.state.fetch;
        /** @type {?} */
        var firstItem = buffer.getFirstVisibleItem();
        /** @type {?} */
        var lastItem = buffer.getLastVisibleItem();
        if (!firstItem || !lastItem) {
            return false;
        }
        /** @type {?} */
        var forwardPadding = viewport.paddings.forward;
        /** @type {?} */
        var backwardPadding = viewport.paddings.backward;
        /** @type {?} */
        var firstIndex = firstItem.$index;
        /** @type {?} */
        var lastIndex = lastItem.$index;
        /** @type {?} */
        var minIndex = isFinite(buffer.absMinIndex) ? buffer.absMinIndex : buffer.minIndex;
        /** @type {?} */
        var maxIndex = isFinite(buffer.absMaxIndex) ? buffer.absMaxIndex : buffer.maxIndex;
        /** @type {?} */
        var hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        var index;
        /** @type {?} */
        var bwdSize = 0;
        /** @type {?} */
        var fwdSize = 0;
        /** @type {?} */
        var bwdPaddingAverageSizeItemsCount = 0;
        // new backward padding
        for (index = minIndex; index < firstIndex; index++) {
            /** @type {?} */
            var item = buffer.cache.get(index);
            bwdSize += item ? item.size : buffer.cache.averageSize;
            if (hasAverageItemSizeChanged) {
                bwdPaddingAverageSizeItemsCount += !item ? 1 : 0;
            }
        }
        if (hasAverageItemSizeChanged) {
            for (index = firstIndex; index < (/** @type {?} */ (fetch.firstIndexBuffer)); index++) {
                bwdPaddingAverageSizeItemsCount += !buffer.cache.get(index) ? 1 : 0;
            }
        }
        // new forward padding
        for (index = lastIndex + 1; index <= maxIndex; index++) {
            /** @type {?} */
            var item = buffer.cache.get(index);
            fwdSize += item ? item.size : buffer.cache.averageSize;
        }
        /** @type {?} */
        var fwdPaddingDiff = forwardPadding.size - fwdSize;
        /** @type {?} */
        var viewportSizeDiff = viewport.getSize() - viewport.getScrollableSize() + fwdPaddingDiff;
        if (viewportSizeDiff > 0) {
            fwdSize += viewportSizeDiff;
            scroller.logger.log("forward padding will be increased by " + viewportSizeDiff + " to fill the viewport");
        }
        forwardPadding.size = fwdSize;
        backwardPadding.size = bwdSize;
        scroller.logger.stat('after paddings adjustments');
        return bwdPaddingAverageSizeItemsCount;
    };
    /**
     * @param {?} scroller
     * @param {?} bwdPaddingAverageSizeItemsCount
     * @return {?}
     */
    Adjust.fixScrollPosition = /**
     * @param {?} scroller
     * @param {?} bwdPaddingAverageSizeItemsCount
     * @return {?}
     */
    function (scroller, bwdPaddingAverageSizeItemsCount) {
        var viewport = scroller.viewport, buffer = scroller.buffer, state = scroller.state, _a = scroller.state, fetch = _a.fetch, _b = _a.fetch, items = _b.items, negativeSize = _b.negativeSize;
        if (scroller.settings.windowViewport) {
            /** @type {?} */
            var newPosition_1 = viewport.scrollPosition;
            /** @type {?} */
            var posDiff_1 = state.preAdjustPosition - newPosition_1;
            if (posDiff_1) {
                /** @type {?} */
                var winState = state.scrollState.window;
                if (newPosition_1 === winState.positionToUpdate) {
                    winState.reset();
                    state.syntheticScroll.readyToReset = false;
                    scroller.logger.log(function () { return "process window scroll preventive: sum(" + newPosition_1 + ", " + posDiff_1 + ")"; });
                    Adjust.setScroll(scroller, posDiff_1);
                    scroller.logger.stat('after scroll position adjustment (window)');
                    return;
                }
            }
        }
        // if backward padding has been changed due to average item size change
        /** @type {?} */
        var hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        var bwdAverageItemsCountDiff = state.bwdPaddingAverageSizeItemsCount - bwdPaddingAverageSizeItemsCount;
        /** @type {?} */
        var hasBwdParamsChanged = bwdPaddingAverageSizeItemsCount > 0 || bwdAverageItemsCountDiff > 0;
        if (hasAverageItemSizeChanged && hasBwdParamsChanged) {
            /** @type {?} */
            var _bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * buffer.averageSize;
            /** @type {?} */
            var bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * fetch.averageItemSize;
            /** @type {?} */
            var bwdPaddingAverageSizeDiff = _bwdPaddingAverageSize - bwdPaddingAverageSize;
            /** @type {?} */
            var bwdAverageItemsSizeDiff = bwdAverageItemsCountDiff * fetch.averageItemSize;
            /** @type {?} */
            var positionDiff = bwdPaddingAverageSizeDiff - bwdAverageItemsSizeDiff;
            if (positionDiff) {
                Adjust.setScroll(scroller, positionDiff);
                scroller.logger.stat('after scroll position adjustment (average)');
            }
            state.bwdPaddingAverageSizeItemsCount = bwdPaddingAverageSizeItemsCount;
        }
        // if scrollable area size padding forward size have not been changed during this cycle
        if (state.sizeBeforeRender === viewport.getScrollableSize() &&
            viewport.paddings.forward.size === state.fwdPaddingBeforeRender) {
            return;
        }
        // no negative area items
        if (items[0].$index >= fetch.minIndex) {
            return;
        }
        if (negativeSize > 0) {
            Adjust.setScroll(scroller, negativeSize);
        }
        else if (negativeSize < 0) {
            viewport.paddings.forward.size -= negativeSize;
            viewport.scrollPosition -= negativeSize;
        }
        scroller.logger.stat('after scroll position adjustment (negative)');
    };
    /**
     * @param {?} scroller
     * @param {?} delta
     * @return {?}
     */
    Adjust.setScroll = /**
     * @param {?} scroller
     * @param {?} delta
     * @return {?}
     */
    function (scroller, delta) {
        var viewport = scroller.viewport;
        /** @type {?} */
        var forwardPadding = viewport.paddings[Direction.forward];
        /** @type {?} */
        var oldPosition = viewport.scrollPosition;
        /** @type {?} */
        var newPosition = Math.round(oldPosition + delta);
        for (var i = 0; i < Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT; i++) {
            viewport.scrollPosition = newPosition;
            /** @type {?} */
            var positionDiff = newPosition - viewport.scrollPosition;
            if (positionDiff > 0) {
                forwardPadding.size += positionDiff;
            }
            else {
                break;
            }
        }
    };
    Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT = 10;
    return Adjust;
}());
export default Adjust;
if (false) {
    /** @type {?} */
    Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT;
}
//# sourceMappingURL=adjust.js.map