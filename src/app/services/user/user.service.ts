import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { UserLevel } from './../../models/index';
import 'rxjs/Rx';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getByEmail(email: string) {
    let body = undefined;
    body = {
      user_email: email
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/users/email', body, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }

  add(fname: string, lname: string, dob: string, email: string, password: string) {
    let body = undefined;
    body = {
      user_dob: dob,
      user_email: email,
      user_fname: fname,
      user_level: Constants.ROLES.AUTHORS,
      user_lname: lname,
      user_password: password
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/users/', body, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }

  sendConfirmationEmail(email: String) {
    let body = undefined;
    body = {
      email: email
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/send-verification-link', body, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }

  confirmEmail(email: String, token: String) {
    let body = undefined;
    body = {
      email: email,
      token: token
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/auth/confirm-email', body, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }

  
  login(email: String, password: String) {
    let body = undefined;
    body = {
      email: email,
      password: password
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/login', body, Constants.jwt()).map(
        (response: Response) => response.json()
      );
  }
}
