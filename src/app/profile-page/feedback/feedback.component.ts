import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../../shared/message.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.sass']
})
export class FeedbackComponent {

  @Input('id') profileId!: number;
  @ViewChild('name') nameEl!: ElementRef;
  @ViewChild('contact') contactEl!: ElementRef;
  @ViewChild('message') messageEl!: ElementRef
  body = {
    name: '',
    contact: '',
    text: '',
  };
  isLoading = false;

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  async send(): Promise<void> {
    this.isLoading = true;
    this.http.post(`profiles/${this.profileId}/feedback`, this.body).subscribe({
      next: () => {
        this.isLoading = false;
        this.message.show('Message sent!', 1);
        this.body.text = '';
      },
      error: e => {
        this.isLoading = false;
        console.warn(e);
        this.message.show('your message not sent, contact using another method, please', -1);
      }
    });
  }

  satisfy(): boolean {
    return true;
  }
}
