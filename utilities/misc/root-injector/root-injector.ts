import { InjectFlags, InjectionToken, Injector, Type } from '@angular/core';

export class RootInjector {
  private static rootInjector: Injector;

  static setInjector(injector: Injector): void {
    if (this.rootInjector) {
      return;
    }

    this.rootInjector = injector;
  }

  static get<T>(
    token: Type<T> | InjectionToken<T>,
    notFoundValue?: T,
    flags?: InjectFlags,
  ): T | null {
    try {
      return this.rootInjector?.get(token, notFoundValue, flags);
    } catch (e) {
      console.error(
        `Error getting ${token} from RootInjector. This is likely due to RootInjector is undefined. Please check RootInjector.rootInjector value.`,
      );
      return null;
    }
  }
}
