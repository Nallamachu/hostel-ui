import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHostelComponent } from './create-hostel.component';

describe('CreateHostelComponent', () => {
  let component: CreateHostelComponent;
  let fixture: ComponentFixture<CreateHostelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateHostelComponent]
    });
    fixture = TestBed.createComponent(CreateHostelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
