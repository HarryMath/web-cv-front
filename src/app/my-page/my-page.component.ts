import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IEducation, IExperience, IProject, ISkill, MyProfile} from '../shared/models';
import {MessageService} from "../shared/message.service";
import {MenuService} from '../shared/menu.service';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.sass']
})
export class MyPageComponent implements OnInit {

  profile!: MyProfile;
  isLoaded = false;
  previousVersionOfIntro = '';
  newExperiences: IExperience[] = [];
  newEducations: IEducation[] = [];
  newSkills: ISkill[] = [];
  newProjects: IProject[] = [];

  constructor(
    private route: ActivatedRoute,
    private message: MessageService,
    public menuService: MenuService
  ) {
    route.data.subscribe(({profile}) => {
      this.profile = profile;
      this.isLoaded = true;
      this.previousVersionOfIntro = profile.intro;
    });
  }

  ngOnInit(): void {}

  checkIntro(): void {
    if (
      this.profile.intro.includes('<') ||
      this.profile.intro.includes('>')
    ) {
      this.profile.intro = this.previousVersionOfIntro;
      this.message.show('HTML is not allowed.', -1);
    } else {
      this.previousVersionOfIntro = this.profile.intro;
    }
  }

  saveIntro(): void {
    console.log(this.profile.intro);
    // TODO send intro to back-end;
  }

  getIntroMinHeight(): string {
    const lines = this.profile.intro.split('\n');
    const linesAmount = lines.length + lines.filter(l => l.length > 200)
      .reduce((prev: number, next: string) => {
        return prev + Math.floor(next.length / 200)
      }, 0);
    return `min-height: calc(${linesAmount * 16}px + ${linesAmount * 0.75}vw)`
  }

  getIntro(): string {
    let introHTML = '';
    const introAbstracts = this.profile.intro.split('\n');
    for (let p of introAbstracts) {
      introHTML += p.length == 0 ? '<br>' : `<div>${p.trim()}</div>`;
    }
    return introHTML;
  }

  addExperience(): void {
    this.newExperiences.push({
      description: '',
      endMonth: 0,
      endYear: 0,
      id: 0,
      link: null,
      location: '',
      place: '',
      profileId: this.profile.id,
      role: '',
      startMonth: 0,
      startYear: 0
    })
  }

  addEducation(): void {
    this.newEducations.push({
      description: '',
      endMonth: 0,
      endYear: 0,
      id: 0,
      institutionName: '',
      label: '',
      profileId: this.profile.id,
      startMonth: 0,
      startYear: 0
    });
  }

  addSkill(): void {
    this.newSkills.push({
      skillName: '',
      skillLevel: 1,
      skillGroup: '',
      id: 0,
      profileId: this.profile.id
    })
  }

  addProject(): void {
    this.newProjects.push({
      id: 0,
      role: '',
      title: '',
      description: '',
      tags: [],
      image: null,
      place: null,
      links: []
    })
  }
}
