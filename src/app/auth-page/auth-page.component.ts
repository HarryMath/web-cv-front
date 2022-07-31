import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MessageService} from "../shared/message.service";
import {AuthInterceptor} from "../auth.interceptor";

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.sass']
})
export class AuthPageComponent implements OnInit {

  email = '';
  password = '';
  fullName = '';
  @ViewChild('pass') passField!: ElementRef;
  @ViewChild('mail') mailField!: ElementRef;
  @ViewChild('name') nameField!: ElementRef;
  isLoading = false;
  isSignUp = false;

  bubbleEvent = new EventEmitter(false);

  constructor(
    public authService: AuthService,
    private authInterceptor: AuthInterceptor,
    private message: MessageService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const url = router.url.split('/');
    // ['', 'sign-in', 'github']
    if (url.length === 3) {
      const path = url[2].split('?')[0]
      if (path === 'github') {
        const params = this.route.snapshot.queryParams as any;
        if (params.code && params.code.length) {
          this.isLoading = true;
          this.authService.handleGithubAuth(params).then(res => {
            if (res.success) {
              this.router.navigate(['me']);
            } else {
              this.isLoading = false;
              this.message.show('Authorization with GitHub not succeeded. Try another method, please.', -1, 7000);
            }
          });
        } else {
          this.message.show('Authorization with GitHub failed. No code specified. Try another method, please.', -1, 7000);
        }
      }
    }
    this.isSignUp = url.length > 1 && url[1] === 'sign-up';
  }

  sign(): void {
    if (this.isLoading) return;
    if (!this.emailSatisfy()) {
      this.message.show('Provide valid email, please.', -1);
      this.mailField.nativeElement.focus();
      return;
    }
    if (!this.passwordSatisfy()) {
      this.message.show('Password length must be 4 symbols or more.', -1)
      this.passField.nativeElement.focus();
      return;
    }
    this.bubbleEvent.emit('center');
    this.passField.nativeElement.blur();
    this.mailField.nativeElement.blur();
    this.isLoading = true;
    if (this.isSignUp) {
      this.signUp();
      this.nameField.nativeElement.blur();
    } else {
      this.signIn();
    }
  }

  private signUp(): void {
    if (!this.nameSatisfy()) {
      this.message.show('Provide valid full name please.', -1)
      this.nameField.nativeElement.focus();
      return;
    }
    this.authService.signUp(this.fullName, this.email, this.password).then(res => {
      if (res.success) {
        this.message.showLongText([`Activation link was sent to ${this.email} address.`,
            `Click on it and then sign in with your mail and password.`],
          1, 60000);
        this.isSignUp = false;
      } else {
        this.isLoading = false;
        if (res.statusCode === 409) {
          this.mailField.nativeElement.focus();
          this.message.show('This email is already taken', -1)
        } else {
          console.warn(res);
          this.message.show(
            'Sorry, something went wrong. We are doing the best to fix the problem.', -1);
        }
      }
    });
  }

  private signIn(): void {
    this.authService.signIn(this.email, this.password).then(res => {
      if (res.success) {
        this.router.navigate(['me']);
      } else {
        this.isLoading = false;
        if (res.statusCode === 403) {
          this.passField.nativeElement.focus();
          this.message.show('Invalid login or password', -1);
        } else {
          console.warn(res);
          this.message.show('Sorry, something went wrong. We are doing the best tot fix the problem.', -1);
        }
      }
    });
  }

  nameSatisfy(): boolean {
    const n = this.fullName.trim();
    return n.length > 4 && n.includes(' ');
  }

  emailSatisfy(): boolean {
    const emailParts = this.email.split('@');
    return this.email.includes('@') &&
      emailParts[0].length > 2
      && emailParts[1].length > 2
      && emailParts[1].includes('.');
  }

  passwordSatisfy(): boolean {
    return this.password.length > 3;
  }

  focusPassword(): void {
    this.passField.nativeElement.focus();
  }

  focusEmail(): void {
    this.mailField.nativeElement.focus();
  }

  async getParams(): Promise<any> {
    return new Promise((resolve => {
      const subscription = this.route.queryParamMap.subscribe(params => {
        subscription.unsubscribe();
        resolve(params);
      });
    }));
  }

  ngOnInit(): void {
  }

  satisfy(): boolean {
    return this.passwordSatisfy() && this.emailSatisfy() && (!this.isSignUp || this.nameSatisfy());
  }
}
