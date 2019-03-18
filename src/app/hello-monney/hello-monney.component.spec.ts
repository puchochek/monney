import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloMonneyComponent } from './hello-monney.component';

describe('HelloMonneyComponent', () => {
  let component: HelloMonneyComponent;
  let fixture: ComponentFixture<HelloMonneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelloMonneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloMonneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
