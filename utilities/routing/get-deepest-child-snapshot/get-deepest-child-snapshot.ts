import { ActivatedRouteSnapshot } from '@angular/router';

export function getDeepestChildSnapshot(
  snapshot: ActivatedRouteSnapshot,
): ActivatedRouteSnapshot {
  let deepestChild = snapshot.firstChild;
  while (deepestChild?.firstChild != null) {
    deepestChild = deepestChild.firstChild;
  }
  return deepestChild || snapshot;
}
