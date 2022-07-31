import { Component, OnInit } from '@angular/core';
import {ImagesService} from '../shared/images.service';
import {IImage} from '../shared/models';
import {QuestionService} from '../shared/question.service';
import {MessageService} from '../shared/message.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.sass']
})
export class ImagesComponent implements OnInit {

  loading = true;
  upLoadingPhoto = false;

  constructor(
    public service: ImagesService,
    private popup: QuestionService,
    private message: MessageService
  ) {
    this.service.loadImages().then(() => this.loading = false);
  }

  ngOnInit(): void {
  }

  async handleInput($event: Event): Promise<void> { // @ts-ignore
    if ($event.target.files && $event.target.files.length > 0) { // @ts-ignore
      const file: File = $event.target.files[0];// @ts-ignore
      window.uploaded = file;
      console.log(file);
      console.log(file.arrayBuffer());
      this.upLoadingPhoto = true;
      try {
        await this.service.saveImage(file);
      } catch (e) {
        this.message.show('Unavailable to upload image. Try again later, please.')
      }
      this.upLoadingPhoto = false;
    }
  }

  async delete(i: IImage): Promise<void> {
    const submitted = await this.popup.ask(
      'Delete photo',
      ['Are you sure?'],
      'delete', 'cancel', 'danger'
    );
    if (!submitted) {return;}
    // this.isLoading = true;
    this.deletePhoto(i);
  }

  private async deletePhoto(i: IImage): Promise<void> {
    const isDeleted = this.service.deleteImage(i.id);
    if (!isDeleted) {
      this.message.show('Error occurred while deleting. refresh the page and try again, please.');
    }
  }
}
