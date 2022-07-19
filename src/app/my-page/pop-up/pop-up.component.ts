import { Component, OnInit } from '@angular/core';
import {QuestionService} from '../../shared/question.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.sass']
})
export class PopUpComponent implements OnInit {

  constructor(public service: QuestionService) { }

  ngOnInit(): void {
  }

}
