import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MenuService} from '../shared/menu.service';
import {Title} from '@angular/platform-browser';
import {IProfile, ISkill, ISkillsGroup} from '../shared/models';
import {ProfilesService} from "../shared/profiles.service";
import {MessageService} from "../shared/message.service";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.sass']
})
export class ProfilePageComponent implements OnInit {

  isLoaded = false;

  data: IProfile = {
    avatar: null, birthDay: 0, birthMonth: 0,
    birthYear: 0, currentLocation: null, email: '',
    fullName: '', id: 0, login: '', intro: '',
    password: '', role: '', verified: false,
    education: [], experience: [], skills: [], projects: []
  }
  skills: ISkillsGroup[] = [];

  constructor(
    private router: Router,
    public menuService: MenuService,
    private profilesService: ProfilesService,
    private message: MessageService,
    private title: Title
  ) {
    const login = router.url.split('/')[1];
    this.reloadData(login);
  }

  ngOnInit(): void {
  }

  private afterLoad(p: IProfile): void {
    this.title.setTitle(p.fullName);
    this.skills = this.aggregateSkills(p.skills);
    console.log(p);
    this.isLoaded = true;
    this.data = p;
  }

  private aggregateSkills(skills: ISkill[]): ISkillsGroup[] {
    const result: ISkillsGroup[] = [];
    skills.forEach(s => {
      for (let group of result) {
        if (group.name === s.skillGroup) {
          group.skills.push(s);
          return;
        }
      }
      result.push({
        name: s.skillGroup,
        skills: [s]
      })
    });
    result.forEach(g => {
      g.skills.sort((s1, s2) => s2.skillLevel - s1.skillLevel)
    });
    return result.reverse();
  }

  getIntro(): string {
    let introHTML = '';
    const introAbstracts = this.data.intro.split('\n');
    for (let p of introAbstracts) {
      introHTML += `<div>${p.trim()}</div>`
    }
    return introHTML
  }

  async reloadData(login: string): Promise<void> {
    try {
      const profile = await this.profilesService.getProfile(login);
      this.afterLoad(profile);
    } catch (e) {
      console.log(e);
      this.message.show('This profile does not exist');
      this.router.navigate(['/'])
    }
  }

}
