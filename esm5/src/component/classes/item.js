/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Item = /** @class */ (function () {
    function Item($index, data, routines) {
        this.$index = $index;
        this.data = data;
        this.nodeId = String($index);
        this.routines = routines;
        this.invisible = true;
    }
    /**
     * @return {?}
     */
    Item.prototype.setSize = /**
     * @return {?}
     */
    function () {
        this.size = this.routines.getSize(this.element);
    };
    /**
     * @return {?}
     */
    Item.prototype.hide = /**
     * @return {?}
     */
    function () {
        if (this.element) {
            this.routines.hideElement(this.element);
        }
    };
    return Item;
}());
export { Item };
if (false) {
    /** @type {?} */
    Item.prototype.$index;
    /** @type {?} */
    Item.prototype.data;
    /** @type {?} */
    Item.prototype.nodeId;
    /** @type {?} */
    Item.prototype.routines;
    /** @type {?} */
    Item.prototype.element;
    /** @type {?} */
    Item.prototype.size;
    /** @type {?} */
    Item.prototype.invisible;
    /** @type {?} */
    Item.prototype.toRemove;
    /** @type {?} */
    Item.prototype.removeDirection;
}
//# sourceMappingURL=item.js.map