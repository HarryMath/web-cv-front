import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MenuService} from '../shared/menu.service';
import {Title} from '@angular/platform-browser';
import {IExperience, IProfile, IProject, ISkill, ISkillsGroup} from '../shared/models';
import {ProfilesService} from '../shared/profiles.service';
import {MessageService} from '../shared/message.service';
import {DateService} from '../shared/date.service';
import {Color, ColorService, HSL, IPalette} from '../shared/color.service';

type IProjectView = IProject & {colors: IPalette};

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
    fullName: '', id: 0, login: '',
    intro: '', role: '',
    education: [], experience: [], skills: [], projects: []
  }
  private readonly levels = ['Basic awareness', 'Occasionally usage', 'Experienced', 'Strong knowledge', 'Expert level']
  skills: ISkillsGroup[] = [];
  projects: IProjectView[] = [];

  constructor(
    private router: Router,
    public dateService: DateService,
    public menuService: MenuService,
    private profilesService: ProfilesService,
    private message: MessageService,
    private colorService: ColorService,
    private title: Title
  ) {
    const login = router.url.split('/')[1];
    this.reloadData(login);
  }

  ngOnInit(): void {
  }

  private async afterLoad(p: IProfile): Promise<void> {
    console.log(p);
    this.data = p;
    this.title.setTitle(p.fullName);
    this.skills = this.aggregateSkills(p.skills);
    this.projects = p.projects.map(pr => {
      return {...pr, colors: this.colorService.defaultColors};
    });
    this.isLoaded = true;
    for (let pr of this.projects) {
      if (pr.image && pr.image.length > 10) {
        pr.colors = await this.colorService.getPalette(pr.image);
      }
    }
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
    const introAbstracts = this.data.intro?.split('\n') || [];
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

  getSkillLevelString(s: ISkill): string {
    return this.levels[s.skillLevel - 1];
  }

  getLogoImage(e: IExperience): string {
    return e.companyLogo ? `background-image: url('${e.companyLogo}')` : '';
  }

  visitCompanySite(e: IExperience): void {
    if (e.link && e.link?.length > 5) {
      window.open(e.link, '_blank')?.focus();
    }
  }

  getProjectImage(p: IProject): string {
    return p.image ? `background-image: url('${p.image}')` : '';
  }

  getGradient(p: IProjectView): string {
    const c = p.colors.dominant;
    return p.image && p.image.length > 10 ?
      `background: linear-gradient(0deg, hsl(${c.hsl.h}deg ${c.hsl.s}% ${c.hsl.l}%) 50%, transparent 100%)` : ''
  }

  getColor(c: Color) {
    return `color: hsl(${c.hsl.h}deg ${c.hsl.s}% ${c.hsl.l}%);`;
  }
}
