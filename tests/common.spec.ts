import { async } from '@angular/core/testing';

import { Settings, Direction } from '../src/component/interfaces';
import { defaultSettings } from '../src/component/classes/settings';

import { configureTestBed } from './scaffolding/testBed';
import { defaultDatasourceClass } from './scaffolding/datasources';
import { defaultTemplate } from './scaffolding/templates';
import { Misc } from './miscellaneous/misc';
import { makeTest } from './scaffolding/runner';

describe('Common Spec', () => {
  let misc: Misc;

  describe('Initialization', () => {

    let reconfigure = true;

    beforeEach(async(() => {
      if (!reconfigure) {
        return;
      }
      reconfigure = false;
      const fixture = configureTestBed(defaultDatasourceClass, defaultTemplate);
      misc = new Misc(fixture);
    }));

    it('should init test component', () => {
      expect(misc.testComponent).toBeTruthy();
    });

    it('should provide datasource', () => {
      expect(misc.datasource).toEqual(jasmine.any(Object));
      expect(misc.datasource.get).toEqual(jasmine.any(Function));
    });

    it('should init ui-scroll', () => {
      expect(misc.uiScrollElement).toBeTruthy();
      expect(misc.uiScrollComponent).toBeTruthy();
    });

    it('should init padding elements', () => {
      expect(misc.padding[Direction.backward].element).toBeTruthy();
      expect(misc.padding[Direction.forward].element).toBeTruthy();
    });

  });

  describe('Settings', () => {

    const _settings1 = { startIndex: 90 };
    const _settings2 = { bufferSize: 15 };
    const _settings3 = { startIndex: 99, bufferSize: 11 };

    const checkSettings = (_settings) => (misc) => (done) => {
      expect(misc.workflow.settings).toEqual(jasmine.any(Object));
      const mergedSettings = { ...defaultSettings, ..._settings };
      Object.keys(defaultSettings).forEach(key => {
        expect(misc.workflow.settings[key]).toEqual(mergedSettings[key]);
      });
      done();
    };

    makeTest({
      config: { datasourceSettings: _settings1 },
      title: 'should override startIndex',
      it: checkSettings(_settings1)
    });

    makeTest({
      config: { datasourceSettings: _settings2 },
      title: 'should override bufferSize',
      it: checkSettings(_settings2)
    });

    makeTest({
      config: { datasourceSettings: _settings3 },
      title: 'should override startIndex and bufferSize',
      it: checkSettings(_settings3)
    });

    makeTest({
      config: { datasourceName: 'default-bad-settings' },
      title: 'should fallback to default',
      it: checkSettings({})
    });

  });

});

describe('Bad datasource', () => {

  makeTest({
    config: {
      datasourceClass: 'invalid',
      throw: true
    },
    title: 'should throw exception (datasource is not a constructor)',
    it: (error) => (done) => {
      expect(error).toBe('datasource is not a constructor');
      done();
    }
  });

  makeTest({
    config: {
      datasourceClass: class {
        settings: Settings;
        constructor() {
          this.settings = { };
        }
      },
      throw: true
    },
    title: 'should throw exception (no get)',
    it: (error) => (done) => {
      expect(error).toBe('Datasource get method is not implemented');
      done();
    }
  });

  makeTest({
    config: {
      datasourceClass: class {
        settings: Settings;
        get: boolean;
        constructor() {
          this.settings = {};
          this.get = true;
        }
      },
      throw: true
    },
    title: 'should throw exception (get is not a function)',
    it: (error) => (done) => {
      expect(error).toBe('Datasource get is not a function');
      done();
    }
  });

  makeTest({
    config: {
      datasourceClass: class {
        settings: Settings;
        constructor() {
          this.settings = {};
        }
        get(offset) {};
      },
      throw: true
    },
    title: 'should throw exception (get has less than 2 arguments)',
    it: (error) => (done) => {
      expect(error).toBe('Datasource get method invalid signature');
      done();
    }
  });

});
