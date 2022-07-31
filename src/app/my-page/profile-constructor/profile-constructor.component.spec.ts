import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileConstructorComponent } from './profile-constructor.component';

describe('ProfileConstructorComponent', () => {
  let component: ProfileConstructorComponent;
  let fixture: ComponentFixture<ProfileConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileConstructorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
