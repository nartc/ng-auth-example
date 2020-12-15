import { ApiError } from '@volt/common/api/dashboard';
import { MonitoringService } from '@volt/common/services';
import { MonoTypeOperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RootInjector } from '../../misc/root-injector/root-injector';

export function logErrorAndRethrow<TInput = any>(
  cb?: (err?: ApiError) => void,
): MonoTypeOperatorFunction<TInput> {
  const monitoringService = RootInjector.get(MonitoringService);
  return catchError((err: ApiError) => {
    console.error(err);
    monitoringService?.logApiException(err);
    cb?.(err);
    return throwError(err);
  });
}
