import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { Categories } from './../../models/index';
import 'rxjs/Rx';

@Injectable()
export class CategoriesService {

    constructor(private http: Http) { }

    getCategories(categoriesId: number) {
        return this.http.get(
            Constants.API_ENDPOINT + '/categories/' + categoriesId, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    count() {
        return this.http.get(
            Constants.API_ENDPOINT + '/categories/count', this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    delete(categoriesId: number) {
        return this.http.delete(
            Constants.API_ENDPOINT + '/categories/' + categoriesId, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    getAll(offset: number, limit: number) {
        return this.http.get(
            Constants.API_ENDPOINT + '/categories/' + offset + "/" + limit, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    search(query: String, offset: number, limit: number) {
        let body = undefined;
        body = {
            query: query
        }
        return this.http.post(
            Constants.API_ENDPOINT + '/categories/search/' + offset + "/" + limit, body, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    searchCount(query: String) {
        let body = undefined;
        body = {
            query: query
        }
        return this.http.post(
            Constants.API_ENDPOINT + '/categories/search-count', body, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    update(id: number, name: string, desc: string) {
        let body = undefined;
        let user = JSON.parse(localStorage.getItem('currentUser'));
        body = {
            cat_name: name,
            cat_desc: desc,
            user: user.id.toString()
        }
        return this.http.put(
            Constants.API_ENDPOINT + '/categories/' + id, body, this.jwt()).map(
                (response: Response) => response.json()
            );
    }

    add(name: string, desc: string) {
        let body = undefined;
        let user = JSON.parse(localStorage.getItem('currentUser'));
        body = {
            cat_name: name,
            cat_desc: desc,
            user: user.id.toString()
        }
        return this.http.post(
            Constants.API_ENDPOINT + '/categories/', body, this.jwt()).map(
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
