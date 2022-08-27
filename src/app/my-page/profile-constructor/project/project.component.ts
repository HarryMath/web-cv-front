import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IProject, IProjectLink} from '../../../shared/models';
import { MessageService } from '../../../shared/message.service';
import { QuestionService } from '../../../shared/question.service';
import { ProjectsService } from '../../../shared/projects.service';
import {ImagesService} from '../../../shared/images.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass', '../../my-page.component.sass']
})
export class ProjectComponent implements OnInit {

  @Input('project') project!: IProject;
  @Input('isNew') isNew = false;
  @Output('onDelete') onDelete = new EventEmitter();
  previousDescriptionVersion = '';
  previousVersion!: IProject;
  isLoading = false;
  @ViewChild('tagInput') tagInput!: ElementRef;
  lastTag = '';
  tagsOnFocus = false;

  newLink: IProjectLink = {link: '', label: ''};
  selectingLink = false;
  editingLink = false;
  linkOnEditIndex = -1;

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
    return `min-height: calc(${linesAmount * 1.6}rem)`
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
    const title = this.project.title.length > 2 ?
      `Select image for '${this.project.title}' project` :
      'Select image';
    this.imagesService.selectImage(title).then(value => {
      if (value) {
        this.project.image = value.publicUrl;
        this.save();
      }
    })
  }

  addTag(isBlur: boolean): void {
    this.tagsOnFocus = !isBlur;
    if (this.lastTag.length > 0) {
      this.project.tags.push(this.lastTag);
      this.lastTag = '';
    }
    if (this.tagsOnFocus) {
      this.tagInput.nativeElement.focus();
    }
    this.save();
  }

  handleBackspace($event: Event): void {
    if (this.lastTag.length === 0 && this.project.tags.length > 0) { // @ts-ignore
      this.lastTag = this.project.tags.pop()
      $event.preventDefault();
    }
  }

  getTagsClass(): string {
    return (this.tagsOnFocus ? 'focus ' : '') +
      (this.project.tags.length > 0 || this.lastTag.length > 0 ? 'filled' : '');
  }

  focusTags(): void {
    this.tagInput.nativeElement.focus();
    this.tagsOnFocus = true;
  }

  addLink(): void {
    this.newLink = {link: '', label: ''};
    this.selectingLink = true;
  }

  saveNewLink(link: IProjectLink): void {
    this.project.links.push(link);
    this.hideLinkWindow();
    this.save();
  }

  saveLink(): void {
    this.hideLinkWindow();
    this.save();
  }

  hideLinkWindow(): void {
    setTimeout(() => {
      this.selectingLink = false;
      this.editingLink = false;
    }, 200);
  }

  editLink(linkIndex: number): void {
    this.linkOnEditIndex = linkIndex;
    this.editingLink = true;
  }

  deleteLink(linkIndex: number): void {
    this.project.links.splice(linkIndex, 1);
    this.save();
  }
}
