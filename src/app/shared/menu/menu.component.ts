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
  left: number,
  top: number,
  translateX: number,
  translateY: number,
  scale: number
}

type INameState = {
  translateY: number,
  opacity: number,
}

type IInfoState = {
  opacity: number,
}

type ILinksState = {
  opacity: number,
  height: number,
  top: number
}

type IRoleState = {
  fontSize: number
  opacity: number
}

type ILabelSate = {
  left: number,
  top: number,
  translateX: number,
  translateY: number,
  height: number
}

type IMenuState = {
  photo: IPhotoState,
  label: ILabelSate,
  links: ILinksState,
  name: INameState,
  role: IRoleState,
  height: number,
  nav: IInfoState,
}

const s0: IMenuState = {
  photo: {
    borderRadius: 17,
    left: 50,
    top: 15,
    translateX: -105,
    translateY: 0,
    scale: 1
  },
  label: {
    left: 50,
    top: 15,
    translateX: 5,
    translateY: 10,
    height: 80
  },
  nav: {
    opacity: 0
  },
  links: {
    opacity: 1,
    height: 30,
    top: 110,
  },
  name: {
    translateY: -110,
    opacity: 0
  },
  role: {
    fontSize: 14,
    opacity: 0.9
  },
  height: 185,
};

const s1: IMenuState = {
  photo: {
    borderRadius: 50,
    left: 0,
    top: 9,
    translateX: -14,
    translateY: -33,
    scale: 0.4
  },
  label: {
    left: 50,
    top: 25,
    translateX: -50,
    translateY: 0,
    height: 15
  },
  nav: {
    opacity: 1
  },
  links: {
    opacity: 0,
    height: 0,
    top: 30,
  },
  name: {
    translateY: 10,
    opacity: 1
  },
  role: {
    fontSize: 10,
    opacity: 0.5
  },
  height: 75,
};

function pseudoSigmoid(x: number): number {
  // return x <= 0 ? 0 : x >= 1 ? 1 : (1 - Math.cos(Math.PI * x)) * 0.5;
  return x <= 0 ? 0 : x >= 1 ? 1 : x;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  @Input('profile') p!: IMenuProfile;
  c1 = 1;
  c2 = 0;

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
    return  this.p.avatar ? `background-image: url(${this.p.avatar});`: '';
  }

  getRole(): string {
    return this.p.role && this.p.role.length > 3 ?
      this.p.role.trim().replace(', ', '<br>') :
      ''
  }
}
