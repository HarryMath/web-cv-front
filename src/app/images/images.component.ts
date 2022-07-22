import { Component, OnInit } from '@angular/core';
import {ImagesService} from '../shared/images.service';
import {IImage} from '../shared/models';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.sass']
})
export class ImagesComponent implements OnInit {

  loading = true;

  constructor(public service: ImagesService) {
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
      await this.service.saveImage(file);
    }
  }
}
