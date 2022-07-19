import { Component, OnInit } from '@angular/core';
import {MessageService} from "../shared/message.service";

@Component({
  selector: 'app-message',
  template: `
  <div class="msg" [ngClass]="messageService.isShown ? 'v' : ''">
    <div class="txt">{{messageService.message}}</div>
    <div class="close" (click)="messageService.hide()">×</div>
  </div>`,
  styleUrls: ['./message.component.sass']
})
export class MessageComponent {

  constructor(public messageService: MessageService) { }

}
