/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Item } from '../classes/item';
import { Process, ProcessStatus } from '../interfaces/index';
export default class PostFetch {
    /**
     * @param {?} scroller
     * @return {?}
     */
    static run(scroller) {
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
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setBufferLimits(scroller) {
        const { buffer, state: { fetch: { firstIndex, lastIndex, items } } } = scroller;
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
            const last = items.length - 1;
            if ((/** @type {?} */ (firstIndex)) < items[0].$index) {
                buffer.absMinIndex = items[0].$index;
            }
            if ((/** @type {?} */ (lastIndex)) > items[last].$index) {
                buffer.absMaxIndex = items[last].$index;
            }
        }
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    static setItems(scroller) {
        const { buffer, state: { fetch } } = scroller;
        /** @type {?} */
        const items = fetch.newItemsData;
        if (!items || !items.length) { // empty result
            return true;
        }
        // eof/bof case, need to shift fetch index if bof
        /** @type {?} */
        let fetchIndex = (/** @type {?} */ (fetch.index));
        if (items.length < fetch.count) {
            if (scroller.state.isInitialLoop) {
                // let's treat initial poor fetch as startIndex-bof
                fetchIndex = scroller.state.startIndex;
            }
            else if ((/** @type {?} */ (fetch.firstIndex)) < buffer.minIndex) { // normal bof
                fetchIndex = buffer.minIndex - items.length;
            }
        }
        fetch.items = items.map((item, index) => new Item(fetchIndex + index, item, scroller.routines));
        fetch.isPrepend = !!buffer.items.length && buffer.items[0].$index > fetch.items[fetch.items.length - 1].$index;
        return buffer.setItems(fetch.items);
    }
}
//# sourceMappingURL=postFetch.js.map