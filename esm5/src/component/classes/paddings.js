/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Direction } from '../interfaces/direction';
var Padding = /** @class */ (function () {
    function Padding(element, direction, routines) {
        this.element = (/** @type {?} */ (element.querySelector("[data-padding-" + direction + "]")));
        this.direction = direction;
        this.routines = routines;
    }
    /**
     * @param {?=} size
     * @return {?}
     */
    Padding.prototype.reset = /**
     * @param {?=} size
     * @return {?}
     */
    function (size) {
        this.size = size || 0;
    };
    Object.defineProperty(Padding.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this.routines.getSizeStyle(this.element);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.routines.setSizeStyle(this.element, Math.round(value));
        },
        enumerable: true,
        configurable: true
    });
    return Padding;
}());
export { Padding };
if (false) {
    /** @type {?} */
    Padding.prototype.element;
    /** @type {?} */
    Padding.prototype.direction;
    /** @type {?} */
    Padding.prototype.routines;
}
var Paddings = /** @class */ (function () {
    function Paddings(element, routines, settings) {
        this.settings = settings;
        this.forward = new Padding(element, Direction.forward, routines);
        this.backward = new Padding(element, Direction.backward, routines);
    }
    /**
     * @param {?} viewportSize
     * @param {?} startIndex
     * @return {?}
     */
    Paddings.prototype.reset = /**
     * @param {?} viewportSize
     * @param {?} startIndex
     * @return {?}
     */
    function (viewportSize, startIndex) {
        this.forward.reset(this.getPositiveSize(startIndex, viewportSize));
        this.backward.reset(this.getNegativeSize(startIndex));
    };
    /**
     * @param {?} startIndex
     * @param {?} viewportSize
     * @return {?}
     */
    Paddings.prototype.getPositiveSize = /**
     * @param {?} startIndex
     * @param {?} viewportSize
     * @return {?}
     */
    function (startIndex, viewportSize) {
        var settings = this.settings;
        /** @type {?} */
        var positiveSize = viewportSize;
        if (isFinite(settings.maxIndex)) {
            positiveSize = (settings.maxIndex - startIndex + 1) * settings.itemSize;
        }
        return positiveSize;
    };
    /**
     * @param {?} startIndex
     * @return {?}
     */
    Paddings.prototype.getNegativeSize = /**
     * @param {?} startIndex
     * @return {?}
     */
    function (startIndex) {
        var settings = this.settings;
        /** @type {?} */
        var negativeSize = 0;
        if (isFinite(settings.minIndex)) {
            negativeSize = (startIndex - settings.minIndex) * settings.itemSize;
        }
        return negativeSize;
    };
    return Paddings;
}());
export { Paddings };
if (false) {
    /** @type {?} */
    Paddings.prototype.settings;
    /** @type {?} */
    Paddings.prototype.forward;
    /** @type {?} */
    Paddings.prototype.backward;
}
//# sourceMappingURL=paddings.js.map