import {Injectable} from '@angular/core';

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
  scrollProgress = '';
  menuActive = false;
  screenHeight = 'min-height: 100vh';
  progressHeight = '';

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  findSections(): void {
    this.screenHeight = 'min-height:' + window.innerHeight + 'px';
    this.sections = document.querySelectorAll('.s-w');
    this.menuItems = [];
    this.sections.forEach(s => {
      const item = this.defaultItems.find(i => i.link == s.getAttribute('id'));
      if (item) this.menuItems.push(item);
    });
    this.content = document.querySelector('.content');
    this.handleScroll(true);
    const h = {px: 24 * this.menuItems.length, vw: 1.2 * this.menuItems.length};
    this.progressHeight = `height: calc(${h.px}px + ${h.vw}vw)`;
  }

  async handleScroll(rewrite: boolean): Promise<void> {
    const shouldRewriteClasses = Math.abs(
      this.lastPosition - this.content.scrollTop / this.content.scrollHeight
    ) > 0.01 || rewrite;
    let scrolledSections = 0;
    let scrolledSectionsTotalHeight = 0;
    for (let i = 0; i < this.sections.length; i++) {
      scrolledSectionsTotalHeight += this.sections[i].offsetHeight;
      if (shouldRewriteClasses) {
        this.menuItems[i].state = 'passed';
      }
      if ( scrolledSectionsTotalHeight - window.innerHeight * 0.5  >= this.content.scrollTop) {
        if (shouldRewriteClasses) {
          this.menuItems[i].state = 'active';
        }
        break;
      }
      scrolledSections++;
    }
    if (shouldRewriteClasses) {
      this.lastPosition = this.content.scrollTop / this.content.scrollHeight;
      for (let i = scrolledSections + 1; i < this.sections.length; i++) {
        this.menuItems[i].state = '';
      }
    }
    let progress = 0;
    let scrollTop = this.content.scrollTop;
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
