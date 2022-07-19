import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface ISelectDate {
  day: number,
  month: number,
  year: number,
}

export interface IDateSpecification {
  days: boolean,
  month: boolean,
  year: boolean,
}

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.sass']
})
export class DatePickerComponent implements OnInit {

  @Input('title') title: string = '';
  @Input('spec') spec!: IDateSpecification;
  @Input('date') date!: ISelectDate;
  @Output() dateChange: EventEmitter<ISelectDate> = new EventEmitter<ISelectDate>();
  @Output() submit: EventEmitter<ISelectDate> = new EventEmitter<ISelectDate>();

  ngOnInit(): void {
    if (this.spec.year && this.date.year === 0) {
      this.date.year = new Date().getFullYear();
    }
  }

  handleMonthChange(): void {
    if (this.date.month > 12) {
      this.date.month = 12;
    } else if (this.date.month < 1) {
      this.date.month = 0;
    }
    this.dateChange.emit(this.date);
  }

  decreaseDays(): void {
    this.date.day = this.date.day < 2 ? 31 : this.date.day - 1;
    this.dateChange.emit(this.date);
  }

  increaseDays(): void {
    this.date.day = this.date.day > 30 ? 1 : this.date.day + 1;
    this.dateChange.emit(this.date);
  }

  decreaseMonth(): void {
    this.date.month = this.date.month < 2 ? 12 : this.date.month - 1;
    this.dateChange.emit(this.date);
  }

  increaseMonth(): void {
    this.date.month = this.date.month > 30 ? 1 : this.date.month + 1;
    this.dateChange.emit(this.date);
  }

  handleDayChange(): void {
    if (this.date.day > 31) {
      this.date.day = 31;
    } else if (this.date.day < 0) {
      this.date.day = 0;
    }
    this.dateChange.emit(this.date);
  }


}
