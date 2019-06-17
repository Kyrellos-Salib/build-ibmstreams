'use babel';

import { TestScheduler } from 'rxjs/testing';
import rootEpic from '../../lib/epics/index';
import * as actions from '../../lib/actions/index';
import ResponseSelector from '../../lib/util/rest-v5-response-selector';

describe('Epics', () => {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  describe('buildAppEpic', () => {
    it('should handle failure', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const state = {};
        const action = hot('a', {
          a: {
            type: actions.actions.ERROR,
            sourceAction: { type: 'TEST' },
            error: 'Error testing'
          }
        });
        spyOn(ResponseSelector, 'getBuildId').andReturn(null);
        const output = rootEpic(action, state);
        expectObservable(output).toBe('-a', {
          a: {
            type: actions.actions.POST_ERROR
          }
        });
      });
    });
  });
});
