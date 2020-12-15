import { ApiResponseStatus } from '@volt/common/enums';
import { ApiResponse } from '@volt/common/models';
import { isObservable, Observable, of, throwError } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { logErrorAndReturn } from '../log-error/log-error-and-return';

export function handleApiResponse<TData>(
  apiCall: Observable<TData>,
  initialValue: TData,
  errObsFactoryOrRethrow?:
    | true
    | ((err: unknown) => unknown | Observable<unknown>),
): Observable<ApiResponse<TData>> {
  return apiCall.pipe(
    map((data) => ({
      status: ApiResponseStatus.Success,
      data,
      error: '',
    })),
    startWith({
      status: ApiResponseStatus.Loading,
      data: initialValue,
      error: '',
    }),
    logErrorAndReturn((err) => {
      const defaultFailureResponse = {
        status: ApiResponseStatus.Failure,
        data: initialValue,
      };

      if (errObsFactoryOrRethrow == null) {
        return of<ApiResponse<TData>>({
          ...defaultFailureResponse,
          error: err.error || err.title || err.toString(),
        });
      }

      if (typeof errObsFactoryOrRethrow === 'function') {
        const error = errObsFactoryOrRethrow(err);
        if (isObservable(error)) {
          return error.pipe(
            map<unknown, ApiResponse<TData>>((e) => ({
              ...defaultFailureResponse,
              error: e,
            })),
          );
        }

        return of<ApiResponse<TData>>({
          ...defaultFailureResponse,
          error,
        });
      }

      return throwError(err);
    }),
  );
}
