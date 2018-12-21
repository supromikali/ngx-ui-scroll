/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Workflow } from './component/workflow';
var UiScrollComponent = /** @class */ (function () {
    function UiScrollComponent(changeDetector, elementRef) {
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
    }
    /**
     * @return {?}
     */
    UiScrollComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.workflow = new Workflow(this);
    };
    /**
     * @return {?}
     */
    UiScrollComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.workflow.dispose();
    };
    UiScrollComponent.decorators = [
        { type: Component, args: [{
                    selector: '[ui-scroll]',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "<div data-padding-backward></div><div\n  *ngFor=\"let item of items\"\n  [attr.data-sid]=\"item.nodeId\"\n  [style.position]=\"item.invisible ? 'fixed' : null\"\n  [style.left]=\"item.invisible ? '-99999px' : null\"\n><ng-template\n  [ngTemplateOutlet]=\"template\"\n  [ngTemplateOutletContext]=\"{\n    $implicit: item.data,\n    index: item.$index,\n    odd: item.$index % 2,\n    even: !(item.$index % 2)\n }\"\n></ng-template></div><div data-padding-forward></div>"
                }] }
    ];
    /** @nocollapse */
    UiScrollComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef }
    ]; };
    return UiScrollComponent;
}());
export { UiScrollComponent };
if (false) {
    /** @type {?} */
    UiScrollComponent.prototype.version;
    /** @type {?} */
    UiScrollComponent.prototype.template;
    /** @type {?} */
    UiScrollComponent.prototype.datasource;
    /** @type {?} */
    UiScrollComponent.prototype.items;
    /** @type {?} */
    UiScrollComponent.prototype.workflow;
    /** @type {?} */
    UiScrollComponent.prototype.changeDetector;
    /** @type {?} */
    UiScrollComponent.prototype.elementRef;
}
//# sourceMappingURL=ui-scroll.component.js.map