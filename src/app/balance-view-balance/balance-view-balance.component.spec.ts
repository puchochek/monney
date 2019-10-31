import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceViewBalanceComponent } from './balance-view-balance.component';

describe('BalanceViewBalanceComponent', () => {
  let component: BalanceViewBalanceComponent;
  let fixture: ComponentFixture<BalanceViewBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceViewBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceViewBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
