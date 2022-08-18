import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPageComponent } from './my-page.component';
import { RouterModule } from '@angular/router';
import { MyPageResolver } from './my-page.resolver';
import { ProfilesService } from '../shared/profiles.service';
import { FormsModule } from '@angular/forms';
import { ExperienceComponent } from './profile-constructor/experience/experience.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { EducationComponent } from './profile-constructor/education/education.component';
import {ProjectComponent} from './profile-constructor/project/project.component';
import {SharedModule} from '../shared/shared.module';
import {ImagesComponent} from '../images/images.component';
import {LinkComponent} from './new-link/link.component';
import {ProfileConstructorComponent} from './profile-constructor/profile-constructor.component';
import {SkillComponent} from './profile-constructor/skill/skill.component';
import {ViewsComponent} from './views/views.component';
import {SettingsComponent} from './settings/settings.component';
import {DaysChartComponent} from './views/days-chart/days-chart.component';

@NgModule({
  declarations: [
    MyPageComponent,
    ProfileConstructorComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectComponent,
    SkillComponent,
    DatePickerComponent,
    PopUpComponent,
    ImagesComponent,
    LinkComponent,
    ViewsComponent,
    SettingsComponent,
    DaysChartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: MyPageComponent, pathMatch: 'full', resolve: {profile: MyPageResolver}}
    ]),
    FormsModule
  ]
})
export class MyPageModule { }
