/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Direction } from '../interfaces/direction';
export class Padding {
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?} routines
     */
    constructor(element, direction, routines) {
        this.element = (/** @type {?} */ (element.querySelector(`[data-padding-${direction}]`)));
        this.direction = direction;
        this.routines = routines;
    }
    /**
     * @param {?=} size
     * @return {?}
     */
    reset(size) {
        this.size = size || 0;
    }
    /**
     * @return {?}
     */
    get size() {
        return this.routines.getSizeStyle(this.element);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set size(value) {
        this.routines.setSizeStyle(this.element, Math.round(value));
    }
}
if (false) {
    /** @type {?} */
    Padding.prototype.element;
    /** @type {?} */
    Padding.prototype.direction;
    /** @type {?} */
    Padding.prototype.routines;
}
export class Paddings {
    /**
     * @param {?} element
     * @param {?} routines
     * @param {?} settings
     */
    constructor(element, routines, settings) {
        this.settings = settings;
        this.forward = new Padding(element, Direction.forward, routines);
        this.backward = new Padding(element, Direction.backward, routines);
    }
    /**
     * @param {?} viewportSize
     * @param {?} startIndex
     * @return {?}
     */
    reset(viewportSize, startIndex) {
        this.forward.reset(this.getPositiveSize(startIndex, viewportSize));
        this.backward.reset(this.getNegativeSize(startIndex));
    }
    /**
     * @param {?} startIndex
     * @param {?} viewportSize
     * @return {?}
     */
    getPositiveSize(startIndex, viewportSize) {
        const { settings } = this;
        /** @type {?} */
        let positiveSize = viewportSize;
        if (isFinite(settings.maxIndex)) {
            positiveSize = (settings.maxIndex - startIndex + 1) * settings.itemSize;
        }
        return positiveSize;
    }
    /**
     * @param {?} startIndex
     * @return {?}
     */
    getNegativeSize(startIndex) {
        const { settings } = this;
        /** @type {?} */
        let negativeSize = 0;
        if (isFinite(settings.minIndex)) {
            negativeSize = (startIndex - settings.minIndex) * settings.itemSize;
        }
        return negativeSize;
    }
}
if (false) {
    /** @type {?} */
    Paddings.prototype.settings;
    /** @type {?} */
    Paddings.prototype.forward;
    /** @type {?} */
    Paddings.prototype.backward;
}
//# sourceMappingURL=paddings.js.map