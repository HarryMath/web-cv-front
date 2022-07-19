import {BasicHttpService} from './basic-http.service';
import {IEducation} from './models';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class EducationService extends BasicHttpService<IEducation> {

  constructor(protected override http: HttpClient) {
    super('educations', http);
  }
}
