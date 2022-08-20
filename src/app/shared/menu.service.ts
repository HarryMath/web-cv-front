import {HostListener, Injectable} from '@angular/core';

export interface MenuItem {
  svg: string;
  name: string;
  link: string;
  state: ''|'active'|'passed';
}

@Injectable({providedIn: 'root'})
export class MenuService {

  sections: NodeListOf<any> = document.querySelectorAll('.s-w');
  content: any;
  private readonly defaultItems: MenuItem[] = [
    {svg: 'assets/icons/user.svg', name: 'About me', link: 'intro', state: ''},
    {svg: 'assets/icons/experience.svg', name: 'Experience', link: 'experience', state: ''},
    {svg: 'assets/icons/code.svg', name: 'Skills', link: 'skills', state: ''},
    {svg: 'assets/icons/projects.svg', name: 'Portfolio', link: 'projects', state: ''},
    {svg: 'assets/icons/edu.svg', name: 'Education', link: 'education', state: ''},
    {svg: 'assets/icons/message.svg', name: 'Contacts', link: 'contacts', state: ''},
  ];
  menuItems: MenuItem[] = [];
  lastPosition = 0;
  scroll: number = 0;
  progressStyle = '';
  scrollProgress = '';
  menuActive = false;
  isMobile = false;
  screenHeight = 'min-height: 100vh';

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  init(): void {
    this.isMobile = window.innerWidth <= 640;
    this.screenHeight = 'min-height:' + window.innerHeight + 'px';
    this.sections = document.querySelectorAll('.s-w');
    this.menuItems = [];
    this.sections.forEach(s => {
      const item = this.defaultItems.find(i => i.link == s.getAttribute('id'));
      if (item) this.menuItems.push(item);
    });
    this.content = document.querySelector('.content');
    this.handleScroll(true);
    const h = {px: 23 * this.menuItems.length, vw: 1.15 * this.menuItems.length};
    this.progressStyle = this.isMobile ? 'height: calc(2px + 0.1vw)' : `height: calc(${h.px}px + ${h.vw}vw)`;
  }

  handleScroll(rewrite: boolean): void {
    this.scroll = this.content.scrollTop;
    if (this.isMobile) {
      this.scrollProgress =	`width: ${this.scroll / (this.content.scrollHeight - window.innerHeight) * 100}%`;
      return;
    }
    const shouldRewriteClasses = Math.abs(
      this.lastPosition - this.scroll / this.content.scrollHeight
    ) > 0.01 || rewrite;
    let scrolledSections = 0;
    let scrolledSectionsTotalHeight = 0;
    for (let i = 0; i < this.sections.length; i++) {
      scrolledSectionsTotalHeight += this.sections[i].offsetHeight;
      if (shouldRewriteClasses) {
        this.menuItems[i].state = 'passed';
      }
      if ( scrolledSectionsTotalHeight - window.innerHeight * 0.5  >= this.scroll) {
        if (shouldRewriteClasses) {
          this.menuItems[i].state = 'active';
        }
        break;
      }
      scrolledSections++;
    }
    if (shouldRewriteClasses) {
      this.lastPosition = this.scroll / this.content.scrollHeight;
      for (let i = scrolledSections + 1; i < this.sections.length; i++) {
        this.menuItems[i].state = '';
      }
    }
    let progress = 0;
    let scrollTop = this.scroll;
    let s;
    for (let i = 0; i < this.sections.length; i++) {
      s = this.sections[i];
      progress += Math.min(1, scrollTop / s.offsetHeight) / (this.sections.length - 0.5);
      scrollTop -= s.offsetHeight;
      if (scrollTop <= 0) {
        break;
      }
    }
    this.scrollProgress =	`height: calc(8px + ${progress * 100}%)`;
  }

  goToSection(link: string) {
    try { // @ts-ignore
      document.getElementById(link).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } catch (ignore) {}
  }
}
