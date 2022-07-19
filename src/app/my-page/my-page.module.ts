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

@NgModule({
  declarations: [
    MyPageComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectComponent,
    SkillComponent,
    DatePickerComponent,
    PopUpComponent
  ],
  providers: [ProfilesService],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: MyPageComponent, pathMatch: 'full', resolve: {profile: MyPageResolver}}
    ]),
    FormsModule
  ]
})
export class MyPageModule { }
