import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IExperience} from '../../../shared/models';
import {ISelectDate} from '../../date-picker/date-picker.component';
import {MessageService} from '../../../shared/message.service';
import {ExperienceService} from '../../../shared/experience.service';
import {QuestionService} from '../../../shared/question.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['../../my-page.component.sass']
})
export class ExperienceComponent implements OnInit {

  private static readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  @Input('exp') experience!: IExperience;
  @Input('isNew') isNew = false;
  @Output('onDelete') onDelete = new EventEmitter();
  previousVersion!: IExperience;
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
    private service: ExperienceService,
    private popup: QuestionService
  ) { }

  ngOnInit(): void {
    this.setUpDateObjects(this.experience);
    this.isCurrentPosition = this.endDate.year == 0 && this.endDate.month == 0 && !this.isNew;
    this.previousDescriptionVersion = this.experience.description;
    this.previousVersion = {...this.experience};
  }

  private setUpDateObjects(e: IExperience): void {
    this.startDate.month = e.startMonth;
    this.startDate.year = e.startYear;
    this.endDate.month = e.endMonth;
    this.endDate.year = e.endYear;
  }

  getStartDateString(): string {
    return this.getDateString(this.startDate);
  }

  getEndDateString(): string {
    return this.isCurrentPosition ? 'present days' : this.getDateString(this.endDate);
  }

  private getDateString(date: ISelectDate): string {
    return !this.isValid(date) ? '' :
      ExperienceComponent.months[date.month - 1] + ' ' + date.year;
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
    this.experience.endYear = this.endDate.year;
    this.experience.endMonth = this.endDate.month;
    this.save();
  }

  saveStartDate(): void {
    this.startInFocus = false;
    if (!this.isValid(this.startDate)) {
      this.message.show('Start date is invalid', -1);
      return;
    }
    this.experience.startYear = this.startDate.year;
    this.experience.startMonth = this.startDate.month;
    this.save();
  }

  toggleCurrentPosition(): void {
    this.isCurrentPosition = !this.isCurrentPosition;
    if (this.isCurrentPosition) {
      this.experience.endYear = 0;
      this.experience.endMonth = 0;
    } else {
      this.experience.endYear = this.endDate.year;
      this.experience.endMonth = this.endDate.month;
    }
    this.save();
  }

  getDescriptionMinHeight(): string {
    const lines = this.experience.description.split('\n');
    const linesAmount = lines.length + lines.filter(l => l.length > 200)
      .reduce((prev: number, next: string) => {
        return prev + Math.floor(next.length / 200)
      }, 0);
    return `min-height: calc(${linesAmount * 16}px + ${linesAmount * 0.75}vw)`
  }

  checkDescription(): void {
    if (
      this.experience.description.includes('<') ||
      this.experience.description.includes('>')
    ) {
      this.experience.description = this.previousDescriptionVersion;
      this.message.show('HTML is not allowed.', -1);
    } else {
      this.previousDescriptionVersion = this.experience.description;
    }
  }

  async delete(): Promise<void> {
    const submitted = await this.popup.ask(
      'Delete work experience',
      ['You will not be able to cancel this action.',
      this.experience.place.length > 1 ?
        'Are you sure you want to delete experience at ' + this.experience.place + '?':
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
        await this.service.delete(this.experience.id);
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
      !this.isDateValid(this.experience.startYear, this.experience.startMonth) ||
      (!this.isDateValid(this.experience.endYear, this.experience.endMonth) && !this.isCurrentPosition) ||
      this.experience.place.length < 2 ||
      this.experience.role.length < 2 ||
      this.equals(this.experience, this.previousVersion)
    ) {
      return;
    }
    try {
      if (this.isNew) {
        const result = await this.service.save(this.experience);
        console.info('saved: ', result);
        this.experience.id = result.id;
        this.isNew = false;
        this.experience.companyLogo = result.companyLogo;
      } else {
        const result = await this.service.update(this.experience);
        this.experience.companyLogo = result.companyLogo;
        console.info('updated: ', result);
      }
      this.previousVersion = {...this.experience};
    } catch (e) {
      this.experience = {...this.previousVersion};
      this.setUpDateObjects(this.previousVersion);
      console.warn(e);
      this.message.show('Error while saving experience. refresh the page and try again, please.')
    }
  }

  private equals(e1: IExperience, e2: IExperience) {
    return e1.startMonth === e2.startMonth &&
      e1.startYear === e2.startYear &&
      e1.endMonth === e2.endMonth &&
      e1.endYear === e2.endYear &&
      e1.place === e2.place &&
      e1.description === e2.description &&
      e1.location === e2.location &&
      e1.link === e2.link &&
      e1.role === e2.role;
  }
}
