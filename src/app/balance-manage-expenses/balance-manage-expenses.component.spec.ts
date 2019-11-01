import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceManageExpensesComponent } from './balance-manage-expenses.component';

describe('BalanceManageExpensesComponent', () => {
  let component: BalanceManageExpensesComponent;
  let fixture: ComponentFixture<BalanceManageExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceManageExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceManageExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
