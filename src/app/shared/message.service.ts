import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class MessageService {

  isShown: boolean = false;
  message: string[] = [];
  timeout: number = 0;

  public show(message: string, status: -1|0|1 = 0, durationMs = 6000): void {
    this.showLongText([message], status, durationMs);
  }

  public showLongText(message: string[], status: -1|0|1 = 0, durationMs = 6000): void {
    this.hide();
    this.message = message;
    this.isShown = true;
    if (status === -1) {
      try {
        window.navigator.vibrate(30);
      } catch (ignore) {}
    }
    this.timeout = window.setTimeout(() => {
      this.hide();
    }, durationMs);
  }

  public hide(): void {
    clearTimeout(this.timeout);
    this.isShown = false;
  }

}
