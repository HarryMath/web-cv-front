import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { RouterModule, Routes } from '@angular/router';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  {path: 'me', loadChildren: () => import('./my-page/my-page.module').then(m => m.MyPageModule)},
  {path: 'sign-in', loadChildren: () => import('./auth-page/auth-page.module').then(m => m.AuthPageModule)},
  {path: 'sign-up', loadChildren: () => import('./auth-page/auth-page.module').then(m => m.AuthPageModule)},
  {path: '**', loadChildren: () => import('./profile-page/profile-page.module').then(m => m.ProfilePageModule)}
];

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
