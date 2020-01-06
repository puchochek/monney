import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsByCategoryComponent } from './transactions-by-category.component';

describe('TransactionsByCategoryComponent', () => {
  let component: TransactionsByCategoryComponent;
  let fixture: ComponentFixture<TransactionsByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
