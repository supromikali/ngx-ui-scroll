/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
export class FetchModel {
    constructor() {
        this.callCount = 0;
        this.reset();
    }
    /**
     * @return {?}
     */
    reset() {
        this._newItemsData = null;
        this.items = [];
        this.firstIndexBuffer = null;
        this.lastIndexBuffer = null;
        this.firstIndex = null;
        this.lastIndex = null;
        this.hasAnotherPack = false;
        this.negativeSize = 0;
        this.direction = null;
        this.isPrepend = false;
    }
    /**
     * @return {?}
     */
    get newItemsData() {
        return this._newItemsData;
    }
    /**
     * @param {?} items
     * @return {?}
     */
    set newItemsData(items) {
        this._newItemsData = items;
        this.callCount++;
    }
    /**
     * @return {?}
     */
    get shouldFetch() {
        return !!this.count;
    }
    /**
     * @return {?}
     */
    get hasNewItems() {
        return !!((this._newItemsData && this._newItemsData.length));
    }
    /**
     * @return {?}
     */
    get index() {
        return this.firstIndex;
    }
    /**
     * @return {?}
     */
    get count() {
        return this.firstIndex !== null && this.lastIndex !== null ? this.lastIndex - this.firstIndex + 1 : 0;
    }
}
if (false) {
    /** @type {?} */
    FetchModel.prototype._newItemsData;
    /** @type {?} */
    FetchModel.prototype.items;
    /** @type {?} */
    FetchModel.prototype.firstIndexBuffer;
    /** @type {?} */
    FetchModel.prototype.lastIndexBuffer;
    /** @type {?} */
    FetchModel.prototype.firstIndex;
    /** @type {?} */
    FetchModel.prototype.lastIndex;
    /** @type {?} */
    FetchModel.prototype.hasAnotherPack;
    /** @type {?} */
    FetchModel.prototype.callCount;
    /** @type {?} */
    FetchModel.prototype.minIndex;
    /** @type {?} */
    FetchModel.prototype.negativeSize;
    /** @type {?} */
    FetchModel.prototype.averageItemSize;
    /** @type {?} */
    FetchModel.prototype.direction;
    /** @type {?} */
    FetchModel.prototype.isPrepend;
}
//# sourceMappingURL=fetch.js.map