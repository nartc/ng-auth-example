import { vmFromLatest } from '@volt/common/utilities/rx';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('vmFromLatest', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should stream correctly', () => {
    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(a|)';
      const expectedResponse = {
        a: {
          foo: 'foo',
          bar: 'bar',
        },
      };
      const vm$ = vmFromLatest({
        foo: of('foo'),
        bar: of('bar'),
      });
      expectObservable(vm$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should stream correctly with computeFn', () => {
    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(a|)';
      const expectedResponse = {
        a: {
          foo: 'foo',
          bar: 'bar',
          computed: 'foo bar',
        },
      };
      const vm$ = vmFromLatest(
        {
          foo: of('foo'),
          bar: of('bar'),
        },
        ({ foo, bar }) => ({ computed: foo + ' ' + bar }),
      );
      expectObservable(vm$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should stream correctly with computeFn returning Observable', () => {
    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(a|)';
      const expectedResponse = {
        a: {
          foo: 'foo',
          bar: 'bar',
          computed: 'streamed foo bar',
        },
      };
      const vm$ = vmFromLatest(
        {
          foo: of('foo'),
          bar: of('bar'),
        },
        ({ foo, bar }) => of({ computed: `streamed ${foo} ${bar}` }),
      );
      expectObservable(vm$).toBe(expectedMarble, expectedResponse);
    });
  });
});
