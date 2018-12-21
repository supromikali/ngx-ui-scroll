import { Routines } from './domRoutines';
import { Direction } from '../interfaces/index';

export class Item {
  $index: number;
  data: any;
  nodeId: string;
  routines: Routines;

  element: HTMLElement;
  size: number;
  invisible: boolean;
  toRemove: boolean;
  removeDirection: Direction;

  constructor($index: number, data: any, routines: Routines) {
    this.$index = $index;
    this.data = data;
    this.nodeId = String($index);
    this.routines = routines;
    this.invisible = true;
  }

  setSize() {
    this.size = this.routines.getSize(this.element);
  }

  hide() {
    if (this.element) {
      this.routines.hideElement(this.element);
    }
  }
}
