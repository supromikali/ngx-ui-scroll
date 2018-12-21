/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Item } from '../classes/item';
import { Process, ProcessStatus } from '../interfaces/index';
var PostFetch = /** @class */ (function () {
    function PostFetch() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    PostFetch.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        if (PostFetch.setItems(scroller)) {
            PostFetch.setBufferLimits(scroller);
            scroller.callWorkflow({
                process: Process.postFetch,
                status: scroller.state.fetch.hasNewItems ? ProcessStatus.next : ProcessStatus.done
            });
        }
        else {
            scroller.callWorkflow({
                process: Process.postFetch,
                status: ProcessStatus.error,
                payload: { error: 'Can\'t set buffer items' }
            });
        }
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PostFetch.setBufferLimits = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, _a = scroller.state.fetch, firstIndex = _a.firstIndex, lastIndex = _a.lastIndex, items = _a.items;
        if (!items.length) {
            if ((/** @type {?} */ (lastIndex)) < buffer.minIndex) {
                buffer.absMinIndex = buffer.minIndex;
            }
            if ((/** @type {?} */ (firstIndex)) > buffer.maxIndex) {
                buffer.absMaxIndex = buffer.maxIndex;
            }
        }
        else {
            /** @type {?} */
            var last = items.length - 1;
            if ((/** @type {?} */ (firstIndex)) < items[0].$index) {
                buffer.absMinIndex = items[0].$index;
            }
            if ((/** @type {?} */ (lastIndex)) > items[last].$index) {
                buffer.absMaxIndex = items[last].$index;
            }
        }
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    PostFetch.setItems = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, fetch = scroller.state.fetch;
        /** @type {?} */
        var items = fetch.newItemsData;
        if (!items || !items.length) { // empty result
            return true;
        }
        // eof/bof case, need to shift fetch index if bof
        /** @type {?} */
        var fetchIndex = (/** @type {?} */ (fetch.index));
        if (items.length < fetch.count) {
            if (scroller.state.isInitialLoop) {
                // let's treat initial poor fetch as startIndex-bof
                fetchIndex = scroller.state.startIndex;
            }
            else if ((/** @type {?} */ (fetch.firstIndex)) < buffer.minIndex) { // normal bof
                fetchIndex = buffer.minIndex - items.length;
            }
        }
        fetch.items = items.map(function (item, index) {
            return new Item(fetchIndex + index, item, scroller.routines);
        });
        fetch.isPrepend = !!buffer.items.length && buffer.items[0].$index > fetch.items[fetch.items.length - 1].$index;
        return buffer.setItems(fetch.items);
    };
    return PostFetch;
}());
export default PostFetch;
//# sourceMappingURL=postFetch.js.map