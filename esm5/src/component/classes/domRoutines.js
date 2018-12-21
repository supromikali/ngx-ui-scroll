/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Direction } from '../interfaces/direction';
var Routines = /** @class */ (function () {
    function Routines(settings) {
        this.horizontal = settings.horizontal;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getScrollPosition = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return element[this.horizontal ? 'scrollLeft' : 'scrollTop'];
    };
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    Routines.prototype.setScrollPosition = /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    function (element, value) {
        element[this.horizontal ? 'scrollLeft' : 'scrollTop'] = value;
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getParams = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        if (element.tagName.toLowerCase() === 'body') {
            element = (/** @type {?} */ (element.parentElement));
            return (/** @type {?} */ ({
                'height': element.clientHeight,
                'width': element.clientWidth,
                'top': element.clientTop,
                'bottom': element.clientTop + element.clientHeight,
                'left': element.clientLeft,
                'right': element.clientLeft + element.clientWidth
            }));
        }
        return element.getBoundingClientRect();
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getSize = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return this.getParams(element)[this.horizontal ? 'width' : 'height'];
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getSizeStyle = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var size = element.style[this.horizontal ? 'width' : 'height'];
        return parseInt((/** @type {?} */ (size)), 10) || 0;
    };
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    Routines.prototype.setSizeStyle = /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    function (element, value) {
        element.style[this.horizontal ? 'width' : 'height'] = value + "px";
    };
    /**
     * @param {?} params
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Routines.prototype.getRectEdge = /**
     * @param {?} params
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (params, direction, opposite) {
        /** @type {?} */
        var forward = !opposite ? Direction.forward : Direction.backward;
        return params[direction === forward ? (this.horizontal ? 'right' : 'bottom') : (this.horizontal ? 'left' : 'top')];
    };
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Routines.prototype.getEdge = /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (element, direction, opposite) {
        /** @type {?} */
        var params = this.getParams(element);
        return this.getRectEdge(params, direction, opposite);
    };
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?} relativeElement
     * @param {?} opposite
     * @return {?}
     */
    Routines.prototype.getEdge2 = /**
     * @param {?} element
     * @param {?} direction
     * @param {?} relativeElement
     * @param {?} opposite
     * @return {?}
     */
    function (element, direction, relativeElement, opposite) {
        // vertical only ?
        return element.offsetTop - (relativeElement ? relativeElement.scrollTop : 0) +
            (direction === (!opposite ? Direction.forward : Direction.backward) ? this.getSize(element) : 0);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.hideElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        element.style.display = 'none';
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Routines.prototype.getOffset = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return this.horizontal ? element.offsetLeft : element.offsetTop;
    };
    return Routines;
}());
export { Routines };
if (false) {
    /** @type {?} */
    Routines.prototype.horizontal;
}
//# sourceMappingURL=domRoutines.js.map