import { LocalStorageService } from '@volt/common/services';

describe('LocalStorageService', () => {
  describe('initialization', () => {
    it('should be created', () => {
      const service = new LocalStorageService();
      expect(service).toBeTruthy();
      expect(service.localStorage).toBeTruthy();
      expect(service.isEnabled).toBe(true);
    });
  });

  describe('implementations', () => {
    let service: LocalStorageService;

    beforeEach(() => {
      service = new LocalStorageService();
    });

    it('should set', () => {
      service.set('foo', 'bar');
      expect(service.localStorage.getItem('foo')).toBe('bar');
    });

    it('should get', () => {
      service.set('foo', 'bar');
      expect(service.get('foo')).toBe('bar');
    });

    it('should set object', () => {
      service.setObject('foo', { bar: 'bar' });
      expect(service.localStorage.getItem('foo')).toBe(`{"bar":"bar"}`);
    });

    it('should get object', () => {
      service.setObject('foo', { bar: 'bar' });
      expect(service.getObject<{ bar: string }>('foo')).toEqual({
        bar: 'bar',
      });
    });

    it('should remove', () => {
      service.set('foo', 'bar');
      expect(service.get('foo')).toBe('bar');
      service.remove('foo');
      expect(service.get('foo')).toBeFalsy();
    });

    it('should clear', () => {
      service.set('foo', '1');
      service.setObject('bar', 2);
      service.clear();
      expect(service.get('foo')).toBeFalsy();
      expect(service.getObject('bar')).toBeFalsy();
    });
  });
});
