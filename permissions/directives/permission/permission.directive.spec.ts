import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  PermissionModule,
  PermissionStateService,
} from '@volt/common/permissions';
import { PermissionDirective } from './permission.directive';

describe('PermissionDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  function getComponent(): TestComponent {
    return fixture.componentInstance;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [PermissionModule],
    });
  });

  afterEach(() => {
    fixture = null;
  });

  it('should create an instance when used on a template', () => {
    fixture = createTestComponent('<div *permission="[]"></div>');
    const directive = fixture.debugElement
      .queryAllNodes(By.directive(PermissionDirective))
      .pop();
    expect(directive).toBeTruthy();
  });

  it('should render with empty []', () => {
    fixture = createTestComponent('<div *permission="[]"></div>');
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div'))).toHaveLength(1);
  });

  it('should render with proper permission', () => {
    fixture = createTestComponent(`<div *permission="['foo', 1]"></div>`);
    const spiedHasPermission = jest
      .spyOn(TestBed.inject(PermissionStateService), 'hasPermission')
      .mockReturnValueOnce(true);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div'))).toHaveLength(1);
    expect(spiedHasPermission).toHaveBeenCalled();
  });

  it('should render with proper permission and truthy extra condition', () => {
    fixture = createTestComponent(
      `<div *permission="['foo', 1, extraCondition]"></div>`,
    );
    const spiedHasPermission = jest
      .spyOn(TestBed.inject(PermissionStateService), 'hasPermission')
      .mockReturnValueOnce(true);

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div'))).toHaveLength(1);
    expect(spiedHasPermission).toHaveBeenCalled();
  });

  it('should not render with falsy permission', () => {
    fixture = createTestComponent(`<div *permission="['foo', 1]"></div>`);
    const spiedHasPermission = jest
      .spyOn(TestBed.inject(PermissionStateService), 'hasPermission')
      .mockReturnValueOnce(false);

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div'))).toHaveLength(0);
    expect(spiedHasPermission).toHaveBeenCalled();
  });

  it('should not render with falsy permission and falsy condition', () => {
    fixture = createTestComponent(
      `<div *permission="['foo', 1, extraFalsyCondition]"></div>`,
    );
    const spiedHasPermission = jest
      .spyOn(TestBed.inject(PermissionStateService), 'hasPermission')
      .mockReturnValueOnce(false);

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div'))).toHaveLength(0);
    expect(spiedHasPermission).toHaveBeenCalled();
  });

  it('should not render with truthy permission and falsy condition', () => {
    fixture = createTestComponent(
      `<div *permission="['foo', 1, extraFalsyCondition]"></div>`,
    );
    const spiedHasPermission = jest
      .spyOn(TestBed.inject(PermissionStateService), 'hasPermission')
      .mockReturnValueOnce(true);

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div'))).toHaveLength(0);
    expect(spiedHasPermission).toHaveBeenCalled();
  });

  it('should not render with falsy permission and truthy condition', () => {
    fixture = createTestComponent(
      `<div *permission="['foo', 1, extraCondition]"></div>`,
    );
    const spiedHasPermission = jest
      .spyOn(TestBed.inject(PermissionStateService), 'hasPermission')
      .mockReturnValueOnce(false);

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div'))).toHaveLength(0);
    expect(spiedHasPermission).toHaveBeenCalled();
  });

  it('should support else', () => {
    fixture = createTestComponent(
      `
<div *permission="['foo', 1, extraFalsyCondition];else elseBlock">true</div>
<ng-template #elseBlock>FALSE</ng-template>
`,
    );
    const spiedHasPermission = jest
      .spyOn(TestBed.inject(PermissionStateService), 'hasPermission')
      .mockReturnValueOnce(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML).not.toContain('true');
    expect(fixture.nativeElement.innerHTML).toContain('FALSE');
    expect(spiedHasPermission).toHaveBeenCalled();

    getComponent().extraFalsyCondition = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML).toContain('true');
    expect(fixture.nativeElement.innerHTML).not.toContain('FALSE');
    expect(spiedHasPermission).toHaveBeenCalledTimes(2);
  });
});

@Component({
  template: '',
  selector: 'volt-tmp-cmp',
})
class TestComponent {
  extraCondition = true;
  extraFalsyCondition = false;
}

function createTestComponent(
  template: string,
): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, {
    set: { template },
  }).createComponent(TestComponent);
}
