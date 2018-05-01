import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import {UserLevel} from './../../models/index';
import 'rxjs/Rx';

@Injectable()
export class UserlevelService {

  constructor(private http: Http) { }

    getUserLevel(userLevelId: number) {
        return this.http.get( 
            Constants.API_ENDPOINT + '/user-level/' + userLevelId, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    count() {
        return this.http.get( 
            Constants.API_ENDPOINT + '/user-level/count', this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    delete(userLevelId: number) {
        return this.http.delete( 
            Constants.API_ENDPOINT + '/user-level/' + userLevelId, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    getAll(offset: number,limit: number) {
        return this.http.get( 
            Constants.API_ENDPOINT + '/user-level/' + offset + "/" + limit, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    search(query: String, offset: number,limit: number) {
        let body = undefined;
        body = {
            query: query
        }
        return this.http.post( 
            Constants.API_ENDPOINT + '/user-level/search/' + offset + "/" + limit, body, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    searchCount(query: String) {
        let body = undefined;
        body = {
            query: query
        }
        return this.http.post( 
            Constants.API_ENDPOINT + '/user-level/search-count', body, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    update(id: number, name: string, desc: string) {
        let body = undefined;
        body = {
            user_level_name: name,
            user_level_desc: desc
        }
        return this.http.put( 
            Constants.API_ENDPOINT + '/user-level/' + id,body, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    add(name: string, desc: string) {
        let body = undefined;
        body = {
            user_level_name: name,
            user_level_desc: desc
        }
        return this.http.post( 
            Constants.API_ENDPOINT + '/user-level/', body, this.jwt()).map(
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
