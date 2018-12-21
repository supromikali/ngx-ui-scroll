import { OnInit, OnDestroy, TemplateRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Workflow } from './component/workflow';
import { Datasource as IDatasource } from './component/interfaces/index';
import { Datasource } from './component/classes/datasource';
import { Item } from './component/classes/item';
export declare class UiScrollComponent implements OnInit, OnDestroy {
    changeDetector: ChangeDetectorRef;
    elementRef: ElementRef;
    version: string;
    template: TemplateRef<any>;
    datasource: IDatasource | Datasource;
    items: Array<Item>;
    workflow: Workflow;
    constructor(changeDetector: ChangeDetectorRef, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
