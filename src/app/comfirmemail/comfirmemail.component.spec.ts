import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmemailComponent } from './comfirmemail.component';

describe('ComfirmemailComponent', () => {
  let component: ComfirmemailComponent;
  let fixture: ComponentFixture<ComfirmemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComfirmemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
