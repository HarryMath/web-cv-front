import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthInterceptor} from "../auth.interceptor";

export interface IUser {
  id: number;
  login: string;
  fullName: string;
  email: string;
}

export interface IAuthResponse {
  success: boolean,
  statusCode: number;
}

const GITHUB_ID = 'b1730c9f1f4f0732ad76';
const GITHUB_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_SCOPE = 'read:user%20user:email'

@Injectable({providedIn: 'root'})
export class AuthService {

  user: IUser = {id: -1, login: '', fullName: '', email: ''}

  constructor(
    private authInterceptor: AuthInterceptor,
    private http: HttpClient
  ) {
  }

  public signIn(email: string, password: string): Promise<IAuthResponse> {
    return new Promise<IAuthResponse>(resolve => {
      const subscription = this.http.post('auth', {email, password}).subscribe({
        next: (response: any) => {
          subscription.unsubscribe();
          if (response.token && response.token.length > 10) {
            this.authInterceptor.setToken(response.token);
            resolve({
              success: true,
              statusCode: 200
            });
          } else {
            console.log('bad response: ', response);
            resolve({
              success: false,
              statusCode: 200
            });
          }
        },
        error: (error) => {
          console.log(error);
          resolve({
            success: false,
            statusCode: error.status
          });
        }
      });
    });
  }

  public signUp(fullName: string, email: string, password: string): Promise<IAuthResponse> {
    return new Promise<IAuthResponse>(resolve => {
      const subscription = this.http.post('profiles', {fullName, email, password}).subscribe({
        next: () => {
          subscription.unsubscribe();
          resolve({
            success: true,
            statusCode: 201
          });
        },
        error: (error) => {
          console.warn(error);
          resolve({
            success: false,
            statusCode: error.status
          });
        }
      });
    });
  }

  public authWithGithub(): void {
    window.location.href = `${GITHUB_URL}?client_id=${GITHUB_ID}&scope=${GITHUB_SCOPE}`;
  }

  public handleGithubAuth(payload: {code: string}): Promise<IAuthResponse> {
    return new Promise(resolve => {
      const subscription = this.http.post('auth/github', payload).subscribe({
        next: (response: {token?: string}) => {
          subscription.unsubscribe();
          if (response.token && response.token.length > 10) {
            this.authInterceptor.setToken(response.token);
            resolve({success: true, statusCode: 200});
          } else {
            console.log('bad response: ', response);
            resolve({success: false, statusCode: 500});
          }
        },
        error: (error) => {
          console.log(error);
          resolve({success: false, statusCode: error.status});
        }
      })
    });
  }
}
