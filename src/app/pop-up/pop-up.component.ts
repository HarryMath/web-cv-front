import { Component } from '@angular/core';
import {QuestionService} from '../shared/question.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.sass']
})
export class PopUpComponent {
  constructor(public service: QuestionService) { }
}
