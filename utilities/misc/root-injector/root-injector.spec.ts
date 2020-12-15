import { InjectionToken, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RootInjector } from './root-injector';

describe('RootInjector', () => {
  const injectionToken = new InjectionToken('token');
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: injectionToken, useValue: 'token' }],
    });
    RootInjector.setInjector(TestBed.inject(Injector));
  });

  it('should be able to get value', () => {
    const token = RootInjector.get(injectionToken);
    expect(token).toBe(TestBed.inject(injectionToken));
  });
});
