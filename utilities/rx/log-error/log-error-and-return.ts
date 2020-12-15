import { ApiError } from '@volt/common/api/dashboard';
import { MonoTypeOperatorFunction, Observable, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { logErrorAndRethrow } from './log-error-and-rethrow';

export function logErrorAndReturn<TReturn = any>(
  obsFactory: (err?: ApiError) => Observable<TReturn>,
): MonoTypeOperatorFunction<TReturn> {
  return pipe(
    logErrorAndRethrow(),
    catchError((err: ApiError) => obsFactory(err)),
  );
}
