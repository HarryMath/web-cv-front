import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MenuService} from '../menu.service';
import {DateService} from '../date.service';

type IMenuProfile = {
  birthYear: number|null,
  birthMonth: number|null,
  birthDay: number|null,
  avatar: string|null,
  email: string,
  role: string|null,
  github?: string|null,
  linkedin?: string|null,
  telegram?: string|null,
  fullName: string,
  currentLocation: string|null,
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  @Input('profile') p!: IMenuProfile;

  //isAgeSpecified = false;
  //age: string = '';
  //birthDate: string = '';

  constructor(
    public menuService: MenuService,
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    this.menuService.findSections();
    this.setUpBirthDate(this.p);
  }

  private setUpBirthDate(p: IMenuProfile): void {
    // p.birthYear = p.birthYear || 0;
    // p.birthMonth = p.birthMonth || 0;
    // p.birthDay = p.birthDay || 0;
    // this.isAgeSpecified = p.birthYear! > 1900 && p.birthMonth! > 0 && p.birthDay! > 0;
    // if (this.isAgeSpecified) {
    //   const date = {year: p.birthYear, month: p.birthMonth, day: p.birthDay};
    //   this.age = this.dateService.getAge(date) + ' years';
    //   this.birthDate = this.dateService.getDateString(date);
    // }
  }

  isAgeSpecified(p: IMenuProfile): boolean {
    return p.birthYear! > 1900 && p.birthMonth! > 0 && p.birthDay! > 0;
  }

  getAge(p: IMenuProfile): string {
    const date = {year: p.birthYear || 0, month: p.birthMonth || 0, day: p.birthDay || 0};
    return this.dateService.getAge(date) + ' years';
  }

  getBirthDate(p: IMenuProfile): string {
    const date = {year: p.birthYear || 0, month: p.birthMonth || 0, day: p.birthDay || 0};
    return this.dateService.getDateString(date);
  }


  getPhotoStyle(): string {
    return this.p.avatar ?
      `background-image: url(${this.p.avatar}); background-size: cover`:
      ''
  }

  getRole(): string {
    return this.p.role && this.p.role.length > 3 ?
      this.p.role.trim().replace(', ', '<br>') :
      ''
  }
}
