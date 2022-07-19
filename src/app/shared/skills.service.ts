import {BasicHttpService} from './basic-http.service';
import {ISkill} from './models';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SkillsService extends BasicHttpService<ISkill> {
  constructor(protected override http: HttpClient) {
    super('skills', http);
  }
}
