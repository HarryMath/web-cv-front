import {Component, HostListener, Input, OnInit} from '@angular/core';
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

type IPhotoState = {
  borderRadius: number,
  shadow: number,
  left: number,
  bottom: number,
  translateX: number,
  translateY: number,
  scale: number
}

type ILabelSate = {
  left: number,
  bottom: number,
  translateX: number,
  translateY: number,
  scale: number,
}

type IMenuState = {
  photo: IPhotoState,
  label: ILabelSate,
  height: number,
}

const s0: IMenuState = {
  photo: {
    borderRadius: 17,
    shadow: 91,
    left: 50,
    bottom: 0,
    translateX: -105,
    translateY: 30,
    scale: 1
  },
  label: {
    left: 50,
    bottom: 0,
    translateX: 5,
    translateY: 10,
    scale: 1,
  },
  height: 90
}

const s1: IMenuState = {
  photo: {
    borderRadius: 50,
    shadow: 0,
    left: 0,
    bottom: 50,
    translateX: -10,
    translateY: 50,
    scale: 0.35
  },
  label: {
    left: 50,
    bottom: 0,
    translateX: 5,
    translateY: 10,
    scale: 1,
  },
  height: 45
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

  @HostListener('window:resize')
  ngOnInit(): void {
    this.menuService.init();
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
    let style = this.p.avatar ?
      `background-image: url(${this.p.avatar}); background-size: cover;`:
      '';
    if (this.menuService.isMobile) {
      const c1 = Math.min((this.menuService.scroll) / s0.height, 1)
      const c2 = 1 - c1;
      const border = s0.photo.borderRadius * c2 + s1.photo.borderRadius * c1;
      const transX = s0.photo.translateX * c2 + s1.photo.translateX * c1;
      const transY = s0.photo.translateY * c2 + s1.photo.translateY * c1;
      const scale = s0.photo.scale * c2 + s1.photo.scale * c1;
      const left = s0.photo.left * c2 + s1.photo.left * c1;
      const bottom = s0.photo.bottom * c2 + s1.photo.bottom * c1;
      const shadow = s0.photo.shadow * c2 + s1.photo.shadow * c1;
      style += `border-radius: ${border}%; left: ${left}%; bottom: ${bottom}%;
      transform: translate(${transX}%,${transY}%) scale(${scale});
      box-shadow: 3px 10px 15px 5px #04050d${shadow};`;
    }
    return style;
  }

  getMenuStyle(): string {
    if (!this.menuService.isMobile) {
      return '';
    }
    const c1 = Math.min((this.menuService.scroll) / s0.height, 1)
    const px = s0.height * (1 - c1) + s1.height * c1;
    console.log(`height: calc(${px}px + ${px / 20}vw)`);
    return `height: calc(${px}px + ${px/20}vw)`;
  }

  getRole(): string {
    return this.p.role && this.p.role.length > 3 ?
      this.p.role.trim().replace(', ', '<br>') :
      ''
  }
}
