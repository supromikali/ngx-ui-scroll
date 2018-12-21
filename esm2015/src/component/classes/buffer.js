/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject } from 'rxjs';
import { Direction } from '../interfaces/index';
import { Cache } from './cache';
export class Buffer {
    /**
     * @param {?} settings
     * @param {?} startIndex
     * @param {?} logger
     */
    constructor(settings, startIndex, logger) {
        this.$items = new BehaviorSubject([]);
        this.cache = new Cache(settings.itemSize, logger);
        this.minIndexUser = settings.minIndex;
        this.maxIndexUser = settings.maxIndex;
        this.reset();
        this.startIndex = startIndex;
        this.minBufferSize = settings.bufferSize;
        this.logger = logger;
    }
    /**
     * @param {?=} reload
     * @param {?=} startIndex
     * @return {?}
     */
    reset(reload, startIndex) {
        if (reload) {
            this.items.forEach(item => item.hide());
        }
        this.items = [];
        this.pristine = true;
        this.cache.reset();
        this.absMinIndex = this.minIndexUser;
        this.absMaxIndex = this.maxIndexUser;
        if (typeof startIndex !== 'undefined') {
            this.startIndex = startIndex;
        }
    }
    /**
     * @param {?} items
     * @return {?}
     */
    set items(items) {
        this.pristine = false;
        this._items = items;
        this.$items.next(items);
    }
    /**
     * @return {?}
     */
    get items() {
        return this._items;
    }
    /**
     * @return {?}
     */
    get size() {
        return this._items.length;
    }
    /**
     * @return {?}
     */
    get averageSize() {
        return this.cache.averageSize;
    }
    /**
     * @return {?}
     */
    get hasItemSize() {
        return this.averageSize !== undefined;
    }
    /**
     * @return {?}
     */
    get minIndex() {
        return isFinite(this.cache.minIndex) ? this.cache.minIndex : this.startIndex;
    }
    /**
     * @return {?}
     */
    get maxIndex() {
        return isFinite(this.cache.maxIndex) ? this.cache.maxIndex : this.startIndex;
    }
    /**
     * @return {?}
     */
    get bof() {
        return this.items.length ? (this.items[0].$index === this.absMinIndex) :
            isFinite(this.absMinIndex);
    }
    /**
     * @return {?}
     */
    get eof() {
        return this.items.length ? (this.items[this.items.length - 1].$index === this.absMaxIndex) :
            isFinite(this.absMaxIndex);
    }
    /**
     * @param {?} $index
     * @return {?}
     */
    get($index) {
        return this.items.find((item) => item.$index === $index);
    }
    /**
     * @param {?} items
     * @return {?}
     */
    setItems(items) {
        if (!this.items.length) {
            this.items = items;
        }
        else if (this.items[0].$index > items[items.length - 1].$index) {
            this.items = [...items, ...this.items];
        }
        else if (items[0].$index > this.items[this.items.length - 1].$index) {
            this.items = [...this.items, ...items];
        }
        else {
            return false;
        }
        return true;
    }
    /**
     * @return {?}
     */
    getFirstVisibleItemIndex() {
        /** @type {?} */
        const length = this.items.length;
        for (let i = 0; i < length; i++) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    }
    /**
     * @return {?}
     */
    getLastVisibleItemIndex() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    }
    /**
     * @return {?}
     */
    getFirstVisibleItem() {
        /** @type {?} */
        const index = this.getFirstVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    }
    /**
     * @return {?}
     */
    getLastVisibleItem() {
        /** @type {?} */
        const index = this.getLastVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    }
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getEdgeVisibleItem(direction, opposite) {
        return direction === (!opposite ? Direction.forward : Direction.backward) ?
            this.getLastVisibleItem() : this.getFirstVisibleItem();
    }
    /**
     * @return {?}
     */
    getVisibleItemsCount() {
        return this.items.reduce((acc, item) => acc + (item.invisible ? 0 : 1), 0);
    }
    /**
     * @param {?} index
     * @return {?}
     */
    getSizeByIndex(index) {
        /** @type {?} */
        const item = this.cache.get(index);
        return item ? item.size : this.averageSize;
    }
    /**
     * @return {?}
     */
    checkAverageSize() {
        this.cache.recalculateAverageSize();
    }
}
if (false) {
    /** @type {?} */
    Buffer.prototype._items;
    /** @type {?} */
    Buffer.prototype.$items;
    /** @type {?} */
    Buffer.prototype.pristine;
    /** @type {?} */
    Buffer.prototype.cache;
    /** @type {?} */
    Buffer.prototype.minIndexUser;
    /** @type {?} */
    Buffer.prototype.maxIndexUser;
    /** @type {?} */
    Buffer.prototype.absMinIndex;
    /** @type {?} */
    Buffer.prototype.absMaxIndex;
    /** @type {?} */
    Buffer.prototype.startIndex;
    /** @type {?} */
    Buffer.prototype.minBufferSize;
    /** @type {?} */
    Buffer.prototype.logger;
}
//# sourceMappingURL=buffer.js.map