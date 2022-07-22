import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page.component';
import { RouterModule } from '@angular/router'
import { EducationBlockComponent } from './blocks/education-block/education-block.component';
import { SkillsBlockComponent } from './blocks/skills-block/skills-block.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ProfilePageComponent,
    EducationBlockComponent,
    SkillsBlockComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '**', component: ProfilePageComponent
    }])
  ]
})
export class ProfilePageModule { }
