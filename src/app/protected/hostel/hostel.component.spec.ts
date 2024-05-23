import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelComponent } from './hostel.component';

describe('HostelComponent', () => {
  let component: HostelComponent;
  let fixture: ComponentFixture<HostelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostelComponent]
    });
    fixture = TestBed.createComponent(HostelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
