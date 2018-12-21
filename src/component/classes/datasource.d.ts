import { Datasource as IDatasource, DatasourceGet, DevSettings, Settings, Adapter as IAdapter } from '../interfaces/index';
export declare class Datasource implements IDatasource {
    readonly constructed: boolean;
    get: DatasourceGet;
    settings?: Settings;
    devSettings?: DevSettings;
    adapter: IAdapter;
    constructor(datasource: IDatasource, hasNoAdapter?: boolean);
}
