import { Direction } from '../src/component/interfaces';
import { makeTest, TestBedConfig } from './scaffolding/runner';
import { Misc } from './miscellaneous/misc';
import { ItemsCounter } from './miscellaneous/itemsCounter';

const configList: TestBedConfig[] = [{
  datasourceSettings: { startIndex: 100, bufferSize: 4, padding: 0.22, itemSize: 20 },
  templateSettings: { viewportHeight: 71, itemHeight: 20 },
  custom: { direction: Direction.forward, count: 1 }
}, {
  datasourceSettings: { startIndex: 1, bufferSize: 5, padding: 0.2, itemSize: 20 },
  templateSettings: { viewportHeight: 100 },
  custom: { direction: Direction.forward, count: 1 }
}, {
  datasourceSettings: { startIndex: -15, bufferSize: 12, padding: 0.98, itemSize: 20 },
  templateSettings: { viewportHeight: 66, itemHeight: 20 },
  custom: { direction: Direction.forward, count: 1 }
}, {
  datasourceSettings: { startIndex: 1, bufferSize: 5, padding: 1, horizontal: true, itemSize: 90 },
  templateSettings: { viewportWidth: 450, itemWidth: 90, horizontal: true },
  custom: { direction: Direction.forward, count: 1 }
}, {
  datasourceSettings: { startIndex: -74, bufferSize: 4, padding: 0.72, horizontal: true, itemSize: 75 },
  templateSettings: { viewportWidth: 300, itemWidth: 75, horizontal: true },
  custom: { direction: Direction.forward, count: 1 }
}];

configList.forEach(config => config.datasourceSettings.adapter = true);

const treatIndex = (index: number) => index <= 3 ? index : (3 * 2 - index);

const singleBackwardMaxScrollConfigList =
  configList.map((config, index) => ({
    ...config,
    custom: {
      ...config.custom,
      direction: Direction.backward
    }
  }));

const massForwardScrollsConfigList =
  configList.map((config, index) => ({
    ...config,
    custom: {
      direction: Direction.backward,
      count: 3 + treatIndex(index) // 3-6 bwd scroll events per config
    }
  }));

const massBackwardScrollsConfigList =
  massForwardScrollsConfigList.map((config, index) => ({
    ...config,
    custom: {
      direction: Direction.backward,
      count: 3 + treatIndex(index) // 3-6 fwd scroll events per config
    }
  }));

const massBouncingScrollsConfigList_fwd =
  massForwardScrollsConfigList.map((config, index) => ({
    ...config,
    custom: {
      direction: Direction.forward,
      count: (3 + treatIndex(index)) * 2, // 3-6 (fwd + bwd) scroll events per config
      bouncing: true
    }
  }));

const massBouncingScrollsConfigList_bwd =
  massForwardScrollsConfigList.map((config, index) => ({
    ...config,
    custom: {
      direction: Direction.backward,
      count: (3 + treatIndex(index)) * 2, // 3-6 (fwd + bwd) scroll events per config
      bouncing: true
    }
  }));

const massTwoDirectionalScrollsConfigList_fwd =
  massForwardScrollsConfigList.map((config, index) => ({
    ...config,
    custom: {
      direction: Direction.forward,
      count: (3 + treatIndex(index)) * 2, // 3-6 fwd + 3-6 bwd scroll events per config
      mass: true
    }
  }));

const massTwoDirectionalScrollsConfigList_bwd =
  massForwardScrollsConfigList.map((config, index) => ({
    ...config,
    custom: {
      direction: Direction.backward,
      count: (3 + treatIndex(index)) * 2, // 3-6 fwd + 3-6 bwd scroll events per config
      mass: true
    }
  }));

const doScrollMax = (config: TestBedConfig, misc: Misc) => {
  if (config.custom.direction === Direction.forward) {
    misc.scrollMax();
  } else {
    misc.scrollMin();
  }
};

const invertDirection = (config: TestBedConfig) => {
  const _forward = config.custom.direction === Direction.forward;
  config.custom.direction = _forward ? Direction.backward : Direction.forward;
};

const getInitialItemsCounter = (misc: Misc): ItemsCounter => {
  misc.fixture.detectChanges();
  const { startIndex } = misc.scroller.settings;
  const edgeItem = misc.scroller.buffer.getEdgeVisibleItem(Direction.forward);
  const oppositeEdgeItem = misc.scroller.buffer.getEdgeVisibleItem(Direction.backward);
  const result = new ItemsCounter();
  result.set(Direction.forward, {
    count: (<any>edgeItem).$index - startIndex + 1,
    index: (<any>edgeItem).$index,
    padding: 0
  });
  result.set(Direction.backward, {
    count: startIndex - (<any>oppositeEdgeItem).$index,
    index: (<any>oppositeEdgeItem).$index,
    padding: 0
  });
  return result;
};

const getFullHouseDiff = (
  viewportSize: number, paddingDelta: number, itemSize: number, bufferSize: number
): number => {
  const sizeToFill = viewportSize + 2 * paddingDelta; // size to fill the viewport + padding deltas
  const itemsToFillNotRounded = sizeToFill / itemSize;
  const itemsToFillRounded = Math.ceil(sizeToFill / itemSize);
  const itemsToFill = itemsToFillRounded + (itemsToFillNotRounded === itemsToFillRounded ? 0 : 1);
  const bufferSizeDiff = bufferSize - itemsToFill;
  return Math.max(0, bufferSizeDiff);
};

const getCurrentItemsCounter = (misc: Misc, direction: Direction, previous: ItemsCounter): ItemsCounter => {
  misc.fixture.detectChanges();
  const { bufferSize, padding } = misc.scroller.settings;
  const viewportSize = misc.scroller.viewport.getSize();
  const itemSize = misc.scroller.buffer.averageSize;
  const fwd = direction === Direction.forward;
  const opposite = fwd ? Direction.backward : Direction.forward;
  const delta = viewportSize * padding;

  // handle direction (fetch)
  const fullHouseDiff = getFullHouseDiff(viewportSize, delta, itemSize, bufferSize);
  const _singleFetchCount = Math.ceil(delta / itemSize);
  const singleFetchCount = Math.max(bufferSize, _singleFetchCount);
  const itemsToFetch = previous.direction && previous.direction !== direction ?
    (_singleFetchCount + fullHouseDiff) : singleFetchCount;
  const newDirIndex = previous.get(direction).index + // previous edge index
    (fwd ? 1 : -1) * (previous.get(direction).padding / itemSize) + // how many items are needed to fill the padding
    (fwd ? 1 : -1) * itemsToFetch; // new pack of items

  // handle opposite (clip)
  const oppPadding = previous.get(opposite).padding;
  const previousTotalSize = previous.total * itemSize + previous.paddings;
  const sizeToClip = previousTotalSize - oppPadding - viewportSize - delta;
  const itemsToClip = Math.floor(sizeToClip / itemSize);
  const newOppIndex = previous.get(opposite).index + (fwd ? 1 : -1) * itemsToClip;
  const newOppPadding = itemsToClip * itemSize + oppPadding;

  const result = new ItemsCounter(direction);
  result.set(direction, {
    index: newDirIndex,
    padding: 0
  });
  result.set(opposite, {
    index: newOppIndex,
    padding: newOppPadding
  });
  return result;
};

const shouldScroll = (config: TestBedConfig) => (misc: Misc) => (done: Function) => {
  const custom = config.custom;
  const wfCount = custom.count + 1;
  const wfCountMiddle = Math.ceil(wfCount / 2);
  let itemsCounter: ItemsCounter;

  spyOn(misc.workflow, 'finalize').and.callFake(() => {
    const cycles = misc.workflow.cyclesDone;
    if (cycles === 1) {
      itemsCounter = getInitialItemsCounter(misc);
    } else {
      itemsCounter = getCurrentItemsCounter(misc, custom.direction, itemsCounter);
    }
    if (cycles < wfCount) {
      if (custom.bouncing) {
        invertDirection(config);
      } else if (custom.mass) {
        if (cycles === wfCountMiddle) {
          invertDirection(config);
        }
      }
      doScrollMax(config, misc);
    } else {
      // expectations
      const direction = custom.direction;
      const opposite = direction === Direction.forward ? Direction.backward : Direction.forward;
      const edgeItem = misc.scroller.buffer.getEdgeVisibleItem(direction);
      const oppositeEdgeItem = misc.scroller.buffer.getEdgeVisibleItem(opposite);
      const edgeItemIndex = itemsCounter.get(direction).index;
      const edgeOppositeItemIndex = itemsCounter.get(opposite).index;
      expect(edgeItem && edgeItem.$index).toEqual(edgeItemIndex);
      expect(oppositeEdgeItem && oppositeEdgeItem.$index).toEqual(edgeOppositeItemIndex);
      expect((<any>misc.padding)[direction].getSize()).toEqual(itemsCounter.get(direction).padding);
      expect((<any>misc.padding)[opposite].getSize()).toEqual(itemsCounter.get(opposite).padding);
      expect(misc.checkElementContentByIndex(edgeItemIndex)).toEqual(true);
      expect(misc.checkElementContentByIndex(edgeOppositeItemIndex)).toEqual(true);
      done();
    }
  });
};

describe('Basic Scroll Spec', () => {

  describe('Single max fwd scroll event', () =>
    configList.forEach(config =>
      makeTest({
        config,
        title: 'should process 1 forward max scroll',
        it: shouldScroll(config)
      })
    )
  );

  describe('Single max bwd scroll event', () =>
    singleBackwardMaxScrollConfigList.forEach(config =>
      makeTest({
        config,
        title: 'should process 1 backward max scroll',
        it: shouldScroll(config)
      })
    )
  );

  describe('Mass max fwd scroll events', () =>
    massForwardScrollsConfigList.forEach(config =>
      makeTest({
        config,
        title: 'should process some forward scrolls',
        it: shouldScroll(config)
      })
    )
  );

  describe('Mass max bwd scroll events', () =>
    massBackwardScrollsConfigList.forEach(config =>
      makeTest({
        config,
        title: 'should process some backward scrolls',
        it: shouldScroll(config)
      })
    )
  );

  describe('Bouncing max two-directional scroll events (fwd started)', () =>
    massBouncingScrollsConfigList_fwd.forEach(config =>
      makeTest({
        config,
        title: 'should process some bouncing scrolls',
        it: shouldScroll(config)
      })
    )
  );

  describe('Bouncing max two-directional scroll events (bwd started)', () =>
    massBouncingScrollsConfigList_bwd.forEach(config =>
      makeTest({
        config,
        title: 'should process some bouncing scrolls',
        it: shouldScroll(config)
      })
    )
  );

  describe('Mass max two-directional scroll events (fwd started)', () =>
    massTwoDirectionalScrollsConfigList_fwd.forEach(config =>
      makeTest({
        config,
        title: 'should process some two-directional scrolls',
        it: shouldScroll(config)
      })
    )
  );

  describe('Mass max two-directional scroll events (bwd started)', () =>
    massTwoDirectionalScrollsConfigList_bwd.forEach(config =>
      makeTest({
        config,
        title: 'should process some two-directional scrolls',
        it: shouldScroll(config)
      })
    )
  );

});

