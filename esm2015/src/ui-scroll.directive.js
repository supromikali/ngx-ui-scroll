/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, Input, TemplateRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import version from './ui-scroll.version';
import { UiScrollComponent } from './ui-scroll.component';
export class UiScrollDirective {
    /**
     * @param {?} templateRef
     * @param {?} viewContainer
     * @param {?} resolver
     */
    constructor(templateRef, viewContainer, resolver) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    /**
     * @param {?} datasource
     * @return {?}
     */
    set uiScrollOf(datasource) {
        this.datasource = datasource;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const templateView = this.templateRef.createEmbeddedView({});
        /** @type {?} */
        const compFactory = this.resolver.resolveComponentFactory(UiScrollComponent);
        /** @type {?} */
        const componentRef = this.viewContainer.createComponent(compFactory, undefined, this.viewContainer.injector, [templateView.rootNodes]);
        componentRef.instance.datasource = this.datasource;
        componentRef.instance.template = this.templateRef;
        componentRef.instance.version = version;
    }
}
UiScrollDirective.decorators = [
    { type: Directive, args: [{ selector: '[uiScroll][uiScrollOf]' },] }
];
/** @nocollapse */
UiScrollDirective.ctorParameters = () => [
    { type: TemplateRef },
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver }
];
UiScrollDirective.propDecorators = {
    uiScrollOf: [{ type: Input }]
};
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