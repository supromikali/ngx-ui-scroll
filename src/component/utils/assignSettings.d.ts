import { Settings as _ISettings, DevSettings as _IDevSettings } from '../interfaces/index';
import { Settings } from '../classes/settings';
export declare const assignSettings: (target: Settings, settings: _ISettings, defaults: _ISettings, minSettings: _ISettings) => void;
export declare const assignDevSettings: (target: Settings, devSettings: _IDevSettings, defaults: _IDevSettings, minDevSettings: _IDevSettings) => void;
