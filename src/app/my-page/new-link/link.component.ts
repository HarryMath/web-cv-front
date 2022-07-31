import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IProjectLink} from '../../shared/models';

@Component({
  selector: 'app-new-link',
  templateUrl: './link.component.html',
  styleUrls: ['../my-page.component.sass', '../../pop-up/pop-up.component.sass']
})
export class LinkComponent implements OnInit {

  @Input('link') link!: IProjectLink;
  @Output() linkChange: EventEmitter<IProjectLink> = new EventEmitter<IProjectLink>();
  @Output('onCancel') onCancel: EventEmitter<void> = new EventEmitter<void>();

  public isShown = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {this.isShown = true}, 1);
  }

  select(): void {
    if (this.link.label.length < 2 && this.link.link.length < 10) {
      return;
    }
    this.linkChange.emit(this.link);
    this.hide();
  }

  cancel(): void {
    this.onCancel.emit();
    this.hide();
  }

  hide(): void {
    this.isShown = false;
  }

}
