/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Process, ProcessStatus } from '../interfaces/index';
var Scroll = /** @class */ (function () {
    function Scroll() {
    }
    /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    Scroll.run = /**
     * @param {?} scroller
     * @param {?=} payload
     * @return {?}
     */
    function (scroller, payload) {
        if (payload === void 0) { payload = {}; }
        scroller.logger.log(scroller.viewport.scrollPosition);
        if (scroller.state.syntheticScroll.position !== null) {
            if (!Scroll.processSyntheticScroll(scroller)) {
                return;
            }
        }
        this.delayScroll(scroller, payload);
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Scroll.processSyntheticScroll = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var viewport = scroller.viewport, syntheticScroll = scroller.state.syntheticScroll, settings = scroller.settings, logger = scroller.logger;
        /** @type {?} */
        var time = Number(new Date());
        /** @type {?} */
        var synthetic = tslib_1.__assign({}, syntheticScroll);
        /** @type {?} */
        var position = viewport.scrollPosition;
        /** @type {?} */
        var synthScrollDelay = time - synthetic.time;
        if (synthScrollDelay > settings.maxSynthScrollDelay) {
            logger.log(function () { return "reset synthetic scroll params (" + synthScrollDelay + " > " + settings.maxSynthScrollDelay + ")"; });
            syntheticScroll.reset();
            return position !== synthetic.position;
        }
        // synthetic scroll
        syntheticScroll.readyToReset = true;
        if (position === synthetic.position) {
            // let's reset syntheticScroll.position on first change
            logger.log(function () { return "skip synthetic scroll (" + position + ")"; });
            return false;
        }
        else if (synthetic.readyToReset) {
            syntheticScroll.position = null;
            syntheticScroll.positionBefore = null;
            logger.log(function () { return 'reset synthetic scroll params'; });
        }
        if (settings.windowViewport) {
            if (!synthetic.readyToReset) {
                logger.log(function () { return 'reset synthetic scroll params (window)'; });
                syntheticScroll.reset();
            }
            return true;
        }
        // inertia scroll over synthetic scroll
        if (position !== synthetic.position) {
            /** @type {?} */
            var inertiaDelta_1 = (/** @type {?} */ (synthetic.positionBefore)) - position;
            /** @type {?} */
            var syntheticDelta_1 = (/** @type {?} */ (synthetic.position)) - position;
            if (inertiaDelta_1 > 0 && inertiaDelta_1 < syntheticDelta_1) {
                /** @type {?} */
                var newPosition_1 = Math.max(0, position + syntheticScroll.delta);
                logger.log(function () { return 'inertia scroll adjustment' +
                    '. Position: ' + position +
                    ', synthetic position: ' + synthetic.position +
                    ', synthetic position before: ' + synthetic.positionBefore +
                    ', synthetic delay: ' + synthScrollDelay +
                    ', synthetic delta: ' + syntheticDelta_1 +
                    ', inertia delta: ' + inertiaDelta_1 +
                    ', new position: ' + newPosition_1; });
                if (settings.inertia) { // precise inertia settings
                    if (inertiaDelta_1 <= settings.inertiaScrollDelta && synthScrollDelay <= settings.inertiaScrollDelay) {
                        viewport.scrollPosition = newPosition_1;
                    }
                }
                else {
                    viewport.scrollPosition = newPosition_1;
                }
            } /* else {
              logger.log(() => 'inertia scroll adjustment [cancelled]' +
                '. Position: ' + position +
                ', synthetic position: ' + synthetic.position +
                ', synthetic position before: ' + synthetic.positionBefore +
                ', synthetic delta: ' + syntheticDelta + ', inertia delta: ' + inertiaDelta);
            } */
        }
        return true;
    };
    /**
     * @param {?} scroller
     * @param {?} payload
     * @return {?}
     */
    Scroll.delayScroll = /**
     * @param {?} scroller
     * @param {?} payload
     * @return {?}
     */
    function (scroller, payload) {
        if (!scroller.settings.throttle || payload.byTimer) {
            Scroll.doScroll(scroller);
            return;
        }
        var scrollState = scroller.state.scrollState;
        /** @type {?} */
        var time = Number(Date.now());
        /** @type {?} */
        var tDiff = scrollState.lastScrollTime + scroller.settings.throttle - time;
        /** @type {?} */
        var dDiff = scroller.settings.throttle + (scrollState.firstScrollTime ? scrollState.firstScrollTime - time : 0);
        /** @type {?} */
        var diff = Math.max(tDiff, dDiff);
        // scroller.logger.log('tDiff:', tDiff, 'dDiff:', dDiff, 'diff:', diff);
        if (diff <= 0) {
            scroller.purgeScrollTimers(true);
            scrollState.lastScrollTime = time;
            scrollState.firstScrollTime = 0;
            Scroll.doScroll(scroller);
        }
        else if (!scrollState.scrollTimer && !scrollState.keepScroll) {
            scroller.logger.log(function () { return "setting the timer at " + (scroller.state.time + diff); });
            scrollState.firstScrollTime = time;
            scrollState.scrollTimer = (/** @type {?} */ (setTimeout(function () {
                scrollState.scrollTimer = null;
                scroller.logger.log(function () { return "fire the timer (" + scroller.state.time + ")"; });
                Scroll.run(scroller, { byTimer: true });
            }, diff)));
        } /* else {
          scroller.logger.log('MISS TIMER');
        } */
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Scroll.doScroll = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var state = scroller.state, scrollState = scroller.state.scrollState;
        if (state.workflowPending) {
            scroller.logger.log(function () {
                return !scrollState.keepScroll ? [
                    "setting %ckeepScroll%c flag (scrolling while the Workflow is pending)",
                    'color: #006600;', 'color: #000000;'
                ] : undefined;
            });
            scrollState.keepScroll = true;
            return;
        }
        scroller.callWorkflow({
            process: Process.scroll,
            status: ProcessStatus.next,
            payload: tslib_1.__assign({ scroll: true }, (scrollState.keepScroll ? { keepScroll: scrollState.keepScroll } : {}))
        });
    };
    return Scroll;
}());
export default Scroll;
//# sourceMappingURL=scroll.js.map