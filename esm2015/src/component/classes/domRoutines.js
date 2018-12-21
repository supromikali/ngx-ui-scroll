/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Direction } from '../interfaces/direction';
export class Routines {
    /**
     * @param {?} settings
     */
    constructor(settings) {
        this.horizontal = settings.horizontal;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getScrollPosition(element) {
        return element[this.horizontal ? 'scrollLeft' : 'scrollTop'];
    }
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    setScrollPosition(element, value) {
        element[this.horizontal ? 'scrollLeft' : 'scrollTop'] = value;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getParams(element) {
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
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getSize(element) {
        return this.getParams(element)[this.horizontal ? 'width' : 'height'];
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getSizeStyle(element) {
        /** @type {?} */
        const size = element.style[this.horizontal ? 'width' : 'height'];
        return parseInt((/** @type {?} */ (size)), 10) || 0;
    }
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    setSizeStyle(element, value) {
        element.style[this.horizontal ? 'width' : 'height'] = `${value}px`;
    }
    /**
     * @param {?} params
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getRectEdge(params, direction, opposite) {
        /** @type {?} */
        const forward = !opposite ? Direction.forward : Direction.backward;
        return params[direction === forward ? (this.horizontal ? 'right' : 'bottom') : (this.horizontal ? 'left' : 'top')];
    }
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getEdge(element, direction, opposite) {
        /** @type {?} */
        const params = this.getParams(element);
        return this.getRectEdge(params, direction, opposite);
    }
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?} relativeElement
     * @param {?} opposite
     * @return {?}
     */
    getEdge2(element, direction, relativeElement, opposite) {
        // vertical only ?
        return element.offsetTop - (relativeElement ? relativeElement.scrollTop : 0) +
            (direction === (!opposite ? Direction.forward : Direction.backward) ? this.getSize(element) : 0);
    }
    /**
     * @param {?} element
     * @return {?}
     */
    hideElement(element) {
        element.style.display = 'none';
    }
    /**
     * @param {?} element
     * @return {?}
     */
    getOffset(element) {
        return this.horizontal ? element.offsetLeft : element.offsetTop;
    }
}
if (false) {
    /** @type {?} */
    Routines.prototype.horizontal;
}
//# sourceMappingURL=domRoutines.js.map