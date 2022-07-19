import {Component, Input, OnInit} from '@angular/core';
import {IEducation} from "../../../shared/models";

@Component({
  selector: 'app-education-block',
  templateUrl: './education-block.component.html',
  styleUrls: ['./education-block.component.sass']
})
export class EducationBlockComponent implements OnInit {

  private readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  @Input('education') institutions!: IEducation[];

  constructor() { }

  ngOnInit(): void {
  }

  private getEndDateString(e: IEducation): string {
    return e.endYear == 0 && e.endMonth == 0 ? 'present days' :
      this.months[e.endMonth - 1] + ' ' + e.endYear;
  }

  private getStartDateString(e: IEducation): string {
    return this.months[e.startMonth - 1] + ' ' + e.startYear;
  }

  getPeriodString(e: IEducation): string {
    return this.getStartDateString(e) + ' - ' + this.getEndDateString(e);
  }
}
