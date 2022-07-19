import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ISelectDate} from '../date-picker/date-picker.component';
import {IEducation} from '../../shared/models';
import {MessageService} from '../../shared/message.service';
import {QuestionService} from '../../shared/question.service';
import {EducationService} from '../../shared/education.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['../my-page.component.sass']
})
export class EducationComponent implements OnInit {

  private static readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  @Input('edu') edu!: IEducation
  @Input('isNew') isNew = false;
  @Output('onDelete') onDelete = new EventEmitter();
  isLoading = false;

  private readonly currentYear = new Date().getFullYear();
  startDate: ISelectDate = {
    month: 0,
    year: 0,
    day: 0
  };
  startInFocus = false;
  endDate: ISelectDate = {
    month: 0,
    year: 0,
    day: 0
  }
  endInFocus = false;
  isCurrentPosition = false;
  previousDescriptionVersion = '';

  constructor(
    private message: MessageService,
    private service: EducationService,
    private popup: QuestionService
  ) { }

  ngOnInit(): void {
    this.startDate.month = this.edu.startMonth;
    this.startDate.year = this.edu.startYear;
    this.endDate.month = this.edu.endMonth;
    this.endDate.year = this.edu.endYear;
    this.isCurrentPosition = this.endDate.year == 0 && this.endDate.month == 0 && !this.isNew;
    this.previousDescriptionVersion = this.edu.description || '';
  }

  getStartDateString(): string {
    return this.getDateString(this.startDate);
  }

  getEndDateString(): string {
    return this.isCurrentPosition ? 'present days' : this.getDateString(this.endDate);
  }

  private getDateString(date: ISelectDate): string {
    return !this.isValid(date) ? '' :
      EducationComponent.months[date.month - 1] + ' ' + date.year;
  }

  isValid(date: ISelectDate): boolean {
    return this.isDateValid(date.year, date.month);
  }

  isDateValid(y: number, m: number): boolean {
    return y != null && m != null && y > 1800 && y <= this.currentYear + 1 && m > 0 && m < 13;
  }

  selectEnd(): void {
    if (!this.isCurrentPosition) {
      this.endInFocus = true;
    }
  }

  saveEndDate(): void {
    this.endInFocus = false;
    if (!this.isValid(this.endDate)) {
      this.message.show('End date is invalid', -1);
      return;
    }
    this.edu.endYear = this.endDate.year;
    this.edu.endMonth = this.endDate.month;
    this.save();
  }

  saveStartDate(): void {
    this.startInFocus = false;
    if (!this.isValid(this.startDate)) {
      this.message.show('Start date is invalid', -1);
      return;
    }
    this.edu.startYear = this.startDate.year;
    this.edu.startMonth = this.startDate.month;
    this.save();
  }

  toggleCurrentPosition(): void {
    this.isCurrentPosition = !this.isCurrentPosition;
    if (this.isCurrentPosition) {
      this.edu.endYear = 0;
      this.edu.endMonth = 0;
    } else {
      this.edu.endYear = this.endDate.year;
      this.edu.endMonth = this.endDate.month;
    }
    this.save();
  }

  getDescriptionMinHeight(): string {
    const lines = (this.edu.description || '').split('\n');
    const linesAmount = lines.length + lines.filter(l => l.length > 200)
      .reduce((prev: number, next: string) => {
        return prev + Math.floor(next.length / 200)
      }, 0);
    return `min-height: calc(${linesAmount * 16}px + ${linesAmount * 0.75}vw)`
  }

  checkDescription(): void {
    if (
      this.edu.description?.includes('<') ||
      this.edu.description?.includes('>')
    ) {
      this.edu.description = this.previousDescriptionVersion;
      this.message.show('HTML is not allowed.', -1);
    } else {
      this.previousDescriptionVersion = this.edu.description || '';
    }
  }

  async delete(): Promise<void> {
    const submitted = await this.popup.ask(
      'Delete work experience',
      ['You will not be able to cancel this action.',
        this.edu.institutionName.length > 1 ?
          'Are you sure you want to delete experience at ' + this.edu.institutionName + '?':
          'Are you sure you want to delete this experience?'],
      'delete', 'cancel', 'danger'
    );
    if (!submitted) {return;}
    this.isLoading = true;
    this.deleteExperience();
  }

  private async deleteExperience(): Promise<void> {
    if (!this.isNew) {
      try {
        await this.service.delete(this.edu.id);
      } catch (e) {
        console.warn(e);
        this.message.show('Error occurred while deleting. refresh the page and try again, please.');
        return;
      }
    }
    this.onDelete.emit();
  }

  async save(): Promise<void> {
    if (
      !this.isDateValid(this.edu.startYear, this.edu.startMonth) ||
      (!this.isDateValid(this.edu.endYear, this.edu.endMonth) && !this.isCurrentPosition) ||
      this.edu.institutionName.length < 3 ||
      this.edu.label.length < 3
    ) {
      return;
    }
    try {
      if (this.isNew) {
        const result = await this.service.save(this.edu);
        console.info('saved: ', result);
        this.edu.id = result.id;
        this.isNew = false;
      } else {
        const result = await this.service.update(this.edu);
        console.info('updated: ', result);
      }
    } catch (e) {
      // TODO rollback changes
      console.warn(e);
      this.message.show('Error while saving experience. refresh the page and try again, please.')
    }
  }

}
