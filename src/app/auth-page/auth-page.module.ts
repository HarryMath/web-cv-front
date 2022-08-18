import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthPageComponent } from './auth-page.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {BubblesComponent} from './bubbles/bubbles.component';


@NgModule({
  declarations: [
    AuthPageComponent,
    BubblesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '**', component: AuthPageComponent}
    ]),
    FormsModule
  ],
})
export class AuthPageModule { }
