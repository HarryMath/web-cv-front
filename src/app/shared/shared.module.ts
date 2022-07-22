import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubblesComponent } from './bubbles/bubbles.component';
import {MenuComponent} from './menu/menu.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BubblesComponent, MenuComponent],
  exports: [BubblesComponent, MenuComponent]
})
export class SharedModule {}
