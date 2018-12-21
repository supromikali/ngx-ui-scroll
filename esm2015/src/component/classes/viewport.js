/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Paddings } from './paddings';
export class Viewport {
    /**
     * @param {?} elementRef
     * @param {?} settings
     * @param {?} routines
     * @param {?} state
     * @param {?} logger
     */
    constructor(elementRef, settings, routines, state, logger) {
        this.settings = settings;
        this.routines = routines;
        this.state = state;
        this.logger = logger;
        this.element = elementRef.nativeElement;
        if (settings.windowViewport) {
            this.host = ((/** @type {?} */ (this.element.ownerDocument))).body;
            this.scrollEventElement = (/** @type {?} */ ((this.element.ownerDocument)));
            this.scrollable = (/** @type {?} */ (this.scrollEventElement.scrollingElement));
        }
        else {
            this.host = (/** @type {?} */ (this.element.parentElement));
            this.scrollEventElement = this.host;
            this.scrollable = (/** @type {?} */ (this.element.parentElement));
        }
        this.paddings = new Paddings(this.element, this.routines, settings);
        if (settings.windowViewport && 'scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }
    /**
     * @param {?} scrollPosition
     * @return {?}
     */
    reset(scrollPosition) {
        /** @type {?} */
        let newPosition = 0;
        this.paddings.reset(this.getSize(), this.state.startIndex);
        /** @type {?} */
        const negativeSize = this.paddings.backward.size;
        if (negativeSize) {
            newPosition = negativeSize;
            this.state.bwdPaddingAverageSizeItemsCount = negativeSize / this.settings.itemSize;
        }
        this.scrollPosition = newPosition;
        this.state.scrollState.reset();
        this.state.syntheticScroll.reset(scrollPosition !== newPosition ? newPosition : null);
        this.startDelta = 0;
    }
    /**
     * @param {?} value
     * @param {?=} oldPosition
     * @return {?}
     */
    setPosition(value, oldPosition) {
        if (oldPosition === undefined) {
            oldPosition = this.scrollPosition;
        }
        if (oldPosition === value) {
            this.logger.log(() => ['setting scroll position at', value, '[cancelled]']);
            return value;
        }
        this.routines.setScrollPosition(this.scrollable, value);
        /** @type {?} */
        const position = this.scrollPosition;
        this.logger.log(() => ['setting scroll position at', position]);
        return position;
    }
    /**
     * @return {?}
     */
    get scrollPosition() {
        return this.routines.getScrollPosition(this.scrollable);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set scrollPosition(value) {
        /** @type {?} */
        const oldPosition = this.scrollPosition;
        /** @type {?} */
        const newPosition = this.setPosition(value, oldPosition);
        /** @type {?} */
        const synthState = this.state.syntheticScroll;
        synthState.time = Number(Date.now());
        synthState.position = newPosition;
        synthState.delta = newPosition - oldPosition;
        if (synthState.positionBefore === null) {
            // syntheticScroll.positionBefore should be set once per cycle
            synthState.positionBefore = oldPosition;
        }
    }
    /**
     * @return {?}
     */
    getSize() {
        return this.routines.getSize(this.host);
    }
    /**
     * @return {?}
     */
    getScrollableSize() {
        return this.routines.getSize(this.element);
    }
    /**
     * @return {?}
     */
    getBufferPadding() {
        return this.getSize() * this.settings.padding;
    }
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getEdge(direction, opposite) {
        return this.routines.getEdge(this.host, direction, opposite);
    }
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    getElementEdge(element, direction, opposite) {
        return this.routines.getEdge(element, direction, opposite);
    }
    /**
     * @return {?}
     */
    getOffset() {
        return this.routines.getOffset(this.element);
    }
}
if (false) {
    /** @type {?} */
    Viewport.prototype.paddings;
    /** @type {?} */
    Viewport.prototype.startDelta;
    /** @type {?} */
    Viewport.prototype.element;
    /** @type {?} */
    Viewport.prototype.host;
    /** @type {?} */
    Viewport.prototype.scrollEventElement;
    /** @type {?} */
    Viewport.prototype.scrollable;
    /** @type {?} */
    Viewport.prototype.settings;
    /** @type {?} */
    Viewport.prototype.routines;
    /** @type {?} */
    Viewport.prototype.state;
    /** @type {?} */
    Viewport.prototype.logger;
}
//# sourceMappingURL=viewport.js.map