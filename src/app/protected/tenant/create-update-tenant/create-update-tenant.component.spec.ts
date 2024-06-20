import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTenantComponent } from './create-update-tenant.component';

describe('CreateUpdateTenantComponent', () => {
  let component: CreateUpdateTenantComponent;
  let fixture: ComponentFixture<CreateUpdateTenantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateTenantComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
