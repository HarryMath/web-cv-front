import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page.component';
import { RouterModule } from '@angular/router'
import {MenuComponent} from './menu/menu.component';


@NgModule({
  declarations: [
    ProfilePageComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '**', component: ProfilePageComponent
    }])
  ]
})
export class ProfilePageModule { }
