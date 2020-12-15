import { combineLatest, isObservable, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export function vmFromLatest<TVm extends {}, TComputedVm extends {} = never>(
  vmBase: { [K in keyof TVm]: Observable<TVm[K]> },
  computeFunction?: (
    vmBaseReturn: TVm,
  ) => TComputedVm | Observable<TComputedVm>,
): Observable<TVm & TComputedVm> {
  const vmBaseKeys = Object.keys(vmBase);
  const vmBaseValues = Object.values(vmBase);
  return combineLatest(vmBaseValues).pipe(
    switchMap((responses) => {
      const returnVm = vmBaseKeys.reduce((vm, key, index) => {
        vm[key] = responses[index];
        return vm;
      }, {} as TVm);
      if (computeFunction) {
        const computedVm = computeFunction(returnVm);
        if (isObservable(computedVm)) {
          return computedVm.pipe(
            map((computed) => Object.assign(returnVm, computed)),
          );
        }
        return of(Object.assign(returnVm, computedVm));
      }

      return of(returnVm as TVm & TComputedVm);
    }),
  );
}
