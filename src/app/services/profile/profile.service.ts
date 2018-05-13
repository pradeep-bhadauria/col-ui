import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { Keywords } from './../../models';

@Injectable()
export class ProfileService {

  constructor(private http: Http) { }

  getMyArticles(offset: number, limit: number) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(Constants.API_ENDPOINT + '/articles/search/user/' + user.id + "/" + offset + "/" + limit, Constants.jwt()).map(
      (response: Response) => response.json()
    );
  }

  getMyArticlesCount() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(Constants.API_ENDPOINT + '/articles/search/user/' + user.id + "/count", Constants.jwt()).map(
      (response: Response) => response.json()
    );
  }

}
