import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePaymentComponent } from './create-update-payment.component';

describe('CreateUpdatePaymentComponent', () => {
  let component: CreateUpdatePaymentComponent;
  let fixture: ComponentFixture<CreateUpdatePaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdatePaymentComponent]
    });
    fixture = TestBed.createComponent(CreateUpdatePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
