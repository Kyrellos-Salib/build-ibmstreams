'use babel';

import { createEpicMiddleware, ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import * as operators from 'rxjs/operators';
import { createStore, applyMiddleware } from 'redux';
import rootEpic from '../../lib/epics/index';
import * as actions from '../../lib/actions/index';
import rootReducer from '../../lib/reducers/index';
import MessageHandler from '../../lib/MessageHandler';
import MessageHandlerRegistry from '../../lib/message-handler-registry';
import {
  StateSelector,
  ResponseSelector,
  StreamsRestUtils,
  SourceArchiveUtils,
  StatusUtils,
  StreamsToolkitsUtils,
  KeychainUtils
} from '../../lib/util';

function getState$(store) {
  return new Observable(((observer) => {
    observer.next(store.getState());
    const unsubscribe = store.subscribe(() => {
      observer.next(store.getState());
    });
    return unsubscribe;
  }));
}

describe('Epics', () => {
  describe('errorHandlingEpic', () => {
    let store = {};
    beforeEach(() => {
      const epicMiddleware = createEpicMiddleware();
      store = createStore(rootReducer, applyMiddleware(epicMiddleware));
      epicMiddleware.run(rootEpic);
    });
    it('should handle the case where a default MessageHandler is missing', () => {
      const action = ActionsObservable.of({
        type: actions.actions.ERROR,
        error: 'test error',
        sourceAction: { type: 'testSourceAction' }
      });
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.ERROR, sourceAction: action, error: new TypeError() };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
    it('should create error messages ', () => {
      const action = ActionsObservable.of({
        type: actions.actions.ERROR,
        error: 'test error',
        sourceAction: { type: 'testSourceAction' }
      });
      const ms = new MessageHandler(console);
      MessageHandlerRegistry.setDefault(ms);
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.POST_ERROR };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
  });
  describe('buildAppEpic', () => {
    let store = {};
    beforeEach(() => {
      const epicMiddleware = createEpicMiddleware();
      store = createStore(rootReducer, applyMiddleware(epicMiddleware));
      epicMiddleware.run(rootEpic);
    });
    it('should handle success ', () => {
      spyOn(ResponseSelector, 'getBuildId').andReturn('001');
      spyOn(StateSelector, 'getNewBuild').andReturn({
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake'
      });

      const action = ActionsObservable.of({
        type: actions.actions.NEW_BUILD,
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake',
        postBuildAction: { type: 'TEST' }
      });

      spyOn(StreamsRestUtils.build, 'create').andReturn(action);

      const state = getState$(store);
      const expectedOutput = {
        type: actions.actions.BUILD_UPLOAD_SOURCE,
        buildId: '001',
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake'
      };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
    it('should handle failure if StreamsRestUtils.build.create fails', () => {
      spyOn(ResponseSelector, 'getBuildId').andReturn('001');
      spyOn(StateSelector, 'getNewBuild').andReturn({
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake'
      });

      const action = ActionsObservable.of({
        type: actions.actions.NEW_BUILD,
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake',
        postBuildAction: { type: 'TEST' }
      });

      spyOn(StreamsRestUtils.build, 'create').andReturn(null);

      const state = getState$(store);
      const expectedOutput = { type: actions.actions.ERROR, sourceAction: action, error: new TypeError() };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
    it('should handle failure if ResponseSelector.getBuildId fails', () => {
      spyOn(ResponseSelector, 'getBuildId').andReturn(null);
      spyOn(StateSelector, 'getNewBuild').andReturn({
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake'
      });

      const action = ActionsObservable.of({
        type: actions.actions.NEW_BUILD,
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake',
        postBuildAction: { type: 'TEST' }
      });

      spyOn(StreamsRestUtils.build, 'create').andReturn(action);

      const state = getState$(store);
      const expectedOutput = {
        type: actions.actions.ERROR,
        sourceAction: {
          type: actions.actions.NEW_BUILD,
          appRoot: 'testRoot',
          toolkitRootPath: 'testToolkit',
          fqn: 'testFqn',
          makefilePath: 'testMake',
          postBuildAction: { type: 'TEST' }
        },
        error: new Error()
      };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
    it('should handle failure if StateSelector.getNewBuild fails', () => {
      spyOn(ResponseSelector, 'getBuildId').andReturn('001');
      spyOn(StateSelector, 'getNewBuild').andReturn(null);

      const action = ActionsObservable.of({
        type: actions.actions.NEW_BUILD,
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake',
        postBuildAction: { type: 'TEST' }
      });

      spyOn(StreamsRestUtils.build, 'create').andReturn(action);

      const state = getState$(store);
      const expectedOutput = {
        type: actions.actions.ERROR,
        sourceAction: {
          type: actions.actions.NEW_BUILD,
          appRoot: 'testRoot',
          toolkitRootPath: 'testToolkit',
          fqn: 'testFqn',
          makefilePath: 'testMake',
          postBuildAction: { type: 'TEST' }
        },
        error: new TypeError()
      };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
  });
  describe('uploadSourceEpic', () => {
    let store = {};
    beforeEach(() => {
      const epicMiddleware = createEpicMiddleware();
      store = createStore(rootReducer, applyMiddleware(epicMiddleware));
      epicMiddleware.run(rootEpic);
    });
    it('should handle success', () => {
      spyOn(SourceArchiveUtils, 'buildSourceArchive').andReturn(ActionsObservable.of({ type: actions.actions.SOURCE_ARCHIVE_CREATED, archivePath: 'testPath', buildId: '001' }));
      const action = ActionsObservable.of({
        type: actions.actions.BUILD_UPLOAD_SOURCE,
        buildId: '001',
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake'
      });
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.SOURCE_ARCHIVE_CREATED, archivePath: 'testPath', buildId: '001' };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
    it('should handle failure if SourceArchiveUtils.buildSourceArchive fails', () => {
      spyOn(SourceArchiveUtils, 'buildSourceArchive').andReturn({ archivePromise: Promise.reject(new Error('failed')), archivePath: 'testPath', buildId: '001' }); /* eslint-disable-line compat/compat */
      const action = ActionsObservable.of({
        type: actions.actions.BUILD_UPLOAD_SOURCE,
        buildId: '001',
        appRoot: 'testRoot',
        toolkitRootPath: 'testToolkit',
        fqn: 'testFqn',
        makefilePath: 'testMake'
      });
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.ERROR, sourceAction: action, error: new TypeError() };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
  });
  describe('sourceArchiveCreatedEpic', () => {
    let store = {};
    beforeEach(() => {
      const epicMiddleware = createEpicMiddleware();
      store = createStore(rootReducer, applyMiddleware(epicMiddleware));
      epicMiddleware.run(rootEpic);
    });
    it('should handle success', () => {
      const action = ActionsObservable.of({
        type: actions.actions.SOURCE_ARCHIVE_CREATED,
        buildId: '001',
        archivePath: 'testPath'
      });
      spyOn(StreamsRestUtils.build, 'uploadSource').andReturn(action);
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.START_BUILD, buildId: '001' };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
    it('should handle failure if StreamsRestUtils.build.uploadSource fails', () => {
      const action = ActionsObservable.of({
        type: actions.actions.SOURCE_ARCHIVE_CREATED,
        buildId: '001',
        archivePath: 'testPath'
      });
      spyOn(StreamsRestUtils.build, 'uploadSource').andReturn(null);
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.ERROR, sourceAction: action, error: new TypeError() };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
  });
  describe('startBuildEpic', () => {
    let store = {};
    beforeEach(() => {
      const epicMiddleware = createEpicMiddleware();
      store = createStore(rootReducer, applyMiddleware(epicMiddleware));
      epicMiddleware.run(rootEpic);
    });
    it('should handle success', () => {
      const action = ActionsObservable.of({
        type: actions.actions.START_BUILD,
        buildId: '001',
      });
      spyOn(operators, 'delay').andReturn((val) => val);
      spyOn(StreamsRestUtils.build, 'start').andReturn(action);
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.GET_BUILD_STATUS, buildId: '001' };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
    it('should handle failure if StreamsRestUtils.build.start fails', () => {
      const action = ActionsObservable.of({
        type: actions.actions.START_BUILD,
        buildId: '001',
      });
      spyOn(StreamsRestUtils.build, 'start').andReturn(null);
      const state = getState$(store);
      const expectedOutput = { type: actions.actions.ERROR, sourceAction: action, error: new TypeError() };
      rootEpic(action, state)
        .subscribe((output) => {
          expect(output).toEqual(expectedOutput);
        });
    });
  });
});
