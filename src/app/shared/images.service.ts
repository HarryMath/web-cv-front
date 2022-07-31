import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {IImage} from './models';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImagesService {

  selectWindowShown = false;
  isElementExist = false;
  images: IImage[] = [];
  title = 'Select photo';
  imageAnswer = new Subject<IImage|false>();

  constructor(private http: HttpClient) {}

  selectImage(title = 'Select photo'): Promise<IImage|false> {
    this.isElementExist = true;
    this.title = title;
    setTimeout(() => {this.selectWindowShown = true}, 1);
    return new Promise<IImage | false>(resolve => {
      const subscription = this.imageAnswer.subscribe(next => {
        subscription.unsubscribe();
        this.selectWindowShown = false;
        setTimeout(() => {this.isElementExist = false}, 300);
        resolve(next);
      });
    });
  }

  loadImages(): Promise<IImage[]> {
    return new Promise<IImage[]>(((resolve, reject) => {
      this.http.get<IImage[]>('images').subscribe({
        next: i => {
          this.images = i.reverse();
          resolve(i)
        },
        error: e => reject(e)
      });
    }));
  }

  async saveImage(file: File): Promise<IImage> {
    const formData = new FormData();
    formData.append("image", file);
    return new Promise((resolve, reject) => {
      const subscription = this.http.post<IImage>(
        "images", formData, {reportProgress: true, observe: 'events'}
      ).subscribe({
        next: (e) => {
          if (e.type === HttpEventType.UploadProgress) {
            if (e.total)
              console.log('upload progress: ' + Math.round(100 * (e.loaded / e.total)))
          } else if (e.type === HttpEventType.Response) {
            subscription.unsubscribe();
            if (e.status <= 299 && e.body) {
              console.log('file uploaded! ', e.body);
              this.images.unshift(e.body);
              resolve(e.body);
            } else {
              console.log('not uploaded with status code ' + e.status)
              reject(e);
            }
          }
        },
        error: (e) => {
          console.log('upload failed:', e);
          reject(e);
        }
      })
    });
  }

  async deleteImage(id: number): Promise<boolean> {
    return new Promise<boolean>(((resolve) => {
      this.http.delete<void>(`images?id=${id}`).subscribe({
        next: () => {
          const imgIndex = this.images.findIndex(i => i.id === id);
          if (imgIndex != -1)
            this.images.splice(imgIndex, 1);
          resolve(true)
        },
        error: e => {
          console.warn('[deleteImage]', e);
          resolve(false)
        }
      });
    }));
  }

  select(i: IImage): void {
    this.selectWindowShown = false;
    this.imageAnswer.next(i);
  }

  closeWindow(): void {
    this.selectWindowShown = false;
    this.imageAnswer.next(false);
  }
}
