import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysChartComponent } from './days-chart.component';

describe('DaysChartComponent', () => {
  let component: DaysChartComponent;
  let fixture: ComponentFixture<DaysChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaysChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaysChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
