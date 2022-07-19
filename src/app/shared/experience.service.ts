import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IExperience} from './models';
import {BasicHttpService} from './basic-http.service';

@Injectable({providedIn: 'root'})
export class ExperienceService extends BasicHttpService<IExperience>{
  constructor(protected override http: HttpClient) {
    super('experiences', http);
  }
}
