import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {IProject} from '../shared/models';
import {IPalette} from '../shared/color.service';

type IProjectView = IProject & {colors: IPalette, parsed: boolean};

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
  rectStyle: string = '';

  constructor() { }

  async openFullScreen(): Promise<void> {
    const pos = this.el.nativeElement.getBoundingClientRect();
    this.rectStyle = `top: ${pos.top}px; left: ${pos.left}px; width: ${pos.width}px; height: ${pos.height}px`;
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

  getTitleColor(): string {
    if (!this.isFullScreen || !this.p.image || this.p.image.length < 10) {
      return '';
    }
    const c = this.p.colors.dominantLight;
    return `color: hsl(${c.h}deg ${c.s}% ${c.l}%);`;
  }

  getBackground(c: any): string {
    let back = `background-color: hsl(${c.h}deg ${c.s}% ${c.l}%);`
    back += 'color: ' + (c.l > 70 ? '#222' : '#fff');
    return back;
  }

  getTagsColor(): string {
    const g = this.p.colors.dominantDark;
    const l = Math.min(50 + g.l * 0.625, 100);
    return this.p.image && this.p.image.length > 10 ?
      `background-color: hsla(${g.h}deg ${g.s}% ${g.l}% / 95%); color: hsl(33deg 10% ${l}%);` : '';
  }
}
