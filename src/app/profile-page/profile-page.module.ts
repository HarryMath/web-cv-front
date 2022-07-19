import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page.component';
import { RouterModule } from '@angular/router'
import { MenuComponent } from './menu/menu.component'
import { EducationBlockComponent } from './blocks/education-block/education-block.component';
import { SkillsBlockComponent } from './blocks/skills-block/skills-block.component';


@NgModule({
  declarations: [
    ProfilePageComponent,
    MenuComponent,
    EducationBlockComponent,
    SkillsBlockComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '**', component: ProfilePageComponent
    }])
  ]
})
export class ProfilePageModule { }
