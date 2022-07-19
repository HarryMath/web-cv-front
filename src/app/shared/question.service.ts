import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class QuestionService {
  title = '';
  questionRows: string[] = [];
  submitText = '';
  cancelText = '';
  questionClass: 'default'|'green'|'danger'|'' = 'default'
  isShown = false;
  displayed = false;
  answer = new Subject<boolean>();

  ask(
    title: string,
    question: string[],
    submit: string = 'ok',
    cancel: string = 'cancel',
    questionClass: 'default'|'green'|'danger'|'' = 'default'
  ): Promise<boolean> {
    this.displayed = true;
    setTimeout(() => this.isShown = true, 1);
    this.title = title;
    this.submitText = submit;
    this.cancelText = cancel;
    this.questionRows = question;
    this.questionClass = questionClass;
    return  new Promise<boolean>(resolve => {
      const subscription = this.answer.subscribe(next => {
        subscription.unsubscribe();
        this.isShown = false;
        setTimeout(() => this.displayed = false, 200);
        resolve(next);
      });
    });
  }
}
