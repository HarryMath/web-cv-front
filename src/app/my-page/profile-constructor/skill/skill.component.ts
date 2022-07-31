import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ISkill} from '../../../shared/models';
import {QuestionService} from '../../../shared/question.service';
import {MessageService} from '../../../shared/message.service';
import {SkillsService} from '../../../shared/skills.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['../../my-page.component.sass', './skill.component.sass']
})
export class SkillComponent implements OnInit {

  @Input('skill') s!: ISkill;
  @Input('isNew') isNew = false;
  @Output('onDelete') onDelete = new EventEmitter();
  previousVersion!: ISkill;
  isLoading = false;

  constructor(
    private popup: QuestionService,
    private message: MessageService,
    private service: SkillsService
  ) { }

  ngOnInit(): void {
    this.previousVersion = {...this.s};
  }

  setSkillLevel(l: number) {
    this.s.skillLevel = l;
    this.save();
  }

  async save(): Promise<void> {
    if (
      this.s.skillName.length < 2 || this.s.skillGroup.length < 2 || this.s.skillLevel < 1 ||
      this.equals(this.s, this.previousVersion)
    ) {
      return;
    }
    try {
      if (this.isNew) {
        const result = await this.service.save(this.s);
        this.s.id = result.id;
        this.isNew = false;
      } else {
        await this.service.update(this.s);
      }
      this.previousVersion = {...this.s};
    } catch (e) {
      this.s = {...this.previousVersion};
      console.warn(e);
      this.message.show('Error while saving skill. refresh the page and try again, please.')
    }
  }

  async delete(): Promise<void> {
    const submitted = this.isNew || await this.popup.ask(
      'Delete work experience',
      ['Are you sure you want to delete ' + this.s.skillName + ' skill?'],
      'delete', 'cancel', 'danger'
    );
    if (!submitted) {return;}
    this.isLoading = true;
    await this.deleteSkill();
  }

  private async deleteSkill(): Promise<void> {
    if (!this.isNew) {
      try {
        await this.service.delete(this.s.id);
      } catch (e) {
        console.warn(e);
        this.message.show('Error occurred while deleting. refresh the page and try again, please.');
        return;
      }
    }
    this.onDelete.emit();
  }

  private equals(s1: ISkill, s2: ISkill): boolean {
    return s1.skillName === s2.skillName && s1.skillLevel === s2.skillLevel && s1.skillGroup === s2.skillGroup;
  }
}
