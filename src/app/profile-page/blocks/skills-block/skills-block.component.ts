import {Component, Input, OnInit} from '@angular/core';
import {ISkill, ISkillsGroup} from '../../../shared/models';

@Component({
  selector: 'app-skills-block',
  templateUrl: './skills-block.component.html',
  styleUrls: ['./skills-block.component.sass']
})
export class SkillsBlockComponent implements OnInit {

  @Input('skills') groups!: ISkillsGroup[];
  private readonly levels = ['Basic awareness', 'Occasionally usage', 'Experienced', 'Strong knowledge', 'Expert level']

  constructor() { }

  ngOnInit(): void {
  }

  getLevelString(s: ISkill): string {
    return this.levels[s.skillLevel - 1];
  }
}
