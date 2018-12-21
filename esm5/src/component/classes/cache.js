/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ItemCache = /** @class */ (function () {
    function ItemCache(item) {
        this.$index = item.$index;
        this.nodeId = item.nodeId;
        this.data = item.data;
        this.size = item.size;
    }
    return ItemCache;
}());
export { ItemCache };
if (false) {
    /** @type {?} */
    ItemCache.prototype.$index;
    /** @type {?} */
    ItemCache.prototype.nodeId;
    /** @type {?} */
    ItemCache.prototype.data;
    /** @type {?} */
    ItemCache.prototype.size;
    /** @type {?} */
    ItemCache.prototype.position;
}
var RecalculateAverage = /** @class */ (function () {
    function RecalculateAverage() {
        this.reset();
    }
    /**
     * @return {?}
     */
    RecalculateAverage.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.newItems = [];
        this.oldItems = [];
    };
    return RecalculateAverage;
}());
export { RecalculateAverage };
if (false) {
    /** @type {?} */
    RecalculateAverage.prototype.newItems;
    /** @type {?} */
    RecalculateAverage.prototype.oldItems;
}
var Cache = /** @class */ (function () {
    function Cache(itemSize, logger) {
        this.averageSizeFloat = itemSize;
        this.averageSize = itemSize;
        this.itemSize = itemSize;
        this.items = new Map();
        this.recalculateAverage = new RecalculateAverage();
        this.reset();
        this.logger = logger;
    }
    /**
     * @return {?}
     */
    Cache.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.minIndex = +Infinity;
        this.maxIndex = -Infinity;
        this.items.clear();
        this.averageSizeFloat = this.itemSize;
        this.averageSize = this.itemSize;
        this.recalculateAverage.reset();
    };
    /**
     * @return {?}
     */
    Cache.prototype.recalculateAverageSize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var _a = this.recalculateAverage, oldItemsLength = _a.oldItems.length, newItemsLength = _a.newItems.length;
        if (!oldItemsLength && !newItemsLength) {
            return;
        }
        /** @type {?} */
        var oldItemsSize = this.recalculateAverage.oldItems.reduce(function (acc, index) { return acc + _this.getItemSize(index); }, 0);
        /** @type {?} */
        var newItemsSize = this.recalculateAverage.newItems.reduce(function (acc, index) { return acc + _this.getItemSize(index); }, 0);
        if (oldItemsLength) {
            /** @type {?} */
            var averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            var averageSizeLength = this.items.size - newItemsLength - oldItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + oldItemsSize) / averageSizeLength;
        }
        if (newItemsLength) {
            /** @type {?} */
            var averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            var averageSizeLength = this.items.size - newItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + newItemsSize) / this.items.size;
        }
        this.averageSize = Math.round(this.averageSizeFloat);
        this.recalculateAverage.reset();
        this.logger.log(function () { return "average size has been updated: " + _this.averageSize; });
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Cache.prototype.add = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var itemCache = this.get(item.$index);
        if (itemCache) {
            itemCache.data = item.data;
            if (itemCache.size !== item.size) {
                itemCache.size = item.size;
                this.recalculateAverage.oldItems.push(item.$index);
            }
        }
        else {
            itemCache = new ItemCache(item);
            this.items.set(item.$index, itemCache);
            if (this.averageSize !== itemCache.size) {
                this.recalculateAverage.newItems.push(item.$index);
            }
        }
        if (item.$index < this.minIndex) {
            this.minIndex = item.$index;
        }
        if (item.$index > this.maxIndex) {
            this.maxIndex = item.$index;
        }
        return itemCache;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    Cache.prototype.getItemSize = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var item = this.get(index);
        return item ? item.size : 0;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    Cache.prototype.get = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        return this.items.get(index);
    };
    return Cache;
}());
export { Cache };
if (false) {
    /** @type {?} */
    Cache.prototype.averageSizeFloat;
    /** @type {?} */
    Cache.prototype.averageSize;
    /** @type {?} */
    Cache.prototype.minIndex;
    /** @type {?} */
    Cache.prototype.maxIndex;
    /** @type {?} */
    Cache.prototype.recalculateAverage;
    /** @type {?} */
    Cache.prototype.items;
    /** @type {?} */
    Cache.prototype.logger;
    /** @type {?} */
    Cache.prototype.itemSize;
}
//# sourceMappingURL=cache.js.map