import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProject } from '../../shared/models';
import { MessageService } from '../../shared/message.service';
import { QuestionService } from '../../shared/question.service';
import { ProjectsService } from '../../shared/projects.service';
import {ImagesService} from '../../shared/images.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['../my-page.component.sass', './project.component.sass']
})
export class ProjectComponent implements OnInit {

  @Input('project') project!: IProject;
  @Input('isNew') isNew = false;
  @Output('onDelete') onDelete = new EventEmitter();
  previousDescriptionVersion = '';
  previousVersion!: IProject;
  isLoading = false;

  constructor(
    private message: MessageService,
    private service: ProjectsService,
    private popup: QuestionService,
    public imagesService: ImagesService
  ) { }

  ngOnInit(): void {
    this.previousDescriptionVersion = this.project.description;
    this.previousVersion = {...this.project};
  }

  getDescriptionMinHeight(): string {
    const lines = this.project.description.split('\n');
    const linesAmount = lines.length + lines.filter(l => l.length > 200)
      .reduce((prev: number, next: string) => {
        return prev + Math.floor(next.length / 200)
      }, 0);
    return `min-height: calc(${linesAmount * 16}px + ${linesAmount * 0.75}vw)`
  }

  checkDescription(): void {
    if (
      this.project.description.includes('<') ||
      this.project.description.includes('>')
    ) {
      this.project.description = this.previousDescriptionVersion;
      this.message.show('HTML is not allowed.', -1);
    } else {
      this.previousDescriptionVersion = this.project.description;
    }
  }

  async delete(): Promise<void> {
    const submitted = await this.popup.ask(
      'Delete project',
      ['You will not be able to cancel this action.',
        this.project.title.length > 1 ?
          'Are you sure you want to delete project "' + this.project.title + '"?':
          'Are you sure you want to delete this project?'],
      'delete', 'cancel', 'danger'
    );
    if (!submitted) {return;}
    this.isLoading = true;
    this.deleteProject();
  }

  private async deleteProject(): Promise<void> {
    if (!this.isNew) {
      try {
        await this.service.delete(this.project.id);
      } catch (e) {
        console.warn(e);
        this.message.show('Error occurred while deleting. refresh the page and try again, please.');
        return;
      }
    }
    this.onDelete.emit();
  }

  async save(): Promise<void> {
    if (
      this.project.title.length < 2 ||
      this.project.role.length < 2 ||
      this.equals(this.project, this.previousVersion)
    ) {
      return;
    }
    try {
      if (this.isNew) {
        const result = await this.service.save(this.project);
        console.info('saved: ', result);
        this.project.id = result.id;
        this.isNew = false;
      } else {
        const result = await this.service.update(this.project);
        console.info('updated: ', result);
      }
      this.previousVersion = {...this.project};
    } catch (e) {
      this.project = {...this.previousVersion};
      console.warn(e);
      this.message.show('Error while saving experience. refresh the page and try again, please.')
    }
  }

  private equals(e1: IProject, e2: IProject) {
    return e1.title === e2.title &&
      e1.links === e2.links &&
      e1.tags === e2.tags &&
      e1.image === e2.image &&
      e1.place === e2.place &&
      e1.description === e2.description &&
      e1.role === e2.role;
  }

  getBackgroundPhoto(): string {
    return this.project.image && this.project.image.length > 10 ?
      `background-image: url('${this.project.image}')` : '';
  }

  selectImage(): void {
    this.imagesService.selectImage().then(value => {
      if (value) {
        this.project.image = value.publicUrl;
        this.save();
      }
    })
  }
}
