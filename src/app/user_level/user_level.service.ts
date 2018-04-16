import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService } from './../utils/index';
import {UserLevel} from './user_level.model';

@Injectable()
export class UserLevelService {
    constructor(private http: Http) { }

    getUserLevel(userLevelId: number) {
        return this.http.get( 
            Constants.API_ENDPOINT + '/user-level/' + userLevelId, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    getAll(offset: number) {
        return this.http.get( 
            Constants.API_ENDPOINT + '/user-level/offset/' + offset, this.jwt()).map(
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