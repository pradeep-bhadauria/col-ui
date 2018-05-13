import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { Categories } from './../../models/index';
import 'rxjs/Rx';

@Injectable()
export class PageService {

  constructor(private http: Http) { }

  getCategoryByName(name: string) {
    return this.http.get(
      Constants.API_ENDPOINT + '/categories/name/' + name, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }

  getSubCategoryByName(name: string) {
    return this.http.get(
      Constants.API_ENDPOINT + '/sub-categories/name/' + name, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }

  getArticleByUid(uid: string) {
    return this.http.get(
      Constants.API_ENDPOINT + '/articles/uid/' + uid, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }

}
