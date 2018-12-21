/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, Input, TemplateRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import version from './ui-scroll.version';
import { UiScrollComponent } from './ui-scroll.component';
var UiScrollDirective = /** @class */ (function () {
    function UiScrollDirective(templateRef, viewContainer, resolver) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    Object.defineProperty(UiScrollDirective.prototype, "uiScrollOf", {
        set: /**
         * @param {?} datasource
         * @return {?}
         */
        function (datasource) {
            this.datasource = datasource;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    UiScrollDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var templateView = this.templateRef.createEmbeddedView({});
        /** @type {?} */
        var compFactory = this.resolver.resolveComponentFactory(UiScrollComponent);
        /** @type {?} */
        var componentRef = this.viewContainer.createComponent(compFactory, undefined, this.viewContainer.injector, [templateView.rootNodes]);
        componentRef.instance.datasource = this.datasource;
        componentRef.instance.template = this.templateRef;
        componentRef.instance.version = version;
    };
    UiScrollDirective.decorators = [
        { type: Directive, args: [{ selector: '[uiScroll][uiScrollOf]' },] }
    ];
    /** @nocollapse */
    UiScrollDirective.ctorParameters = function () { return [
        { type: TemplateRef },
        { type: ViewContainerRef },
        { type: ComponentFactoryResolver }
    ]; };
    UiScrollDirective.propDecorators = {
        uiScrollOf: [{ type: Input }]
    };
    return UiScrollDirective;
}());
export { UiScrollDirective };
if (false) {
    /** @type {?} */
    UiScrollDirective.prototype.version;
    /** @type {?} */
    UiScrollDirective.prototype.datasource;
    /** @type {?} */
    UiScrollDirective.prototype.templateRef;
    /** @type {?} */
    UiScrollDirective.prototype.viewContainer;
    /** @type {?} */
    UiScrollDirective.prototype.resolver;
}
//# sourceMappingURL=ui-scroll.directive.js.map