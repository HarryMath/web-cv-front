import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationBlockComponent } from './education-block.component';

describe('EducationBlockComponent', () => {
  let component: EducationBlockComponent;
  let fixture: ComponentFixture<EducationBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
