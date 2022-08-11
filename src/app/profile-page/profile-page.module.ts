import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page.component';
import { RouterModule } from '@angular/router'
import {MenuComponent} from './menu/menu.component';
import {ProjectComponent} from '../project/project.component';
import {FeedbackComponent} from './feedback/feedback.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ProfilePageComponent,
    ProjectComponent,
    FeedbackComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '**', component: ProfilePageComponent
    }]),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfilePageModule { }
