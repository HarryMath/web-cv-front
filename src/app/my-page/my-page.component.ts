import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IEducation, IExperience, IProject, ISkill, MyProfile} from '../shared/models';
import {MessageService} from "../shared/message.service";
import {MenuService} from '../shared/menu.service';
import {ImagesService} from '../shared/images.service';
import {ISelectDate} from './date-picker/date-picker.component';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.sass']
})
export class MyPageComponent implements OnInit {

  private static readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  profile!: MyProfile;
  isLoaded = false;
  slide: 'stats' | 'profile' | 'settings' = 'profile';

  constructor(
    private route: ActivatedRoute,
    private message: MessageService,
    public menuService: MenuService,
  ) {
    route.data.subscribe(({profile}) => {
      profile.intro = profile.intro || '';
      this.profile = profile;
      this.isLoaded = true;
    });
  }

  ngOnInit(): void {}

  getWrapperPosition(): string {
    return this.slide === 'stats' ? 'transform: translateX(calc(100vw - 50%))' :
      this.slide === 'settings' ? 'transform: translateX(calc(-100vw - 50%))' : '';
  }

  getSlideButtonPosition(): string {
    return this.slide === 'profile' ? 'transform: translateX(calc(35px + 1.75vw))' :
      this.slide === 'settings' ? 'transform: translateX(calc(70px + 3.5vw))' : '';
  }
}
