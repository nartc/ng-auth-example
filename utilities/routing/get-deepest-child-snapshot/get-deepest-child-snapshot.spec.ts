import { ActivatedRouteSnapshot } from '@angular/router';
import { getDeepestChildSnapshot } from '@volt/common/utilities/routing';

describe('getDeepestChildSnapshot', () => {
  it('should get snapshot', () => {
    const snapshot = new ActivatedRouteSnapshot();
    defineFirstChildGetter(snapshot, null);
    const result = getDeepestChildSnapshot(snapshot);
    expect(result).toBe(snapshot);
  });

  it('should get nested child', () => {
    const childSnapshot = new ActivatedRouteSnapshot();
    defineFirstChildGetter(childSnapshot, null);
    const snapshot = new ActivatedRouteSnapshot();
    defineFirstChildGetter(snapshot, childSnapshot);
    const result = getDeepestChildSnapshot(snapshot);
    expect(result).toBe(childSnapshot);
  });

  function defineFirstChildGetter(
    snapshot: ActivatedRouteSnapshot,
    childSnapshot: ActivatedRouteSnapshot | null,
  ): void {
    Object.defineProperty(snapshot, 'firstChild', {
      get(): ActivatedRouteSnapshot | null {
        return childSnapshot;
      },
    });
  }
});
