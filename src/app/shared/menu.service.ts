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
  menuItems: MenuItem[] = [
    {svg: 'assets/icons/user.svg', name: 'About me', link: 'intro', state: ''},
    {svg: 'assets/icons/experience.svg', name: 'Experience', link: 'experience', state: ''},
    {svg: 'assets/icons/code.svg', name: 'Skills', link: 'skills', state: ''},
    {svg: 'assets/icons/projects.svg', name: 'Portfolio', link: 'projects', state: ''},
    {svg: 'assets/icons/edu.svg', name: 'Education', link: 'education', state: ''},
    {svg: 'assets/icons/message.svg', name: 'Contacts', link: 'contacts', state: ''},
  ];
  lastPosition = 0;
  scrollProgress = '';
  menuActive = false;
  screenHeight = 'min-height: 100vh';

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  findSections(): void {
    this.screenHeight = 'min-height:' + window.innerHeight + 'px';
    this.sections = document.querySelectorAll('.s-w');
    this.content = document.querySelector('.content');
    this.handleScroll(true);
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
    const progress = window.innerWidth > 610 ?
      100 * (
        scrolledSections +
        (this.content.scrollTop - scrolledSectionsTotalHeight + window.innerHeight) / this.sections[scrolledSections].offsetHeight
      ) / (this.sections.length - 1) :
      100 * this.content.scrollTop /
      (this.content.scrollHeight - this.sections[this.sections.length - 1].scrollHeight);
    this.scrollProgress =	`height: calc(8px + ${progress}%)`;
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
