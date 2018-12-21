/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var assignBoolean = function (target, source, token, defaults) {
    /** @type {?} */
    var param = ((/** @type {?} */ (source)))[token];
    if (typeof param === 'undefined') {
        return;
    }
    if (typeof param !== 'boolean') {
        console.warn(token + ' setting parse error, set it to ' + ((/** @type {?} */ (defaults)))[token] + ' (default)');
        return;
    }
    ((/** @type {?} */ (target)))[token] = param;
    return true;
};
var ɵ0 = assignBoolean;
/** @type {?} */
var assignNumeric = function (target, source, token, defaults, integer) {
    if (integer === void 0) { integer = false; }
    /** @type {?} */
    var param = ((/** @type {?} */ (source)))[token];
    if (typeof param === 'undefined') {
        return;
    }
    if (typeof param !== 'number') {
        console.warn(token + ' setting parse error, set it to ' + ((/** @type {?} */ (defaults)))[token] + ' (default)');
        return;
    }
    if (integer && parseInt(param.toString(), 10) !== param) {
        console.warn(token + ' setting parse error, set it to ' + ((/** @type {?} */ (defaults)))[token] + ' (default)');
        return;
    }
    ((/** @type {?} */ (target)))[token] = param;
    return true;
};
var ɵ1 = assignNumeric;
/** @type {?} */
var assignMinimalNumeric = function (target, source, token, defaults, minSettings, integer, mustExist) {
    if (integer === void 0) { integer = false; }
    if (mustExist === void 0) { mustExist = true; }
    if (assignNumeric(target, source, token, defaults, integer) !== true) {
        if (!mustExist) {
            return;
        }
    }
    if (((/** @type {?} */ (target)))[token] < ((/** @type {?} */ (minSettings)))[token]) {
        console.warn(token + ' setting is less than minimum, set it to ' + ((/** @type {?} */ (minSettings)))[token]);
        ((/** @type {?} */ (target)))[token] = ((/** @type {?} */ (minSettings)))[token];
        return;
    }
    return true;
};
var ɵ2 = assignMinimalNumeric;
/** @type {?} */
var assignCommon = function (target, settings, defaults) {
    Object.assign(target, defaults);
    if (typeof settings === 'undefined') {
        return;
    }
    if (typeof settings !== 'object') {
        console.warn('settings is not an object, fallback to the defaults');
        return;
    }
};
var ɵ3 = assignCommon;
/** @type {?} */
export var assignSettings = function (target, settings, defaults, minSettings) {
    assignCommon(target, settings, defaults);
    assignBoolean(target, settings, 'adapter', defaults);
    assignNumeric(target, settings, 'startIndex', defaults);
    assignNumeric(target, settings, 'minIndex', defaults);
    assignNumeric(target, settings, 'maxIndex', defaults);
    assignMinimalNumeric(target, settings, 'itemSize', defaults, minSettings, true, false);
    assignMinimalNumeric(target, settings, 'bufferSize', defaults, minSettings, true);
    assignMinimalNumeric(target, settings, 'padding', defaults, minSettings);
    assignBoolean(target, settings, 'infinite', defaults);
    assignBoolean(target, settings, 'horizontal', defaults);
    assignBoolean(target, settings, 'windowViewport', defaults);
};
/** @type {?} */
export var assignDevSettings = function (target, devSettings, defaults, minDevSettings) {
    assignCommon(target, devSettings, defaults);
    assignBoolean(target, devSettings, 'debug', defaults);
    assignBoolean(target, devSettings, 'immediateLog', defaults);
    assignBoolean(target, devSettings, 'logTime', defaults);
    assignMinimalNumeric(target, devSettings, 'throttle', defaults, minDevSettings, true);
    assignBoolean(target, devSettings, 'inertia', defaults);
    assignMinimalNumeric(target, devSettings, 'inertiaScrollDelay', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'inertiaScrollDelta', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'initDelay', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'initWindowDelay', defaults, minDevSettings, true);
    assignMinimalNumeric(target, devSettings, 'maxSynthScrollDelay', defaults, minDevSettings, true);
};
export { ɵ0, ɵ1, ɵ2, ɵ3 };
//# sourceMappingURL=assignSettings.js.map