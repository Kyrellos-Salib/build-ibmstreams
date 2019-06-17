'use babel';

import { createEpicMiddleware, ActionsObservable, StateObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { createStore, applyMiddleware } from 'redux';
import rootEpic from '../../lib/epics/index';
import * as actions from '../../lib/actions/index';
import rootReducer from '../../lib/reducers/index';
import ResponseSelector from '../../lib/util/rest-v5-response-selector';

function getState$(store) {
  return new Observable(((observer) => {
    // emit the current state as first value:
    observer.next(store.getState());

    const unsubscribe = store.subscribe(() => {
      // emit on every new state changes
      observer.next(store.getState());
    });

    // let's return the function that will be called
    // when the Observable is unsubscribed
    return unsubscribe;
  }));
}

describe('buildAppEpic', () => {
  let store = {};
  beforeEach(() => {
    const epicMiddleware = createEpicMiddleware();
    store = createStore(rootReducer, applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
  });
  it('tests for failure', async () => {
    spyOn(ResponseSelector, 'getBuildId').andReturn(null);
    const action = ActionsObservable.of({
      type: actions.actions.ERROR,
      error: 'test error',
      sourceAction: { type: 'testSourceAction' }
    });
    const state = getState$(store);
    rootEpic(action, state)
      .subscribe((output) => {
        expect(output).toEqual();
      });
  });
});
