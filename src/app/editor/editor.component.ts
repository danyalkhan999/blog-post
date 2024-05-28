import { AfterViewInit, Component, ComponentRef, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { FormArray, FormGroup, FormBuilder, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { ImageTooltipComponent } from '../image-tooltip/image-tooltip.component';
import { CommonModule } from '@angular/common';
import { BlogServiceService } from '../services/blog-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit, AfterViewInit{
    myForm!: FormGroup;
    items: any
    isVisible: boolean = false;
    selectedFile!: File | null;
    @ViewChild('textArea') textArea!: ElementRef;
    @ViewChild('titleTextArea') title!: ElementRef;
    @ViewChild('toggleButton') tgBtn!: ElementRef;
    visibilityArr: boolean[] = [false];
    focusIndex: number | null = null;
    @ViewChild('tooltipContainer', { read: ViewContainerRef }) tooltipContainer!: ViewContainerRef;
    tooltipComponentRef: ComponentRef<ImageTooltipComponent> | null = null;
    imageSizeClasses: string[] = []

    constructor(private elementRef:ElementRef, private blogService: BlogServiceService, private router: Router){}

    ngAfterViewInit(): void {
      this.autoResize();
      this.items = this.getitems()
      console.log("items", this.items);
    }

    ngOnInit(): void {
      this.myForm = new FormGroup({
        title: new FormControl(''),
        descriptions: new FormArray([
          new FormGroup({
            story: new FormControl(''),
            imageUrl: new FormControl(''),
            imageCaption: new FormControl(''),
            imageSize: new FormControl('small')
          })
        ])
      })
    }

  onDragOver(event: DragEvent) {
      event.preventDefault(); // Allow drop
  }

  onDrop(event: DragEvent,imInx:any) {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      this.toggleVisiblity(imInx);
      if (files && files.length > 0) {
          this.uplaodImage({ target: { files } }, imInx);
      }
  }

    getitems() {
      return (<FormArray>this.myForm.get('descriptions')).controls;
    }

    autoResize() {
      const textArea = this.textArea.nativeElement;
      // Reset height to shrink the text area initially, then set to scroll height
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }

    autoResizeTitle() {
      const textArea = this.title.nativeElement;
      // Reset height to shrink the text area initially, then set to scroll height
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }

  addContent(index: number) {
    const content = new FormGroup({
      story: new FormControl(''),
      imageUrl: new FormControl(''),
      imageSize: new FormControl('small')
    })

    const descriptions = (<FormArray>this.myForm.get('descriptions'))
    

    setTimeout(() => {
      const nextTextArea = this.elementRef.nativeElement.querySelector(`.descriptions .para:nth-child(${index + 2}) textarea`);
      if (nextTextArea) {
        nextTextArea.focus();
      }
    }, 0);
    descriptions.insert(index + 1, content); 
    this.visibilityArr.splice(index + 1, 0, false); 
  }

  toggleVisiblity(i:any){
    this.visibilityArr[i] = !this.visibilityArr[i];
    // this.isVisible = !this.isVisible;
    // let btn = this.tgBtn.nativeElement.innerText;
  }

  uplaodImage(event:any, index:any){
    console.log("index ===> ", index)
    console.log(event.target.files[0])
    const file = event.target.files[0];
    if(file && !file.type.match('image.*')){
      console.log("Please upload image File");
    }else{
      const image = this.convertToBase64(file);
      image.then((data:any) => {
        console.log("image", data);
        this.insertImageUrl(data, index);
      }).catch((err) => console.log(err))
      this.toggleVisiblity(index);
      this.blur()
    }
  }
  insertImageUrl(imageUrl: string, index: number) {
    console.log(index)
    const descriptions = this.myForm.get('descriptions') as FormArray;
    const descriptionFormGroup = descriptions.at(index) as FormGroup;
    descriptionFormGroup.get('imageUrl')!.setValue(imageUrl);
  }
  convertToBase64(imageFile: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(null);
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  getImage(item:any){
    console.log("item", item);
  }

  updateDescription(value:any, index:any){
    console.log(index)
    const descriptions = this.myForm.get('descriptions') as FormArray;
    const descriptionFormGroup = descriptions.at(index) as FormGroup;
    descriptionFormGroup.get('story')!.setValue(value);
    this.blur();
  }

  onFocus(index:number){
    this.focusIndex = index
  }

  blur(){
    this.focusIndex = null;
  }

  // showTooltip(index: number, event: MouseEvent) {
  //   if (this.tooltipComponentRef) {
  //     this.tooltipContainer.clear();
  //     this.tooltipComponentRef = null;
  //   }

  //   const componentRef = this.tooltipContainer.createComponent(ImageTooltipComponent);
  //   componentRef.instance.index = index;
  //   componentRef.instance.setSizeFunction = this.setImageSize.bind(this);
  //   this.tooltipComponentRef = componentRef;

  //   // Position the tooltip near the clicked image
  //   const tooltipElement = componentRef.location.nativeElement;
  //   tooltipElement.style.top = `${event.clientY}px`;
  //   tooltipElement.style.left = `${event.clientX}px`;
  // }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
      if (this.tooltipComponentRef && !this.elementRef.nativeElement.contains(event.target)) {
          this.hideTooltip();
      }
  }

  showTooltip(index: number, event: MouseEvent) {
      if (this.tooltipComponentRef) {
          this.tooltipContainer.clear();
          this.tooltipComponentRef = null;
      }

      const componentRef = this.tooltipContainer.createComponent(ImageTooltipComponent);
      componentRef.instance.index = index;
      componentRef.instance.setSizeFunction = this.setImageSize.bind(this);
      this.tooltipComponentRef = componentRef;

      // Position the tooltip near the clicked image
      const tooltipElement = componentRef.location.nativeElement;
      tooltipElement.style.top = `${event.clientY}px`;
      tooltipElement.style.left = `${event.clientX}px`;
  }

  hideTooltip() {
      this.tooltipContainer.clear();
      this.tooltipComponentRef = null;
  }

  // setImageSize(index: number, size: string) {
  //   console.log(index,size)
  //   // Implement the logic to actually change the image size, such as adding a class to the image.
  //   console.log(`Set image size for index ${index} to ${size}`);
  //   this.imageSizeClasses[index] = ''; 


  //   if (size === 'small') {
  //     this.imageSizeClasses[index] = 'small';
  //   } else if (size === 'medium') {
  //     this.imageSizeClasses[index] = 'medium';
  //   } else if (size === 'large') {
  //     this.imageSizeClasses[index] = 'large';
  //   }

  //   this.tooltipContainer.clear();
  //   this.tooltipComponentRef = null;
  // }

  setImageSize(index: number, size: string) {
    const descriptions = this.myForm.get('descriptions') as FormArray;
    const descriptionFormGroup = descriptions.at(index) as FormGroup;

    descriptionFormGroup.get('imageSize')!.setValue(size); // Store the size in the form

    this.tooltipContainer.clear();
    this.tooltipComponentRef = null;
}


  onSubmit(){
    // console.log("SUBMMITTED",this.myForm)
    const form = this.myForm.value;
    const json = JSON.stringify(form);
    console.log(json)
    this.blogService.setBlogPost(json);
    this.router.navigate(['article/preview'])
  }
}
