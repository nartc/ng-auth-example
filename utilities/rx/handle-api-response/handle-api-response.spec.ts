import { ApiResponseStatus } from '@volt/common/enums';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { handleApiResponse } from './handle-api-response';

describe('handleApiResponse', () => {
  let scheduler: TestScheduler;
  const loadingResponseFactory = (data: unknown) => ({
    status: ApiResponseStatus.Loading,
    data,
    error: '',
  });

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should stream correctly', () => {
    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
        b: { status: ApiResponseStatus.Success, data: 'foo', error: '' },
      };
      const apiResponse$ = handleApiResponse(of('foo'), null);
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should return error if sourceObs throws and rethrow is false', () => {
    scheduler.run(({ expectObservable }) => {
      const errorMessage = 'an error';
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
        b: {
          status: ApiResponseStatus.Failure,
          data: null,
          error: errorMessage,
        },
      };
      const apiResponse$ = handleApiResponse(
        throwError(new Error(errorMessage)),
        null,
      );
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should rethrow error if sourceObs throws and rethrow is true', () => {
    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(a#)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
      };
      const apiResponse$ = handleApiResponse(throwError('error'), null, true);
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should return error if sourceObs throws and errFactory is passed in', () => {
    scheduler.run(({ expectObservable }) => {
      const errorMessage = 'an error';
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
        b: {
          status: ApiResponseStatus.Failure,
          data: null,
          error: errorMessage + ' foo',
        },
      };
      const apiResponse$ = handleApiResponse(
        throwError(new Error(errorMessage)),
        null,
        (err) => (err as Error).message + ' foo',
      );
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should return error if sourceObs throws and errObsFactory is passed in', () => {
    scheduler.run(({ expectObservable }) => {
      const errorMessage = 'an error';
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
        b: {
          status: ApiResponseStatus.Failure,
          data: null,
          error: errorMessage + ' foo',
        },
      };
      const apiResponse$ = handleApiResponse(
        throwError(new Error(errorMessage)),
        null,
        (err) => of((err as Error).message + ' foo'),
      );
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });
});
