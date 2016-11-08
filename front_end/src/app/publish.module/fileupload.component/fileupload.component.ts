/**
 * Created by dispensable on 2016/11/8.
 */
import { Component, ElementRef } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Api } from '../../shared/api';

@Component({
  selector: 'file-upload',
  template: '<input type="file" name="img">',
})
export class FileUploadComponent {
  constructor(private http: Http, private el: ElementRef) {}

  token: string = localStorage.getItem('token');
  headers = new Headers({'Access-token': this.token});
  options = new RequestOptions({ headers: this.headers });

  upload() {
    let inputEl = this.el.nativeElement.firstElementChild;
    console.log(inputEl);
    if (inputEl.files.length > 0) { // a file was selected
      let file:FileList = inputEl.files[0];
      console.log(file);

      if (!(file.size < 10000000 && (file.type == 'image/png' || file.type == 'image/jpeg'))) {
        console.log('too large or not image.');
        return;
      }

      let formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("post-by", localStorage.getItem('token'));

      this.http
          .post(Api.postImg(), formData, this.options).subscribe(
        success => console.log(success),
        error => console.log(error)
      );
    }
  }
}
