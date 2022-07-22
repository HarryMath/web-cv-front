import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPageComponent } from './my-page.component';
import { RouterModule } from '@angular/router';
import { MyPageResolver } from './my-page.resolver';
import { ProfilesService } from '../shared/profiles.service';
import { FormsModule } from '@angular/forms';
import { ExperienceComponent } from './experience/experience.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { EducationComponent } from './education/education.component';
import { SkillComponent } from './skill/skill.component';
import {ProjectComponent} from './project/project.component';
import {SharedModule} from '../shared/shared.module';
import {ImagesComponent} from '../images/images.component';

@NgModule({
  declarations: [
    MyPageComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectComponent,
    SkillComponent,
    DatePickerComponent,
    PopUpComponent,
    ImagesComponent
  ],
  providers: [ProfilesService],
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
