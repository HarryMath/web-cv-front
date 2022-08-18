import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page.component';
import { RouterModule } from '@angular/router'
import {ProjectComponent} from '../project/project.component';
import {FeedbackComponent} from './feedback/feedback.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    ProfilePageComponent,
    ProjectComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '**', component: ProfilePageComponent
    }]),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfilePageModule { }
