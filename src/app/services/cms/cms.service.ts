import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { Keywords } from './../../models';

@Injectable()
export class CMSService {

  constructor(private http: Http) { }

  uploadImages(formData: FormData) {
    let headers = new Headers();
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Authorization', 'Bearer ' + currentUser.token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Constants.API_ENDPOINT + '/upload/images/' + currentUser.id, formData, options).map(
      (response: Response) => response.json()
    );
  }

  getCountries() {
    return this.http.get(Constants.API_ENDPOINT + '/countries/').map(
      (response: Response) => response.json()
    );
  }

  add(cat_id:string, sub_cat_id:string, subject:string,keywords,images,country:string, state:string) {
    let body = undefined;
    let user = JSON.parse(localStorage.getItem('currentUser'));
    body = {
      category: cat_id,
      sub_category: sub_cat_id,
      user: user.id,
      subject:subject,
      keywords:keywords,
      images:images,
      body:body,
      country:country,
      state:state
    }
    return this.http.post(
        Constants.API_ENDPOINT + '/sub-categories/', body, this.jwt()).map(
            (response: Response) => response.json()
        );
}

  // private helper methods
  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }

}
