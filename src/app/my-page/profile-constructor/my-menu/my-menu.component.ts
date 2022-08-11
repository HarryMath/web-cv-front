import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from '../../../shared/menu.service';
import {IProfile} from '../../../shared/models';
import {ImagesService} from '../../../shared/images.service';

@Component({
  selector: 'app-my-menu',
  templateUrl: './my-menu.component.html',
  styleUrls: ['./my-menu.component.sass']
})
export class MyMenuComponent implements OnInit {

  @Input() profile!: IProfile;
  isAgeSpecified = false;
  birthDate = '';
  age = 0;

  constructor(
    public menuService: MenuService,
    private imagesService: ImagesService
  ) { }

  ngOnInit(): void {
    this.profile.birthYear = this.profile.birthYear || 0;
    this.profile.birthMonth = this.profile.birthMonth || 0;
    this.profile.birthDay = this.profile.birthDay || 0;
    this.menuService.findSections();
    this.isAgeSpecified = this.profile.birthYear! > 1900 &&
      this.profile.birthMonth! > 0 &&
      this.profile.birthDay! > 0;
    if (this.isAgeSpecified) {
      this.age = this.getAge(this.profile);
      this.birthDate = this.dateToString(this.profile);
    }
  }

  private dateToString(date: IProfile): string {
    return (date.birthDay! > 9 ? date.birthDay : '0' + date.birthDay) + '.' +
      (date.birthMonth! > 9 ? date.birthMonth : '0' + date.birthMonth) + '.' +
      date.birthYear;
  }

  private getAge(birthDate: IProfile): number {
    const date = new Date();
    let years = date.getFullYear() - birthDate.birthYear!;
    const months = date.getMonth() - birthDate.birthMonth!;
    const days = date.getDate() - birthDate.birthDay!;
    if (months >= 0 && days >= 0) {
      years++;
    }
    return years;
  }

  getPhotoStyle(): string {
    return this.profile.avatar ?
      `background-image: url(${this.profile.avatar}); background-size: cover`:
      ''
  }

  getRole(): string {
    return this.profile.role && this.profile.role.length > 3 ?
      this.profile.role.trim().replace(', ', '<br>') :
      ''
  }

  async selectPhoto(): Promise<void> {
    const url = await this.imagesService.selectImage('Select avatar');
    if (url && url.publicUrl) {
      this.profile.avatar = url.publicUrl;
      // TODO save();
    }
  }
}
