import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './image-tooltip.component.html',
  styleUrl: './image-tooltip.component.css'
})
export class ImageTooltipComponent {

  @Input() index!: number;
  @Input() setSizeFunction!: (index: number, size: string) => void;

  setSize(size: string) {
    this.setSizeFunction(this.index, size);
  }
  
}
