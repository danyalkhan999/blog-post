import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.css'
})
export class ImageViewComponent {
  @Input()
  source!: any;

  @Input()
  size!: string;

  getsize(){
    if(this.size === 'small'){
      return 'small';
    }
    if(this.size === 'medium'){
      return 'medium';
    }
    if(this.size === 'large'){
      return 'large';
    }
    return "small";
  }
}
