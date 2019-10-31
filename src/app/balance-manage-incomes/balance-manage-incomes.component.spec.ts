import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceManageIncomesComponent } from './balance-manage-incomes.component';

describe('BalanceManageIncomesComponent', () => {
  let component: BalanceManageIncomesComponent;
  let fixture: ComponentFixture<BalanceManageIncomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceManageIncomesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceManageIncomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
