import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateRoomComponent } from './create-update-room.component';

describe('CreateUpdateRoomComponent', () => {
  let component: CreateUpdateRoomComponent;
  let fixture: ComponentFixture<CreateUpdateRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateRoomComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
