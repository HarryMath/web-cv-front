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
  nameError = false;
  contactError = false;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  async send(): Promise<void> {
    if (this.body.name.length < 2) {
      this.message.show('Specify your name, please', -1);
      this.nameEl.nativeElement.focus();
      this.nameError = true;
      return;
    }
    if (this.body.contact.length < 5) {
      this.message.show('Specify the contact, please', -1);
      this.contactEl.nativeElement.focus();
      this.contactError = true;
      return;
    }
    this.isLoading = true;
    this.nameError = this.contactError = false;
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
