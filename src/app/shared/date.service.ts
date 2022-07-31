import {Injectable} from '@angular/core';
import {ISelectDate} from '../my-page/date-picker/date-picker.component';

export interface IPeriod {
  startMonth: number,
  startYear: number,
  startDay?: number,
  endMonth: number,
  endYear: number,
  endDay?: number
}

@Injectable({providedIn: 'root'})
export class DateService {

  private readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private readonly currentDate: ISelectDate = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }

  getDateString(d: Partial<ISelectDate>, short = false): string {
    let result = '';
    const hasDays = d.day && d.day > 0 && d.day < 32;
    const hasMonth = d.month && d.month > 0 && d.month < 13;
    const hasYears = d.year && d.year > 1900 && d.year < 3000;
    if (hasDays) {
      result += d.day! > 9 ? d.day : '0' + d.day;
    }
    if (hasMonth) {
      if (hasDays) {
        result += short ? '.' : ' ';
      }
      result += short ? (d.month! > 9 ? d.month : '0' + d.month) :
        this.months[d.month! - 1];
    }
    if (hasYears) {
      if (hasDays || hasMonth) {
        result += short ? '.' : ' ';
      }
      result += d.year;
    }
    return result;
  }

  getAge(d: ISelectDate): number {
    let age = this.currentDate.year - d.year - 1;
    if (this.currentDate.month > d.month) {
      age++;
    } else if (this.currentDate.month === d.month && this.currentDate.day >= d.day) {
      age++;
    }
    return age;
  }

  private getEndDateString(e: IPeriod): string {
    return e.endYear == 0 && e.endMonth == 0 ? 'present days' :
      this.months[e.endMonth - 1] + ' ' + e.endYear;
  }

  private getStartDateString(e: IPeriod): string {
    return this.months[e.startMonth - 1] + ' ' + e.startYear;
  }

  getPeriodString(e: IPeriod): string {
    return this.getStartDateString(e) + ' - ' + this.getEndDateString(e);
  }
}
