import { Component, OnInit } from '@angular/core';
import { StoryBoardComponent } from './story-board/story-board.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { BlogServiceService } from '../services/blog-service.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [StoryBoardComponent, ImageViewComponent],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent implements OnInit{
  imageUrl: any = 'https://images.unsplash.com/photo-1716847214513-dfac4f00635b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    para: string = `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`
    title: string = "";
    blogData!:any;
    storyData: any = [];
    constructor(private blogService: BlogServiceService){}

    ngOnInit(): void {
      setTimeout(() => {
        const data = this.blogService.getBlogData();
        this.blogData = JSON.parse(data);
        console.log(this.blogData);
        this.title = this.blogData.title;
        this.storyData = this.blogData.descriptions;
      }, 1000);
    }





}
