/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Paddings } from './paddings';
var Viewport = /** @class */ (function () {
    function Viewport(elementRef, settings, routines, state, logger) {
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
    Viewport.prototype.reset = /**
     * @param {?} scrollPosition
     * @return {?}
     */
    function (scrollPosition) {
        /** @type {?} */
        var newPosition = 0;
        this.paddings.reset(this.getSize(), this.state.startIndex);
        /** @type {?} */
        var negativeSize = this.paddings.backward.size;
        if (negativeSize) {
            newPosition = negativeSize;
            this.state.bwdPaddingAverageSizeItemsCount = negativeSize / this.settings.itemSize;
        }
        this.scrollPosition = newPosition;
        this.state.scrollState.reset();
        this.state.syntheticScroll.reset(scrollPosition !== newPosition ? newPosition : null);
        this.startDelta = 0;
    };
    /**
     * @param {?} value
     * @param {?=} oldPosition
     * @return {?}
     */
    Viewport.prototype.setPosition = /**
     * @param {?} value
     * @param {?=} oldPosition
     * @return {?}
     */
    function (value, oldPosition) {
        if (oldPosition === undefined) {
            oldPosition = this.scrollPosition;
        }
        if (oldPosition === value) {
            this.logger.log(function () { return ['setting scroll position at', value, '[cancelled]']; });
            return value;
        }
        this.routines.setScrollPosition(this.scrollable, value);
        /** @type {?} */
        var position = this.scrollPosition;
        this.logger.log(function () { return ['setting scroll position at', position]; });
        return position;
    };
    Object.defineProperty(Viewport.prototype, "scrollPosition", {
        get: /**
         * @return {?}
         */
        function () {
            return this.routines.getScrollPosition(this.scrollable);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            /** @type {?} */
            var oldPosition = this.scrollPosition;
            /** @type {?} */
            var newPosition = this.setPosition(value, oldPosition);
            /** @type {?} */
            var synthState = this.state.syntheticScroll;
            synthState.time = Number(Date.now());
            synthState.position = newPosition;
            synthState.delta = newPosition - oldPosition;
            if (synthState.positionBefore === null) {
                // syntheticScroll.positionBefore should be set once per cycle
                synthState.positionBefore = oldPosition;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Viewport.prototype.getSize = /**
     * @return {?}
     */
    function () {
        return this.routines.getSize(this.host);
    };
    /**
     * @return {?}
     */
    Viewport.prototype.getScrollableSize = /**
     * @return {?}
     */
    function () {
        return this.routines.getSize(this.element);
    };
    /**
     * @return {?}
     */
    Viewport.prototype.getBufferPadding = /**
     * @return {?}
     */
    function () {
        return this.getSize() * this.settings.padding;
    };
    /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Viewport.prototype.getEdge = /**
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (direction, opposite) {
        return this.routines.getEdge(this.host, direction, opposite);
    };
    /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    Viewport.prototype.getElementEdge = /**
     * @param {?} element
     * @param {?} direction
     * @param {?=} opposite
     * @return {?}
     */
    function (element, direction, opposite) {
        return this.routines.getEdge(element, direction, opposite);
    };
    /**
     * @return {?}
     */
    Viewport.prototype.getOffset = /**
     * @return {?}
     */
    function () {
        return this.routines.getOffset(this.element);
    };
    return Viewport;
}());
export { Viewport };
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