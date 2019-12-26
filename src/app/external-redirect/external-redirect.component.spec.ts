import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalRedirectComponent } from './external-redirect.component';

describe('ExternalRedirectComponent', () => {
  let component: ExternalRedirectComponent;
  let fixture: ComponentFixture<ExternalRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
