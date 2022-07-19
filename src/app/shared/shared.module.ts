import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubblesComponent } from './bubbles/bubbles.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BubblesComponent],
  exports: [BubblesComponent]
})
export class SharedModule {}
