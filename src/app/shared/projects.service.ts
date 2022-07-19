import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {IProject} from './models';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ProjectsService extends BasicHttpService<IProject> {
  constructor(protected override http: HttpClient) {
    super('projects', http);
  }
}
