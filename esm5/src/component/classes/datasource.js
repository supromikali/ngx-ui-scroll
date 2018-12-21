/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Adapter, generateMockAdapter } from './adapter';
var Datasource = /** @class */ (function () {
    function Datasource(datasource, hasNoAdapter) {
        this.constructed = true;
        Object.assign((/** @type {?} */ (this)), datasource);
        if (hasNoAdapter) {
            this.adapter = (/** @type {?} */ (generateMockAdapter()));
        }
        else {
            this.adapter = new Adapter();
        }
    }
    return Datasource;
}());
export { Datasource };
if (false) {
    /** @type {?} */
    Datasource.prototype.constructed;
    /** @type {?} */
    Datasource.prototype.get;
    /** @type {?} */
    Datasource.prototype.settings;
    /** @type {?} */
    Datasource.prototype.devSettings;
    /** @type {?} */
    Datasource.prototype.adapter;
}
//# sourceMappingURL=datasource.js.map