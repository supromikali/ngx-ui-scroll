import { TemplateRef, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Datasource } from './component/interfaces/datasource';
export declare class UiScrollDirective implements OnInit {
    private templateRef;
    private viewContainer;
    private resolver;
    private version;
    private datasource;
    constructor(templateRef: TemplateRef<any>, viewContainer: ViewContainerRef, resolver: ComponentFactoryResolver);
    uiScrollOf: Datasource;
    ngOnInit(): void;
}
