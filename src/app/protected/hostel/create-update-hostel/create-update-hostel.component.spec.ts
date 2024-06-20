import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdateHostelComponent } from './create-update-hostel.component';

describe('CreateUpdateHostelComponent', () => {
  let component: CreateUpdateHostelComponent;
  let fixture: ComponentFixture<CreateUpdateHostelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateHostelComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateHostelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
