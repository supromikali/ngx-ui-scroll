import { Item } from './item';
import { Direction } from '../interfaces/index';

export class FetchModel {
  private _newItemsData: Array<any> | null;
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

  constructor() {
    this.callCount = 0;
    this.reset();
  }

  reset() {
    this._newItemsData = null;
    this.items = [];
    this.firstIndexBuffer = null;
    this.lastIndexBuffer = null;
    this.firstIndex = null;
    this.lastIndex = null;
    this.hasAnotherPack = false;
    this.negativeSize = 0;
    this.direction = null;
    this.isPrepend = false;
  }

  get newItemsData(): Array<Item> | null {
    return this._newItemsData;
  }

  set newItemsData(items: Array<Item> | null) {
    this._newItemsData = items;
    this.callCount++;
  }

  get shouldFetch(): boolean {
    return !!this.count;
  }

  get hasNewItems(): boolean {
    return !!((this._newItemsData && this._newItemsData.length));
  }

  get index(): number | null {
    return this.firstIndex;
  }

  get count(): number {
    return this.firstIndex !== null && this.lastIndex !== null ? this.lastIndex - this.firstIndex + 1 : 0;
  }
}
