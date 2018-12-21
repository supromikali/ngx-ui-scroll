/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Workflow } from './component/workflow';
export class UiScrollComponent {
    /**
     * @param {?} changeDetector
     * @param {?} elementRef
     */
    constructor(changeDetector, elementRef) {
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.workflow = new Workflow(this);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.workflow.dispose();
    }
}
UiScrollComponent.decorators = [
    { type: Component, args: [{
                selector: '[ui-scroll]',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<div data-padding-backward></div><div
  *ngFor="let item of items"
  [attr.data-sid]="item.nodeId"
  [style.position]="item.invisible ? 'fixed' : null"
  [style.left]="item.invisible ? '-99999px' : null"
><ng-template
  [ngTemplateOutlet]="template"
  [ngTemplateOutletContext]="{
    $implicit: item.data,
    index: item.$index,
    odd: item.$index % 2,
    even: !(item.$index % 2)
 }"
></ng-template></div><div data-padding-forward></div>`
            }] }
];
/** @nocollapse */
UiScrollComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef }
];
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