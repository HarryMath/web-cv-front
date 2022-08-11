import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from '../../shared/menu.service';
import {DateService} from '../../shared/date.service';

type IMenuProfile = {
  birthYear: number|null,
  birthMonth: number|null,
  birthDay: number|null,
  avatar: string|null,
  role: string|null,
  fullName: string,
  currentLocation: string|null,
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  @Input() profile!: IMenuProfile;

  isAgeSpecified = false;
  age: string = '';
  birthDate: string = '';

  constructor(
    public menuService: MenuService,
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    this.menuService.findSections();
    this.setUpBirthDate(this.profile);
  }

  private setUpBirthDate(p: IMenuProfile): void {
    p.birthYear = p.birthYear || 0;
    p.birthMonth = p.birthMonth || 0;
    p.birthDay = p.birthDay || 0;
    this.isAgeSpecified = p.birthYear! > 1900 && p.birthMonth! > 0 && p.birthDay! > 0;
    if (this.isAgeSpecified) {
      const date = {year: p.birthYear, month: p.birthMonth, day: p.birthDay};
      this.age = this.dateService.getAge(date) + ' years';
      this.birthDate = this.dateService.getDateString(date);
    }
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
}
