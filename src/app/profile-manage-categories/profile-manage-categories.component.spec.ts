import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileManageCategoriesComponent } from './profile-manage-categories.component';

describe('ProfileManageCategoriesComponent', () => {
  let component: ProfileManageCategoriesComponent;
  let fixture: ComponentFixture<ProfileManageCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileManageCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileManageCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
