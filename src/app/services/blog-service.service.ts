import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogServiceService {
  blog: any = [];
  constructor() { }

  setBlogPost(data:any){
    this.blog = data;
    console.log("blog",this.blog)
  }

  getBlogData(){
    return this.blog;
  }

}
