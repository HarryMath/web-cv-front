import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MenuService} from '../shared/menu.service';
import {Title} from '@angular/platform-browser';
import {IEducation, IExperience, IProfile, IProject, ISkill} from '../shared/models';
import {ProfilesService} from '../shared/profiles.service';
import {MessageService} from '../shared/message.service';
import {DateService} from '../shared/date.service';
import {ColorService, IPalette} from '../shared/color.service';


type ISkillsGroup = {name: string, skills: ISkill[]};
type IProjectView = IProject & {colors: IPalette, parsed: boolean};
type IExperienceView = IExperience & {duration: string, period: string};
type IEducationView = IEducation & {period: string};
type IProfileView = Omit<IProfile, 'education'|'experience'|'skills'|'projects'> & {
  introHTML: string,
  education: IEducationView[],
  experience: IExperienceView[],
  skills: ISkillsGroup[],
  projects: IProjectView[]
};

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.sass']
})
export class ProfilePageComponent implements OnInit {

  loadingProgress = 0;
  isLoaded = false;
  data: IProfileView = {
    avatar: '', birthDay: 0, birthMonth: 0, birthYear: 0, currentLocation: '',
    fullName: '', login: '', email: '', role: '', introHTML: '', intro: '', id: 0,
    education: [], experience: [], projects: [], skills: []
  }
  private readonly levels = ['Basic awareness', 'Occasionally usage', 'Experienced', 'Strong knowledge', 'Expert level']

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
    this.reloadData(login).then(p => p && this.afterLoad(p));
  }

  ngOnInit(): void {}

  private async afterLoad(p: IProfile): Promise<void> {
    this.loadingProgress = 50;
    this.data = {...p,
      introHTML: this.getIntroHTML(p.intro),
      skills: this.aggregateSkills(p.skills),
      experience: p.experience.map(e => {
        return {...e, period: this.dateService.getPeriodString(e), duration: this.dateService.getMonthDuration(e)};
      }),
      education: p.education.map(e => {
        return {...e, period: this.dateService.getPeriodString(e)};
      }),
      projects: p.projects.map(pr => {
        return {...pr, colors: this.colorService.defaultColors, parsed: false};
      })
    };
    for (let pr of this.data.projects) {
      if (pr.image && pr.image.length > 10) {
        pr.colors = await this.colorService.getPalette(pr.image);
        if (!this.isLoaded) {
          this.loadingProgress = (this.loadingProgress + 10) * 0.5 + 50;
          if (this.loadingProgress > 100)  {
            this.loadingProgress = 100;
            this.isLoaded = true;
          }
        }
      }
    }
    this.title.setTitle(p.fullName);
    this.loadingProgress = 100;
    this.isLoaded = true;
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

  private getIntroHTML(intro: string|null): string {
    let introHTML = '';
    const introAbstracts = intro?.split('\n') || [];
    for (let p of introAbstracts) {
      p = p.trim();
      introHTML += p.length == 0 ? '<br>' : `<div>${p.trim()}</div>`
    }
    return introHTML;
  }

  async reloadData(login: string, attempt = 1): Promise<IProfile|void> {
    this.loadingProgress = (attempt - 1) * 0.1;
    try {
      return await this.profilesService.getProfile(login);
    } catch (e: any) {
      console.log(e);
      if (e.status && e.status === 404) {
        this.message.show('This profile does not exist');
        this.router.navigate(['/']);
      } else if (attempt < 3) {
        return await this.reloadData(login, attempt+1);
      } else {
        this.message.show('Sorry, service is unavailable. We already fixing it. :c');
        this.router.navigate(['/']);
      }
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
}
