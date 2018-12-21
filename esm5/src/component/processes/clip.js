/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Direction, Process, ProcessStatus } from '../interfaces/index';
var Clip = /** @class */ (function () {
    function Clip() {
    }
    /**
     * @param {?} scroller
     * @return {?}
     */
    Clip.run = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        Clip.prepareClip(scroller);
        if (scroller.state.clip) {
            Clip.doClip(scroller);
        }
        scroller.callWorkflow({
            process: Process.clip,
            status: ProcessStatus.next
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Clip.prepareClip = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, state = scroller.state, _a = scroller.state, fetch = _a.fetch, direction = _a.fetch.direction;
        if (!buffer.size) {
            return;
        }
        if (state.isInitialWorkflowCycle && !state.scrollState.scroll) {
            scroller.logger.log("skipping clip [initial cycle, no scroll]");
            return;
        }
        /** @type {?} */
        var firstIndex = (/** @type {?} */ (fetch.firstIndexBuffer));
        /** @type {?} */
        var lastIndex = (/** @type {?} */ (fetch.lastIndexBuffer));
        scroller.logger.log(function () {
            return "looking for " + (direction ? 'anti-' + direction + ' ' : '') + "items " +
                ("that are out of [" + firstIndex + ".." + lastIndex + "] range");
        });
        if (!direction || direction === Direction.forward) {
            if (firstIndex - 1 >= buffer.absMinIndex) {
                Clip.prepareClipByDirection(scroller, Direction.forward, firstIndex);
            }
        }
        if (!direction || direction === Direction.backward) {
            if (lastIndex + 1 <= buffer.absMaxIndex) {
                Clip.prepareClipByDirection(scroller, Direction.backward, lastIndex);
            }
        }
        return;
    };
    /**
     * @param {?} scroller
     * @param {?} direction
     * @param {?} edgeIndex
     * @return {?}
     */
    Clip.prepareClipByDirection = /**
     * @param {?} scroller
     * @param {?} direction
     * @param {?} edgeIndex
     * @return {?}
     */
    function (scroller, direction, edgeIndex) {
        /** @type {?} */
        var forward = direction === Direction.forward;
        scroller.buffer.items.forEach(function (item) {
            if ((forward && item.$index < edgeIndex) ||
                (!forward && item.$index > edgeIndex)) {
                item.toRemove = true;
                item.removeDirection = direction;
                scroller.state.clip = true;
            }
        });
    };
    /**
     * @param {?} scroller
     * @return {?}
     */
    Clip.doClip = /**
     * @param {?} scroller
     * @return {?}
     */
    function (scroller) {
        var buffer = scroller.buffer, paddings = scroller.viewport.paddings, logger = scroller.logger;
        /** @type {?} */
        var clipped = [];
        /** @type {?} */
        var size = { backward: 0, forward: 0 };
        scroller.state.clipCall++;
        logger.stat("before clip (" + scroller.state.clipCall + ")");
        buffer.items = buffer.items.filter(function (item) {
            if (item.toRemove) {
                size[item.removeDirection] += item.size;
                item.hide();
                clipped.push(item.$index);
                return false;
            }
            return true;
        });
        if (size.backward) {
            paddings.forward.size += size.backward;
        }
        if (size.forward) {
            paddings.backward.size += size.forward;
        }
        logger.log(function () { return [
            "clipped " + clipped.length + " items" +
                (size.backward ? ", +" + size.backward + " fwd px," : '') +
                (size.forward ? ", +" + size.forward + " bwd px," : ''),
            "range: [" + clipped[0] + ".." + clipped[clipped.length - 1] + "]"
        ]; });
        logger.stat('after clip');
    };
    return Clip;
}());
export default Clip;
//# sourceMappingURL=clip.js.map