import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IProfile, IProfileRefresh, IProfileUpdate, MyProfile} from './models';

@Injectable({providedIn: 'root'})
export class ProfilesService {
  constructor(private http: HttpClient) {
  }

  getMyProfile(): Promise<MyProfile> {
    return new Promise<MyProfile>((resolve, reject) => {
      this.http.get<MyProfile>('profiles/me/view').subscribe({
        next: p => resolve(p),
        error: e => reject(e)
      });
    });
  }

  getProfile(login: string): Promise<IProfile> {
    return new Promise<IProfile>((resolve, reject) => {
      this.http.get<IProfile>(`profiles/${login}`).subscribe({
        next: p => resolve(p),
        error: e => reject(e)
      });
    });
  }

  updateProfileInfo(p: MyProfile): Promise<MyProfile> {
    const update = {
      avatar: p.avatar,
      birthDay: p.birthDay,
      birthMonth: p.birthMonth,
      birthYear: p.birthYear,
      currentLocation: p.currentLocation,
      intro: p.intro,
      role: p.role,
    };
    return new Promise<MyProfile>(((resolve, reject) => {
      this.http.patch<MyProfile>('profiles', update).subscribe({
        next: p => resolve(p),
        error: e => reject(e)
      });
    }));
  }

  updateSettings(p: MyProfile): Promise<MyProfile> {
    const update: IProfileUpdate = {
      lang: p.lang,
      isPublic: p.isPublic,
      sendNotifications: p.sendNotifications
    };
    return new Promise<MyProfile>(((resolve, reject) => {
      this.http.patch<MyProfile>('profiles', update).subscribe({
        next: p => resolve(p),
        error: e => reject(e)
      });
    }));
  }
}
