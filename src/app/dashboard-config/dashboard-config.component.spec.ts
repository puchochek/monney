import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConfigComponent } from './dashboard-config.component';

describe('DashboardConfigComponent', () => {
  let component: DashboardConfigComponent;
  let fixture: ComponentFixture<DashboardConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
