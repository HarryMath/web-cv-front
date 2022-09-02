import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {IProject} from '../shared/models';
import {IImageInfo} from '../shared/color.service';

type IProjectView = IProject & {colors: IImageInfo, parsed: boolean};

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass']
})
export class ProjectComponent {

  @Input('p') p!: IProjectView;
  @ViewChild('el') el!: ElementRef;
  isVisible = false;
  isFullScreen = false;
  isOpened = false;

  rectStyle = '';
  titleHeight = '';

  private colorsDefined = false;
  imageGradient = '';
  titleColor = '';
  labelColor = '';

  constructor() { }

  async openFullScreen(): Promise<void> {
    if (!this.colorsDefined) {
      this.setColors();
      this.colorsDefined = true;
    }
    const pos = this.el.nativeElement.getBoundingClientRect();
    this.rectStyle = `top: ${pos.top}px; left: ${pos.left}px; width: ${pos.width}px; height: ${pos.height}px; transform: none`;
    this.titleHeight = this.el.nativeElement.querySelector('.t').getBoundingClientRect().height + 'px';
    this.isVisible = true;
    setTimeout(() => this.isFullScreen = true, 10);
    setTimeout(() => this.isOpened = true, 310);
  }

  collapse(): void {
    this.isFullScreen = this.isOpened = false;
    setTimeout(() => {
      this.isVisible = false;
    }, 300)
  }

  getRectStyle(): string {
    return this.isVisible ?
      (this.isFullScreen ? '' : this.rectStyle) :
      'visibility: hidden; display: none; width: 0; height: 0;'
  }

  getProjectImage(): string {
    return this.p.image ? `background-image: url('${this.p.image}')` : '';
  }

  getPlace(): string {
    return this.p.place && this.p.place.length > 1 ? ' (' + this.p.place + ')' : '';
  }

  private setColors(): void {
    const isLight = this.p.colors.isLight;
    let c = isLight ? this.p.colors.light : this.p.colors.darkMax;
    this.imageGradient = isLight ?
      `linear-gradient(0deg, transparent 0%, hsla(${c.h}deg ${c.s}% ${c.l}% / ${40}%) 100%)` :
      `linear-gradient(0deg, hsla(${c.h}deg ${c.s}% ${c.l}% / ${25}%) 0%, hsl(${c.h}deg ${c.s}% ${c.l}%) 100%)`;
    if (!this.p.image || this.p.image.length < 15) {
      return;
    }
    c = this.p.colors.isLight ? this.p.colors.darkMax : this.p.colors.lightMax;
    this.titleColor = `hsl(${c.h}deg ${c.s}% ${c.l}%)`;
    this.labelColor = `hsl(${c.h}deg ${c.s * 0.3}% ${isLight ? c.l * 0.3 : c.l * 0.3 + 70}%)`;
  }
}
