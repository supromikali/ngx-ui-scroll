import { Observable, Observer } from 'rxjs';

import { Scroller } from '../scroller';
import { Process, ProcessStatus } from '../interfaces/index';

export default class Fetch {

  static run(scroller: Scroller) {
    const result = Fetch.get(scroller);
    if (typeof result.subscribe !== 'function') {
      if (!result.isError) {
        Fetch.success(result.data, scroller);
      } else {
        Fetch.fail(result.error, scroller);
      }
    } else {
      scroller.innerLoopSubscriptions.push(
        result.subscribe(
          (data: Array<any>) => Fetch.success(data, scroller),
          (error: any) => Fetch.fail(error, scroller)
        )
      );
    }
  }

  static success(data: Array<any>, scroller: Scroller) {
    scroller.logger.log(() => `resolved ${data.length} items ` +
      `(index = ${scroller.state.fetch.index}, count = ${scroller.state.fetch.count})`);
    scroller.state.fetch.newItemsData = data;

    scroller.callWorkflow({
      process: Process.fetch,
      status: ProcessStatus.next
    });
  }

  static fail(error: string, scroller: Scroller) {
    scroller.callWorkflow({
      process: Process.fetch,
      status: ProcessStatus.error,
      payload: { error }
    });
  }

  static get(scroller: Scroller) {
    const _get = <Function>scroller.datasource.get;

    let immediateData, immediateError;
    let observer: Observer<any>;
    const success = (data: any) => {
      if (!observer) {
        immediateData = data || null;
        return;
      }
      observer.next(data);
      observer.complete();
    };
    const reject = (error: any) => {
      if (!observer) {
        immediateError = error || null;
        return;
      }
      observer.error(error);
    };

    const result = _get(scroller.state.fetch.index, scroller.state.fetch.count, success, reject);
    if (result && typeof result.then === 'function') { // DatasourceGetPromise
      result.then(success, reject);
    } else if (result && typeof result.subscribe === 'function') { // DatasourceGetObservable
      return result; // do not wrap observable
    }

    if (immediateData !== undefined || immediateError !== undefined) {
      return {
        data: immediateData,
        error: immediateError,
        isError: immediateError !== undefined
      };
    }

    return Observable.create((_observer: Observer<any>) => {
      observer = _observer;
    });
  }

}
