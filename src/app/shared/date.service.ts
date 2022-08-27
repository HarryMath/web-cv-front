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
  private readonly days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private readonly currentDate: ISelectDate = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }
  private readonly currentDaySince1970 = Math.floor(new Date().getTime() / 86400000);

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

  getMonthDuration(e: IPeriod): string {
    let years = (e.endYear != 0 ? e.endYear: this.currentDate.year) - e.startYear;
    let months = (e.endMonth != 0 ? e.endMonth: this.currentDate.month) - e.startMonth;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    let result = '';
    if (years > 0){
      result += years;
      result += years % 10 === 1 ? ' year' : ' years';
    }
    if (months > 0) {
      if (years > 0) {
        result += ', '
      }
      result += months;
      result += months === 1 ? ' month' : ' months';
    }
    return result;
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

  getDateByDaysAgo(d: number, short = false): string {
    if (d === 0) {
      return 'Today';
    }
    if (d === 1) {
      return 'Yesterday';
    }
    const date = new Date(this.currentDate.year, this.currentDate.month - 1, this.currentDate.day - d);
    return this.getDateString({
      year: undefined,
      month: date.getMonth() + 1,
      day: date.getDate()
    }, short);
  }

  getWeekDayByDaysAgo(d: number, short = false): string {
    const date = new Date(this.currentDate.year, this.currentDate.month - 1, this.currentDate.day - d);
    return short ? this.days[date.getDay()].substring(0, 3) : this.days[date.getDay()];
  }

  getDaysPassed(timestamp: number|string): number {
    return this.currentDaySince1970 - Math.floor(parseInt('' +timestamp) / 86400000);
  }

  getTime(timestamp: number|string): string {
    const d = new Date(parseInt(timestamp + ''));
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const isPM = hours > 12;
    if (isPM) {
      hours = hours - 12;
    }
    return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes} ${isPM ? 'pm' : 'am'}`
  }
}
