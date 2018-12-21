/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { BehaviorSubject } from 'rxjs';
import { Direction } from '../interfaces/index';
import { Cache } from './cache';
var Buffer = /** @class */ (function () {
    function Buffer(settings, startIndex, logger) {
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
    Buffer.prototype.reset = /**
     * @param {?=} reload
     * @param {?=} startIndex
     * @return {?}
     */
    function (reload, startIndex) {
        if (reload) {
            this.items.forEach(function (item) { return item.hide(); });
        }
        this.items = [];
        this.pristine = true;
        this.cache.reset();
        this.absMinIndex = this.minIndexUser;
        this.absMaxIndex = this.maxIndexUser;
        if (typeof startIndex !== 'undefined') {
            this.startIndex = startIndex;
        }
    };
    Object.defineProperty(Buffer.prototype, "items", {
        get: /**
         * @return {?}
         */
        function () {
            return this._items;
        },
        set: /**
         * @param {?} items
         * @return {?}
         */
        function (items) {
            this.pristine = false;
            this._items = items;
            this.$items.next(items);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._items.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "averageSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this.cache.averageSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "hasItemSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this.averageSize !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "minIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return isFinite(this.cache.minIndex) ? this.cache.minIndex : this.startIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "maxIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return isFinite(this.cache.maxIndex) ? this.cache.maxIndex : this.startIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "bof", {
        get: /**
         * @return {?}
         */
        function () {
            return this.items.length ? (this.items[0].$index === this.absMinIndex) :
                isFinite(this.absMinIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "eof", {
        get: /**
         * @return {?}
         */
        function () {
            return this.items.length ? (this.items[this.items.length - 1].$index === this.absMaxIndex) :
                isFinite(this.absMaxIndex);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} $index
     * @return {?}
     */
    Buffer.prototype.get = /**
     * @param {?} $index
     * @return {?}
     */
    function ($index) {
        return this.items.find(function (item) { return item.$index === $index; });
    };
    /**
     * @param {?} items
     * @return {?}
     */
    Buffer.prototype.setItems = /**
     * @param {?} items
     * @return {?}
     */
    function (items) {
        if (!this.items.length) {
            this.items = items;
        }
        else if (this.items[0].$index > items[items.length - 1].$index) {
            this.items = items.concat(this.items);
        }
        else if (items[0].$index > this.items[this.items.length - 1].$index) {
            this.items = this.items.concat(items);
        }
        else {
            return false;
        }
        return true;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getFirstVisibleItemIndex = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var length = this.items.length;
        for (var i = 0; i < length; i++) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getLastVisibleItemIndex = /**
     * @return {?}
     */
    function () {
        for (var i = this.items.length - 1; i >= 0; i--) {
            if (!this.items[i].invisible) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getFirstVisibleItem = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var index = this.getFirstVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getLastVisibleItem = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var index = this.getLastVisibleItemIndex();
        if (index >= 0) {
            return this.items[index];
        }
    };
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Buffer.prototype.getEdgeVisibleItem = /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (direction, opposite) {
        return direction === (!opposite ? Direction.forward : Direction.backward) ?
            this.getLastVisibleItem() : this.getFirstVisibleItem();
    };
    /**
     * @return {?}
     */
    Buffer.prototype.getVisibleItemsCount = /**
     * @return {?}
     */
    function () {
        return this.items.reduce(function (acc, item) { return acc + (item.invisible ? 0 : 1); }, 0);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    Buffer.prototype.getSizeByIndex = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var item = this.cache.get(index);
        return item ? item.size : this.averageSize;
    };
    /**
     * @return {?}
     */
    Buffer.prototype.checkAverageSize = /**
     * @return {?}
     */
    function () {
        this.cache.recalculateAverageSize();
    };
    return Buffer;
}());
export { Buffer };
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