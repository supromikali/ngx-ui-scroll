import { Settings as ISettings, DevSettings as IDevSettings } from '../interfaces/index';
import { assignSettings, assignDevSettings } from '../utils/index';

export const defaultSettings: ISettings = {
  adapter: false,
  startIndex: 1,
  minIndex: -Infinity,
  maxIndex: Infinity,
  bufferSize: 5,
  padding: 0.5,
  infinite: false,
  horizontal: false,
  windowViewport: false
};

export const minSettings: ISettings = {
  itemSize: 1,
  bufferSize: 1,
  padding: 0.01
};

export const defaultDevSettings: IDevSettings = {
  debug: false, // if true, logging is enabled; need to turn off when release
  immediateLog: true, // if false, logging is not immediate and could be done via Workflow.logForce call
  logTime: false, // if true, time differences are being logged
  throttle: 40, // if > 0, scroll event handling is throttled (ms)
  inertia: false, // if true, inertia scroll delay (ms) and delta (px) are taken into the account
  inertiaScrollDelay: 125,
  inertiaScrollDelta: 35,
  initDelay: 1, // if set, the Workflow initialization will be postponed (ms)
  initWindowDelay: 40, // if set and the entire window is scrollable, the Workflow init will be postponed (ms)
  maxSynthScrollDelay: 450 // if > 0, synthetic scroll params will be reset after [value] (ms)
};

export const minDevSettings: IDevSettings = {
  throttle: 0,
  inertiaScrollDelay: 0,
  inertiaScrollDelta: 0,
  initDelay: 0,
  initWindowDelay: 0,
  maxSynthScrollDelay: 0
};

export class Settings implements ISettings {

  // user settings
  adapter: boolean;
  startIndex: number;
  minIndex: number;
  maxIndex: number;
  itemSize: number;
  bufferSize: number;
  padding: number;
  infinite: boolean;
  horizontal: boolean;
  windowViewport: boolean;

  // development settings
  debug: boolean;
  immediateLog: boolean;
  logTime: boolean;
  throttle: number;
  inertia: boolean;
  inertiaScrollDelay: number;
  inertiaScrollDelta: number;
  initDelay: number;
  initWindowDelay: number;
  maxSynthScrollDelay: number;

  // internal settings, managed by scroller itself
  instanceIndex: number;
  initializeDelay: number;

  constructor(
    settings: ISettings | undefined, devSettings: IDevSettings | undefined, instanceIndex: number
  ) {
    assignSettings(this, settings || {}, defaultSettings, minSettings);
    assignDevSettings(this, devSettings || {}, defaultDevSettings, minDevSettings);
    this.instanceIndex = instanceIndex;
    this.initializeDelay = this.getInitializeDelay();
    // todo: min/max indexes must be ignored if infinite mode is enabled ??
  }

  getInitializeDelay(): number {
    let result = 0;
    if (this.windowViewport && this.initWindowDelay && !('scrollRestoration' in history)) {
      result = this.initWindowDelay;
    }
    if (this.initDelay > 0) {
      result = Math.max(result, this.initDelay);
    }
    return result;
  }
}
