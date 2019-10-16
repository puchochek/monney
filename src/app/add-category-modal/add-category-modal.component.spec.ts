import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryModalComponent } from './add-category-modal.component';

describe('AddCategoryModalComponent', () => {
  let component: AddCategoryModalComponent;
  let fixture: ComponentFixture<AddCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
