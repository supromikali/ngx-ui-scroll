/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
export class ItemCache {
    /**
     * @param {?} item
     */
    constructor(item) {
        this.$index = item.$index;
        this.nodeId = item.nodeId;
        this.data = item.data;
        this.size = item.size;
    }
}
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
export class RecalculateAverage {
    constructor() {
        this.reset();
    }
    /**
     * @return {?}
     */
    reset() {
        this.newItems = [];
        this.oldItems = [];
    }
}
if (false) {
    /** @type {?} */
    RecalculateAverage.prototype.newItems;
    /** @type {?} */
    RecalculateAverage.prototype.oldItems;
}
export class Cache {
    /**
     * @param {?} itemSize
     * @param {?} logger
     */
    constructor(itemSize, logger) {
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
    reset() {
        this.minIndex = +Infinity;
        this.maxIndex = -Infinity;
        this.items.clear();
        this.averageSizeFloat = this.itemSize;
        this.averageSize = this.itemSize;
        this.recalculateAverage.reset();
    }
    /**
     * @return {?}
     */
    recalculateAverageSize() {
        const { oldItems: { length: oldItemsLength }, newItems: { length: newItemsLength } } = this.recalculateAverage;
        if (!oldItemsLength && !newItemsLength) {
            return;
        }
        /** @type {?} */
        const oldItemsSize = this.recalculateAverage.oldItems.reduce((acc, index) => acc + this.getItemSize(index), 0);
        /** @type {?} */
        const newItemsSize = this.recalculateAverage.newItems.reduce((acc, index) => acc + this.getItemSize(index), 0);
        if (oldItemsLength) {
            /** @type {?} */
            const averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            const averageSizeLength = this.items.size - newItemsLength - oldItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + oldItemsSize) / averageSizeLength;
        }
        if (newItemsLength) {
            /** @type {?} */
            const averageSize = this.averageSizeFloat || 0;
            /** @type {?} */
            const averageSizeLength = this.items.size - newItemsLength;
            this.averageSizeFloat = (averageSizeLength * averageSize + newItemsSize) / this.items.size;
        }
        this.averageSize = Math.round(this.averageSizeFloat);
        this.recalculateAverage.reset();
        this.logger.log(() => `average size has been updated: ${this.averageSize}`);
    }
    /**
     * @param {?} item
     * @return {?}
     */
    add(item) {
        /** @type {?} */
        let itemCache = this.get(item.$index);
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
    }
    /**
     * @param {?} index
     * @return {?}
     */
    getItemSize(index) {
        /** @type {?} */
        const item = this.get(index);
        return item ? item.size : 0;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    get(index) {
        return this.items.get(index);
    }
}
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