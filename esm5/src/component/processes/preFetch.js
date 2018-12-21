/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Process, ProcessStatus, Direction } from '../interfaces/index';
var PreFetch = /** @class */ (function () {
    function PreFetch() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var fetch = scroller.state.fetch;
        scroller.state.preFetchPosition = scroller.viewport.scrollPosition;
        fetch.minIndex = scroller.buffer.minIndex;
        fetch.averageItemSize = scroller.buffer.averageSize || 0;
        // calculate size before start index
        PreFetch.setStartDelta(scroller);
        // set first and last indexes to fetch
        PreFetch.setFetchIndexes(scroller);
        // skip indexes that are in buffer
        PreFetch.skipBufferedItems(scroller);
        // add indexes if there are too few items to fetch (clip padding)
        PreFetch.checkFetchPackSize(scroller);
        // set fetch direction
        PreFetch.setFetchDirection(scroller);
        if (fetch.shouldFetch) {
            scroller.logger.log(function () { return "going to fetch " + fetch.count + " items started from index " + fetch.index; });
        }
        scroller.callWorkflow({
            process: Process.preFetch,
            status: scroller.state.fetch.shouldFetch ? ProcessStatus.next : ProcessStatus.done
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.setStartDelta = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, viewport = scroller.viewport;
        viewport.startDelta = 0;
        if (!buffer.hasItemSize) {
            return;
        }
        /** @type {?} */
        var minIndex = isFinite(buffer.absMinIndex) ? buffer.absMinIndex : buffer.minIndex;
        for (var index = minIndex; index < scroller.state.startIndex; index++) {
            /** @type {?} */
            var item = buffer.cache.get(index);
            viewport.startDelta += item ? item.size : buffer.averageSize;
        }
        if (scroller.settings.windowViewport) {
            viewport.startDelta += viewport.getOffset();
        }
        scroller.logger.log(function () { return "start delta is " + viewport.startDelta; });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.setFetchIndexes = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, viewport = scroller.viewport;
        /** @type {?} */
        var paddingDelta = viewport.getBufferPadding();
        /** @type {?} */
        var relativePosition = state.preFetchPosition - viewport.startDelta;
        /** @type {?} */
        var startPosition = relativePosition - paddingDelta;
        /** @type {?} */
        var endPosition = relativePosition + viewport.getSize() + paddingDelta;
        /** @type {?} */
        var firstIndexPosition = PreFetch.setFirstIndexBuffer(scroller, startPosition);
        PreFetch.setLastIndexBuffer(scroller, firstIndexPosition, endPosition);
        scroller.logger.fetch();
    };
    /**
     * @param {?} scroller
     * @param {?} startPosition
     * @return {?}
     */
    PreFetch.setFirstIndexBuffer = /**
     * @param {?} scroller
     * @param {?} startPosition
     * @return {?}
     */
    function (scroller, startPosition) {
        var state = scroller.state, buffer = scroller.buffer, fetch = scroller.state.fetch;
        /** @type {?} */
        var firstIndex = state.startIndex;
        /** @type {?} */
        var firstIndexPosition = 0;
        if (scroller.state.isInitialLoop) {
            scroller.logger.log("skipping fetch backward direction [initial loop]");
        }
        else {
            /** @type {?} */
            var inc = startPosition < 0 ? -1 : 1;
            /** @type {?} */
            var position = firstIndexPosition;
            /** @type {?} */
            var index = firstIndex;
            while (1) {
                index += inc;
                if (index < buffer.absMinIndex) {
                    break;
                }
                position += inc * buffer.getSizeByIndex(index);
                if (inc < 0) {
                    firstIndex = index;
                    firstIndexPosition = position;
                    if (position <= startPosition) {
                        break;
                    }
                }
                else {
                    if (position > startPosition) {
                        break;
                    }
                    firstIndex = index;
                    firstIndexPosition = position;
                }
            }
        }
        fetch.firstIndex = fetch.firstIndexBuffer = Math.max(firstIndex, buffer.absMinIndex);
        return firstIndexPosition;
    };
    /**
     * @param {?} scroller
     * @param {?} startPosition
     * @param {?} endPosition
     * @return {?}
     */
    PreFetch.setLastIndexBuffer = /**
     * @param {?} scroller
     * @param {?} startPosition
     * @param {?} endPosition
     * @return {?}
     */
    function (scroller, startPosition, endPosition) {
        var state = scroller.state, buffer = scroller.buffer, settings = scroller.settings;
        /** @type {?} */
        var lastIndex;
        if (!buffer.hasItemSize) {
            // just to fetch forward bufferSize items if neither averageItemSize nor itemSize are present
            lastIndex = state.startIndex + settings.bufferSize - 1;
            scroller.logger.log("forcing fetch forward direction [no item size]");
        }
        else {
            /** @type {?} */
            var index = (/** @type {?} */ (state.fetch.firstIndexBuffer));
            /** @type {?} */
            var position = startPosition;
            /** @type {?} */
            var lastIndexPosition = void 0;
            lastIndex = index;
            while (1) {
                lastIndex = index;
                index++;
                position += buffer.getSizeByIndex(index);
                lastIndexPosition = position;
                if (position >= endPosition) {
                    break;
                }
                if (index > buffer.absMaxIndex) {
                    break;
                }
            }
        }
        state.fetch.lastIndex = state.fetch.lastIndexBuffer = Math.min(lastIndex, buffer.absMaxIndex);
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.skipBufferedItems = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        /** @type {?} */
        var buffer = scroller.buffer;
        if (!buffer.size) {
            return;
        }
        var fetch = scroller.state.fetch;
        /** @type {?} */
        var firstIndex = (/** @type {?} */ (fetch.firstIndex));
        /** @type {?} */
        var lastIndex = (/** @type {?} */ (fetch.lastIndex));
        /** @type {?} */
        var packs = [[]];
        /** @type {?} */
        var p = 0;
        for (var i = firstIndex; i <= lastIndex; i++) {
            if (!buffer.get(i)) {
                packs[p].push(i);
            }
            else if (packs[p].length) {
                packs[++p] = [];
            }
        }
        /** @type {?} */
        var pack = packs[0];
        if (packs[0].length && packs[1] && packs[1].length) {
            fetch.hasAnotherPack = true;
            // todo: need to look for biggest pack in visible area
            // todo: or think about merging two requests in a single Fetch process
            if (packs[1].length >= packs[0].length) {
                pack = packs[1];
            }
        }
        fetch.firstIndex = Math.max(pack[0], buffer.absMinIndex);
        fetch.lastIndex = Math.min(pack[pack.length - 1], buffer.absMaxIndex);
        if (fetch.firstIndex !== firstIndex || fetch.lastIndex !== lastIndex) {
            scroller.logger.fetch('after Buffer flushing');
        }
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.checkFetchPackSize = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, fetch = scroller.state.fetch;
        if (!fetch.shouldFetch) {
            return;
        }
        /** @type {?} */
        var firstIndex = (/** @type {?} */ (fetch.firstIndex));
        /** @type {?} */
        var lastIndex = (/** @type {?} */ (fetch.lastIndex));
        /** @type {?} */
        var diff = scroller.settings.bufferSize - (lastIndex - firstIndex + 1);
        if (diff <= 0) {
            return;
        }
        if (!buffer.size || lastIndex > buffer.items[0].$index) { // forward
            // forward
            /** @type {?} */
            var newLastIndex = Math.min(lastIndex + diff, buffer.absMaxIndex);
            if (newLastIndex > lastIndex) {
                fetch.lastIndex = fetch.lastIndexBuffer = newLastIndex;
            }
        }
        else {
            /** @type {?} */
            var newFirstIndex = Math.max(firstIndex - diff, buffer.absMinIndex);
            if (newFirstIndex < firstIndex) {
                fetch.firstIndex = fetch.firstIndexBuffer = newFirstIndex;
            }
        }
        if (fetch.firstIndex !== firstIndex || fetch.lastIndex !== lastIndex) {
            scroller.logger.fetch('after bufferSize adjustment');
            PreFetch.skipBufferedItems(scroller);
        }
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PreFetch.setFetchDirection = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, fetch = scroller.state.fetch;
        if (fetch.lastIndex) {
            /** @type {?} */
            var direction_1 = Direction.forward;
            if (buffer.size) {
                direction_1 = fetch.lastIndex < buffer.items[0].$index ? Direction.backward : Direction.forward;
            }
            fetch.direction = direction_1;
            scroller.logger.log(function () { return "fetch direction is \"" + direction_1 + "\""; });
        }
    };
    return PreFetch;
}());
export default PreFetch;
//# sourceMappingURL=preFetch.js.map