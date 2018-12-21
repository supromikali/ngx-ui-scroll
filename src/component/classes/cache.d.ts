import { Item } from './item';
import { Logger } from './logger';
export declare class ItemCache {
    $index: number;
    nodeId: string;
    data: any;
    size: number;
    position: number;
    constructor(item: Item);
}
export declare class RecalculateAverage {
    newItems: Array<number>;
    oldItems: Array<number>;
    constructor();
    reset(): void;
}
export declare class Cache {
    averageSizeFloat: number;
    averageSize: number;
    minIndex: number;
    maxIndex: number;
    recalculateAverage: RecalculateAverage;
    private items;
    readonly logger: Logger;
    readonly itemSize: number;
    constructor(itemSize: number, logger: Logger);
    reset(): void;
    recalculateAverageSize(): void;
    add(item: Item): ItemCache;
    getItemSize(index: number): number;
    get(index: number): ItemCache | undefined;
}
