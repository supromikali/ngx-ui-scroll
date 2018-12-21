/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Direction, Process, ProcessStatus } from '../interfaces/index';
export default class Adjust {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
        scroller.state.preAdjustPosition = scroller.viewport.scrollPosition;
        // padding-elements adjustments
        /** @type {?} */
        const setPaddingsResult = Adjust.setPaddings(scroller);
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
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setPaddings(scroller) {
        const { viewport, buffer, state: { fetch } } = scroller;
        /** @type {?} */
        const firstItem = buffer.getFirstVisibleItem();
        /** @type {?} */
        const lastItem = buffer.getLastVisibleItem();
        if (!firstItem || !lastItem) {
            return false;
        }
        /** @type {?} */
        const forwardPadding = viewport.paddings.forward;
        /** @type {?} */
        const backwardPadding = viewport.paddings.backward;
        /** @type {?} */
        const firstIndex = firstItem.$index;
        /** @type {?} */
        const lastIndex = lastItem.$index;
        /** @type {?} */
        const minIndex = isFinite(buffer.absMinIndex) ? buffer.absMinIndex : buffer.minIndex;
        /** @type {?} */
        const maxIndex = isFinite(buffer.absMaxIndex) ? buffer.absMaxIndex : buffer.maxIndex;
        /** @type {?} */
        const hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        let index;
        /** @type {?} */
        let bwdSize = 0;
        /** @type {?} */
        let fwdSize = 0;
        /** @type {?} */
        let bwdPaddingAverageSizeItemsCount = 0;
        // new backward padding
        for (index = minIndex; index < firstIndex; index++) {
            /** @type {?} */
            const item = buffer.cache.get(index);
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
            const item = buffer.cache.get(index);
            fwdSize += item ? item.size : buffer.cache.averageSize;
        }
        /** @type {?} */
        const fwdPaddingDiff = forwardPadding.size - fwdSize;
        /** @type {?} */
        const viewportSizeDiff = viewport.getSize() - viewport.getScrollableSize() + fwdPaddingDiff;
        if (viewportSizeDiff > 0) {
            fwdSize += viewportSizeDiff;
            scroller.logger.log(`forward padding will be increased by ${viewportSizeDiff} to fill the viewport`);
        }
        forwardPadding.size = fwdSize;
        backwardPadding.size = bwdSize;
        scroller.logger.stat('after paddings adjustments');
        return bwdPaddingAverageSizeItemsCount;
    }
    /**
     * @param {?} scroller
     * @param {?} bwdPaddingAverageSizeItemsCount
     * @return {?}
     */
    static fixScrollPosition(scroller, bwdPaddingAverageSizeItemsCount) {
        const { viewport, buffer, state, state: { fetch, fetch: { items, negativeSize } } } = scroller;
        if (scroller.settings.windowViewport) {
            /** @type {?} */
            const newPosition = viewport.scrollPosition;
            /** @type {?} */
            const posDiff = state.preAdjustPosition - newPosition;
            if (posDiff) {
                /** @type {?} */
                const winState = state.scrollState.window;
                if (newPosition === winState.positionToUpdate) {
                    winState.reset();
                    state.syntheticScroll.readyToReset = false;
                    scroller.logger.log(() => `process window scroll preventive: sum(${newPosition}, ${posDiff})`);
                    Adjust.setScroll(scroller, posDiff);
                    scroller.logger.stat('after scroll position adjustment (window)');
                    return;
                }
            }
        }
        // if backward padding has been changed due to average item size change
        /** @type {?} */
        const hasAverageItemSizeChanged = buffer.averageSize !== fetch.averageItemSize;
        /** @type {?} */
        const bwdAverageItemsCountDiff = state.bwdPaddingAverageSizeItemsCount - bwdPaddingAverageSizeItemsCount;
        /** @type {?} */
        const hasBwdParamsChanged = bwdPaddingAverageSizeItemsCount > 0 || bwdAverageItemsCountDiff > 0;
        if (hasAverageItemSizeChanged && hasBwdParamsChanged) {
            /** @type {?} */
            const _bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * buffer.averageSize;
            /** @type {?} */
            const bwdPaddingAverageSize = bwdPaddingAverageSizeItemsCount * fetch.averageItemSize;
            /** @type {?} */
            const bwdPaddingAverageSizeDiff = _bwdPaddingAverageSize - bwdPaddingAverageSize;
            /** @type {?} */
            const bwdAverageItemsSizeDiff = bwdAverageItemsCountDiff * fetch.averageItemSize;
            /** @type {?} */
            const positionDiff = bwdPaddingAverageSizeDiff - bwdAverageItemsSizeDiff;
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
    }
    /**
     * @param {?} scroller
     * @param {?} delta
     * @return {?}
     */
    static setScroll(scroller, delta) {
        const { viewport } = scroller;
        /** @type {?} */
        const forwardPadding = viewport.paddings[Direction.forward];
        /** @type {?} */
        const oldPosition = viewport.scrollPosition;
        /** @type {?} */
        const newPosition = Math.round(oldPosition + delta);
        for (let i = 0; i < Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT; i++) {
            viewport.scrollPosition = newPosition;
            /** @type {?} */
            const positionDiff = newPosition - viewport.scrollPosition;
            if (positionDiff > 0) {
                forwardPadding.size += positionDiff;
            }
            else {
                break;
            }
        }
    }
}
Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT = 10;
if (false) {
    /** @type {?} */
    Adjust.MAX_SCROLL_ADJUSTMENTS_COUNT;
}
//# sourceMappingURL=adjust.js.map