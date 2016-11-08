/**
 * Created by dispensable on 2016/11/8.
 */
import { Component, ElementRef } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Api } from '../../shared/api';

@Component({
  selector: 'file-upload',
  templateUrl: './fileupload.component.html',
})
export class FileUploadComponent {
  constructor(private http: Http, private el: ElementRef) {}

  token: string = localStorage.getItem('token');
  headers = new Headers({'Access-token': this.token});
  options = new RequestOptions({ headers: this.headers });
  // file_srcs: string[] = []; // 用来预览多张图片
  file_src: string;

  upload(note: string, img_header: string) {
    let inputEl = this.el.nativeElement.firstElementChild;
    if (inputEl.files.length > 0) { // a file was selected
      let file:File = inputEl.files[0];

      if (!(file.size < 10000000 && (file.type == 'image/png' || file.type == 'image/jpeg'))) {
        console.log('too large or not image.');
        return;
      }

      let formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("creater_id", localStorage.getItem('userid'));
      formData.append("note", note);
      formData.append("img_header", img_header);

      this.http
          .post(Api.postImg(), formData, this.options).subscribe(
        success => {
          this.file_src = '';
          //TODO: nav to new location
        },
        error => console.log(error)
      );
    }
  }

  fileChange(){

    let inputEl = this.el.nativeElement.firstElementChild;
    if (inputEl.files.length < 0) {return;}

    let img = document.createElement("img");
    img.src = window.URL.createObjectURL(inputEl.files[0]);

    let reader = new FileReader();

    // Add an event listener to deal with the file when the reader is complete
    reader.addEventListener("load", (event) => {
      // Get the event.target.result from the reader (base64 of the image)
      img.src = event.target.result;

      // Resize the image
      var resized_img = this.resize(img);

      // Push the img src (base64 string) into our array that we display in our html template
      this.file_src = resized_img;
    }, false);

    reader.readAsDataURL(inputEl.files[0]);
  }


  resize (img, MAX_WIDTH:number = 900, MAX_HEIGHT:number = 900){
    var canvas = document.createElement("canvas");

    console.log("Size Before: " + img.src.length + " bytes");

    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, width, height);

    var dataUrl = canvas.toDataURL('image/jpeg');
    // IMPORTANT: 'jpeg' NOT 'jpg'
    console.log("Size After:  " + dataUrl.length  + " bytes");
    return dataUrl
  }
}
