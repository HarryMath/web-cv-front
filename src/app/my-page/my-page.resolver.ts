import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {MyProfile} from '../shared/models';
import {ProfilesService} from '../shared/profiles.service';

@Injectable({providedIn: 'root'})
export class MyPageResolver implements Resolve<MyProfile> {

  constructor(
    private profilesService: ProfilesService,
    private router: Router
  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Promise<MyProfile> {
    try {
      return await this.profilesService.getMyProfile();
    } catch (e) {
      this.router.navigate(['/sign-in']);
      return {} as any;
    }
  }
}
