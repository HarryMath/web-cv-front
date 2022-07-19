import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IProfile, MyProfile} from "./models";

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
}
