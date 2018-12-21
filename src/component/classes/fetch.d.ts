import { Item } from './item';
import { Direction } from '../interfaces/index';
export declare class FetchModel {
    private _newItemsData;
    items: Array<Item>;
    firstIndexBuffer: number | null;
    lastIndexBuffer: number | null;
    firstIndex: number | null;
    lastIndex: number | null;
    hasAnotherPack: boolean;
    callCount: number;
    minIndex: number;
    negativeSize: number;
    averageItemSize: number;
    direction: Direction | null;
    isPrepend: boolean;
    constructor();
    reset(): void;
    newItemsData: Array<Item> | null;
    readonly shouldFetch: boolean;
    readonly hasNewItems: boolean;
    readonly index: number | null;
    readonly count: number;
}
