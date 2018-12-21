import { TestBedConfig } from '../scaffolding/runner';

// remove all non-filterIndex items in-place
export const configListDestructiveFilter = (configList: TestBedConfig[], filterIndex: number) =>
  Array.from(Array(configList.length).keys()).reverse().forEach(index =>
    !!(configList[index].datasourceDevSettings = { debug: true }) &&
    index !== filterIndex && configList.splice(index, 1)
  );
