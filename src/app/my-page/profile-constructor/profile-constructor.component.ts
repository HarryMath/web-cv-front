import {Component, Input, OnInit} from '@angular/core';
import {IEducation, IExperience, IProfile, IProject, ISkill, MyProfile} from '../../shared/models';
import {ISelectDate} from '../date-picker/date-picker.component';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../../shared/message.service';
import {MenuService} from '../../shared/menu.service';
import {ImagesService} from '../../shared/images.service';
import {ProfilesService} from '../../shared/profiles.service';

@Component({
  selector: 'app-profile-constructor',
  templateUrl: './profile-constructor.component.html',
  styleUrls: ['../my-page.component.sass']
})
export class ProfileConstructorComponent implements OnInit {

  private readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  @Input('profile') profile!: MyProfile;
  previousVersion!: MyProfile;
  previousVersionOfIntro = '';
  newExperiences: IExperience[] = [];
  newEducations: IEducation[] = [];
  newSkills: ISkill[] = [];
  newProjects: IProject[] = [];
  selectingBirthDate = false;
  birthDate: ISelectDate = {day: 0, month: 0, year: 0};

  constructor(
    private service: ProfilesService,
    private message: MessageService,
    public menuService: MenuService,
    private imagesService: ImagesService
  ) {}

  ngOnInit(): void {
    this.previousVersionOfIntro = this.profile.intro || '';
    this.birthDate = {
      year: this.profile.birthYear || 0,
      month: this.profile.birthMonth || 0,
      day: this.profile.birthDay || 0,
    };
    this.previousVersion = {...this.profile};
  }

  checkIntro(): void {
    if (
      this.profile.intro!.includes('<') ||
      this.profile.intro!.includes('>')
    ) {
      this.profile.intro = this.previousVersionOfIntro;
      this.message.show('HTML is not allowed.', -1);
    } else {
      this.previousVersionOfIntro = this.profile.intro || '';
    }
  }

  getIntroMinHeight(): string {
    const lines = this.profile.intro?.split('\n') || [];
    const linesAmount = lines.length + lines.filter(l => l.length > 200)
      .reduce((prev: number, next: string) => {
        return prev + Math.floor(next.length / 200)
      }, 0);
    return `min-height: calc(${linesAmount*1.6}rem)`
  }

  getIntro(): string {
    let introHTML = '';
    const introAbstracts = this.profile.intro?.split('\n') || [];
    for (let p of introAbstracts) {
      introHTML += p.length == 0 ? '<br>' : `<div>${p.trim()}</div>`;
    }
    return introHTML;
  }

  isValid(date: ISelectDate): boolean {
    return this.isDateValid(date.year, date.month, date.day);
  }

  isDateValid(y: number, m: number, d: number): boolean {
    return d!=null && y != null && m != null &&
      y > 1800 && y <= new Date().getFullYear() + 1 &&
      m > 0 && m < 13 && d > 0 && m < 32;
  }

  saveBirthDate(): void {
    this.selectingBirthDate = false;
    if (!this.isValid(this.birthDate)) {
      this.message.show('Birth date is invalid', -1);
      return;
    }
    this.profile.birthYear = this.birthDate.year;
    this.profile.birthMonth = this.birthDate.month;
    this.profile.birthDay = this.birthDate.day;
    this.save();
  }

  getBirthDateString(): string {
    return !this.isValid(this.birthDate) ? '' :
      (this.birthDate.day > 9 ? this.birthDate.day : '0' + this.birthDate.day) + ' ' +
      this.months[this.birthDate.month - 1] + ' ' + this.birthDate.year;
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

  getAvatarPhoto(): string {
    return this.profile.avatar ?
      `background-image: url(${this.profile.avatar}); background-size: cover`: ''
  }

  async selectAvatar(): Promise<void> {
    const url = await this.imagesService.selectImage('Select avatar');
    if (url && url.publicUrl) {
      this.profile.avatar = url.publicUrl;
      this.save();
    }
  }

  async save(): Promise<void> {
    try {
      const updateResult = await this.service.updateProfileInfo(this.profile);
      this.previousVersion = {...this.profile};
      console.info('updated profile. result:', updateResult);
    } catch (e) {
      console.warn('profile not updated: ', e);
      this.message.show('Sorry, profile not updated. Refresh the page and try again, please!', -1, 10000);
      this.profile = {...this.previousVersion};
    }
  }

}
