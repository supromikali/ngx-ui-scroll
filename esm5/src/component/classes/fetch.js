/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FetchModel = /** @class */ (function () {
    function FetchModel() {
        this.callCount = 0;
        this.reset();
    }
    /**
     * @return {?}
     */
    FetchModel.prototype.reset = /**
     * @return {?}
     */
    function () {
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
    };
    Object.defineProperty(FetchModel.prototype, "newItemsData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._newItemsData;
        },
        set: /**
         * @param {?} items
         * @return {?}
         */
        function (items) {
            this._newItemsData = items;
            this.callCount++;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "shouldFetch", {
        get: /**
         * @return {?}
         */
        function () {
            return !!this.count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "hasNewItems", {
        get: /**
         * @return {?}
         */
        function () {
            return !!((this._newItemsData && this._newItemsData.length));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "index", {
        get: /**
         * @return {?}
         */
        function () {
            return this.firstIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchModel.prototype, "count", {
        get: /**
         * @return {?}
         */
        function () {
            return this.firstIndex !== null && this.lastIndex !== null ? this.lastIndex - this.firstIndex + 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    return FetchModel;
}());
export { FetchModel };
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